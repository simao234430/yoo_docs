
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
// TODO remove eslint-disable when fixed https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { useLiveReload, useMDXComponent } from 'next-contentlayer/hooks'
import type { FC } from 'react'
import { allDocs, Doc } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'

import { components } from '@/components/MDXComponents'
import { Card as ChildCard } from '@/components/common/Card'
import Layout from '@/app/layout'
import { coreContent } from 'pliny/utils/contentlayer.js'

import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import DocLayout from '@/layouts/DocLayout'
import { DocsNavigation } from '@/components/docs/DocsNavigation'
import { DocsHeader } from '@/components/docs/DocsHeader'

import { buildDocsTree } from '@/utils/build-docs-tree'
import { defineServerSideProps } from '@/utils/next'
import notFound from '@/app/not-found'
import { DocsFooter } from '@/components/docs/DocsFooter'
import { Label } from '@/components/Label'
import { usePathname } from 'next/navigation'
import { PageNavigation } from '@/components/common/PageNavigation'
import Link from 'next/link'
import router from 'next/navigation'
import { Url } from 'next/dist/shared/lib/router/router'

const defaultLayout = 'DocLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
  DocLayout,
}

function getSupportingProps(doc: Doc, params: any) {
  let slugs = params.slug ? ['docs', ...params.slug] : []
  let path = ''
  let breadcrumbs: any = []
  for (const slug of slugs) {
    path += `/${slug}`
    const breadcrumbDoc = allDocs.find(
      (_) => _.url_path === path || _.url_path_without_id === path
    )
    if (!breadcrumbDoc) continue
    breadcrumbs.push({
      path: breadcrumbDoc.url_path,
      title: breadcrumbDoc?.nav_title || breadcrumbDoc?.title,
    })
  }
  const tree = buildDocsTree(allDocs)
  const childrenTree = buildDocsTree(
    allDocs,
    doc.pathSegments.map((_: PathSegment) => _.pathName)
  )
  return { tree, breadcrumbs, childrenTree }
}

export async function getData(params: any) {
  const pagePath = params.slug?.join('/') ?? ''
  let doc
  // If on the index page, we don't worry about the global_id
  if (pagePath === '') {
    doc = allDocs.find((_) => _.url_path === '/docs')
    if (!doc) return notFound()
    return { props: { doc, ...getSupportingProps(doc, params) } }
  }
  // Identify the global content ID as the last part of the page path following
  // the last slash. It should be an 8-digit number.
  const globalContentId: string = pagePath
    .split('/')
    .filter(Boolean)
    .pop()
    .split('-')
    .pop()
  // If there is a global content ID, find the corresponding document.
  if (globalContentId && globalContentId.length === 8) {
    doc = allDocs.find((_) => _.global_id === globalContentId)
  }
  // If we found the doc by the global content ID, but the URL path isn't the
  // correct one, redirect to the proper URL path.
  const urlPath = doc?.pathSegments
    .map((_: PathSegment) => _.pathName)
    .join('/')
  if (doc && urlPath !== pagePath) {
    return { redirect: { destination: doc.url_path, permanent: true } }
  }
  // If there is no global content ID, or if we couldn't find the doc by the
  // global content ID, try finding the doc by the page path.
  if (!globalContentId || !doc) {
    doc = allDocs.find((_) => {
      const segments = _.pathSegments
        .map((_: PathSegment) => _.pathName)
        .join('/')
        .replace(new RegExp(`\-${_.global_id}$`, 'g'), '') // Remove global content ID from url
      return segments === pagePath
    })
    // If doc exists, but global content ID is missing in url, redirect to url
    // with global content ID
    if (doc) {
      return { redirect: { destination: doc.url_path, permanent: true } }
    }
    // Otherwise, throw a 404 error.
    return notFound()
  }
  // Return the doc and supporting props.
  return { doc, ...getSupportingProps(doc, params) }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const pagePath = params.slug?.join('/') ?? ''
  // const { tree, breadcrumbs, childrenTree } = getSupportingProps(doc,params)
  let doc
  // If on the index page, we don't worry about the global_id
  if (pagePath === '') {
    doc = allDocs.find((_) => _.url_path === '/docs')
    if (!doc) return notFound()
    // return { props: { doc, ...getSupportingProps(doc, params) } }
  } else {
    // Identify the global content ID as the last part of the page path following
    // the last slash. It should be an 8-digit number.
    const globalContentId: string = pagePath
      ?.split('/')
      .filter(Boolean)
      .pop()
      .split('-')
      .pop()
    // If there is a global content ID, find the corresponding document.
    if (globalContentId && globalContentId.length === 8) {
      doc = allDocs.find((_) => _.global_id === globalContentId)
    }
    // If we found the doc by the global content ID, but the URL path isn't the
    // correct one, redirect to the proper URL path.
    const urlPath = doc?.pathSegments
      .map((_: PathSegment) => _.pathName)
      .join('/')
    if (doc && urlPath !== pagePath) {
      return { redirect: { destination: doc.url_path, permanent: true } }
    }
    // If there is no global content ID, or if we couldn't find the doc by the
    // global content ID, try finding the doc by the page path.
    if (!globalContentId || !doc) {
      doc = allDocs.find((_) => {
        const segments = _.pathSegments
          .map((_: PathSegment) => _.pathName)
          .join('/')
          .replace(new RegExp(`\-${_.global_id}$`, 'g'), '') // Remove global content ID from url
        return segments === pagePath
      })
      // If doc exists, but global content ID is missing in url, redirect to url
      // with global content ID
      if (doc) {
        return { redirect: { destination: doc.url_path, permanent: true } }
      }
      // Otherwise, throw a 404 error.
      return notFound()
    }
  }
  const { tree, breadcrumbs, childrenTree } = getSupportingProps(doc, params)
  const onClick = async (url: Url) => {
    router.push(url)
    // TODO;
  };
  return (
    <>
        <div className="relative mx-auto w-full max-w-1636 lg:flex lg:items-start">
        <div
          style={{ height: 'calc(100vh - 64px)' }}
          className="sticky top-16 hidden shrink-0 border-r border-gray-200 dark:border-gray-800 lg:block"
        >
          <div className="h-full p-8 pl-16 -ml-3 overflow-y-scroll">
            <DocsNavigation tree={tree} />
          </div>
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-t from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
        </div>
        <div className="relative max-w-screen-lg shrink-0">
          <DocsHeader tree={tree} breadcrumbs={breadcrumbs} title={doc.title} />
          <div className="w-full max-w-3xl p-4 pb-8 mx-auto mb-4 prose docs prose-slate prose-violet shrink prose-headings:font-semibold prose-a:font-normal prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-hr:border-gray-200 dark:prose-invert dark:prose-a:text-violet-400 dark:prose-hr:border-gray-800 md:mb-8 md:px-8 lg:mx-0 lg:max-w-full lg:px-16">
          <MDXLayoutRenderer code={doc?.body.code} components={components} toc={doc?.headings} />
            {doc.show_child_cards && (
              <>
                <hr />
                <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2">
                  {childrenTree.map((card: any, index: number) => (
                    <div key={index}   className="cursor-pointer">
                                 
                      <ChildCard      className="h-full p-6 py-4 hover:border-violet-100 hover:bg-violet-50 dark:hover:border-violet-900/50 dark:hover:bg-violet-900/20">
                       <a href={card.urlPath}> 
                        <h3 className="mt-0 no-underline">{card.title}</h3>
                        {card.label && <Label text={card.label} />}
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          <p>{card.excerpt}</p>
                        </div>
                        </a>
                      </ChildCard>
               
                    </div>
                  ))}
                </div>
              </>
            )}
            <DocsFooter doc={doc} />
          </div>
        </div>

        <div
          style={{ maxHeight: 'calc(100vh - 128px)' }}
          className="sticky top-32 hidden w-80 shrink-0 overflow-y-scroll p-8 pr-16 1.5xl:block"
        >
          <PageNavigation headings={doc.headings} />
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-t from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
        </div>
      </div>
    </>
  )
}
