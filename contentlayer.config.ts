import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import siteMetadata from './data/siteMetadata'
import GithubSlugger from 'github-slugger'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages

import { toMarkdown } from 'mdast-util-to-markdown'
import { mdxToMarkdown } from 'mdast-util-mdx'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import path from 'path'
import { writeFileSync } from 'fs'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { getLastEditedDate, urlFromFilePath } from './utils/util'
import { bundleMDX } from 'mdx-bundler'
const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

const computedFields: ComputedFields = {
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
    },
    path: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
    filePath: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFilePath,
    },
    toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
  }
/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = GithubSlugger.slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
    console.log('Local search index generated...')
  }
}

const tocPlugin =
  (headings: DocHeading[]): unified.Plugin =>
  () => {
    return (node: any) => {
      for (const element of node.children.filter((_: any) => _.type === 'heading' || _.name === 'OptionsTable')) {
        if (element.type === 'heading') {
          const title = toMarkdown({ type: 'paragraph', children: element.children }, { extensions: [mdxToMarkdown()] })
            .trim()
            .replace(/<.*$/g, '')
            .replace(/\\/g, '')
            .trim()
          headings.push({ level: element.depth, title })
        } else if (element.name === 'OptionsTable') {
          element.children
            .filter((_: any) => _.name === 'OptionTitle')
            .forEach((optionTitle: any) => {
              optionTitle.children
                .filter((_: any) => _.type === 'heading')
                .forEach((heading: any) => {
                  const title = toMarkdown(
                    { type: 'paragraph', children: heading.children },
                    { extensions: [mdxToMarkdown()] },
                  )
                    .trim()
                    .replace(/<.*$/g, '')
                    .replace(/\\/g, '')
                    .trim()
                  headings.push({ level: heading.depth, title })
                })
            })
        }
      }
    }
  }

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

export const Example = defineDocumentType(() => ({
  name: 'Example',
  filePathPattern: `examples/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the page',
      required: true,
    },
    nav_title: {
      type: 'string',
      description: 'Override the title for display in nav',
    },
    label: {
      type: 'string',
    },
    excerpt: {
      type: 'string',
      required: true,
    },
    github_repo: {
      type: 'string',
      description: 'The string to use in stackblitz.embedGithubProject.',
      required: false,
    },
    open_file: {
      type: 'string',
      description: 'The file to open in the stackblitz playground.',
      required: false,
    },
  },
  computedFields: {
    toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
    url_path: {
      type: 'string',
      description:
        'The URL path of this page relative to site root. For example, the site root page would be "/", and doc page would be "docs/getting-started/"',
      resolve: urlFromFilePath,
    },
    pathSegments: {
      type: 'json',
      resolve: (doc) =>
        doc._raw.flattenedPath.split('/').map((dirName) => {
          const re = /^((\d+)-)?(.*)$/
          const [, , orderStr, pathName] = dirName.match(re) ?? []
          const order = orderStr ? parseInt(orderStr) : 0
          return { order, pathName }
        }),
    },
    last_edited: { type: 'date', resolve: getLastEditedDate },
  },
  extensions: {},
})) 


export type DocHeading = { level: 1 | 2 | 3; title: string }

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `docs/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    global_id: {
      type: 'string',
      description: 'Random ID to uniquely identify this doc, even after it moves',
      required: true,
    },
    title: {
      type: 'string',
      description: 'The title of the page',
      required: true,
    },
    nav_title: {
      type: 'string',
      description: 'Override the title for display in nav',
    },
    label: {
      type: 'string',
    },
    excerpt: {
      type: 'string',
      required: true,
    },
    show_child_cards: {
      type: 'boolean',
      default: false,
    },
    collapsible: {
      type: 'boolean',
      required: false,
      default: false,
    },
    collapsed: {
      type: 'boolean',
      required: false,
      default: false,
    },
    // seo: { type: 'nested', of: SEO },
  },
  computedFields: {
    url_path: {
      type: 'string',
      description:
        'The URL path of this page relative to site root. For example, the site root page would be "/", and doc page would be "docs/getting-started/"',
      resolve: (doc) => {
        if (doc._id.startsWith('docs/index.md')) return '/docs'
        return urlFromFilePath(doc)
      },
    },
    url_path_without_id: {
      type: 'string',
      description:
        'The URL path of this page relative to site root. For example, the site root page would be "/", and doc page would be "docs/getting-started/"',
      resolve: (doc) => urlFromFilePath(doc).replace(new RegExp(`-${doc.global_id}$`), ''),
    },
    pathSegments: {
      type: 'json',
      resolve: (doc) =>
        urlFromFilePath(doc)
          .split('/')
          // skip `/docs` prefix
          .slice(2)
          .map((dirName) => {
            const re = /^((\d+)-)?(.*)$/
            const [, , orderStr, pathName] = dirName.match(re) ?? []
            const order = orderStr ? parseInt(orderStr) : 0
            return { order, pathName }
          }),
    },
    headings: {
      type: 'json',
      resolve: async (doc) => {
        const headings: DocHeading[] = []

        await bundleMDX({
          source: doc.body.raw,
          mdxOptions: (opts) => {
            opts.remarkPlugins = [...(opts.remarkPlugins ?? []), tocPlugin(headings)]
            return opts
          },
        })

        return [{ level: 1, title: doc.title }, ...headings]
      },
    },
    last_edited: { type: 'date', resolve: getLastEditedDate },
  },
  extensions: {},
}))

export const Blog = defineDocumentType(() => ({
    name: 'Blog',
    filePathPattern: 'blog/**/*.mdx',
    contentType: 'mdx',
    fields: {
      title: { type: 'string', required: true },
      date: { type: 'date', required: true },
      tags: { type: 'list', of: { type: 'string' }, default: [] },
      lastmod: { type: 'date' },
      draft: { type: 'boolean' },
      summary: { type: 'string' },
      images: { type: 'json' },
      authors: { type: 'list', of: { type: 'string' } },
      layout: { type: 'string' },
      bibliography: { type: 'string' },
      canonicalUrl: { type: 'string' },
    },
    computedFields: {
      ...computedFields,
      structuredData: {
        type: 'json',
        resolve: (doc) => ({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: doc.title,
          datePublished: doc.date,
          dateModified: doc.lastmod || doc.date,
          description: doc.summary,
          image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
          url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
        }),
      },
    },
  }))
export default makeSource({
    contentDirPath: 'data',
    documentTypes: [Blog,Authors,Doc,Example],
    mdx: {
      cwd: process.cwd(),
      remarkPlugins: [
        remarkExtractFrontmatter,
        remarkGfm,
        remarkCodeTitles,
        remarkMath,
        remarkImgToJsx,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
        rehypePresetMinify,
      ]
    },
    onSuccess: async (importData) => {
      const { allBlogs,allDocs } = await importData()
      createTagCount(allBlogs)
      createSearchIndex(allBlogs)
      createSearchIndex(allDocs)
    },
})