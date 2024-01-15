 
import { Example, allExamples } from "@/.contentlayer/generated"
import DocLayout from "@/layouts/DocLayout"
import { buildExamplesTree } from "@/utils/build-examples-tree"
import { defineStaticProps, toParams } from "@/utils/next"
import { InferGetStaticPropsType } from "next"
import { useMDXComponent } from "next-contentlayer/hooks"
import { FC } from "react"
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { components } from '@/components/MDXComponents'
import MarkdownContent from "@/components/MarkdownContent"
import { DocsNavigation } from "@/components/docs/DocsNavigation"
import { DocsHeader } from "@/components/docs/DocsHeader"
import { ExamplesFooter } from "@/components/examples/ExamplesFooter"
import notFound from "@/app/not-found"
import { PageNavigation } from "@/components/common/PageNavigation"

import JsPDF from 'jspdf';
 
export default async function Page({ params }: { params: { slug: string[] } }) {
    const pagePath = params.slug ? ['examples', params.slug.join('/')].join('/') : 'examples'
 
    const example = allExamples.find((_) => _.pathSegments.map((_: PathSegment) => _.pathName).join('/') === pagePath)!
    console.log(params.slug)
    console.log(pagePath)
    if (!example) {

    return notFound()
    }
 
    let slugs = params.slug ? ['', ...params.slug] : []
    let path = 'examples'
    let breadcrumbs: any = []
    for (const slug of slugs) {
      path += slug ? '/' + slug : ''
      const navTitle = allExamples.find(
        (_) => _.pathSegments.map((_: PathSegment) => _.pathName).join('/') === path,
      )?.nav_title
      const title = allExamples.find((_) => _.pathSegments.map((_: PathSegment) => _.pathName).join('/') === path)?.title
      breadcrumbs.push({ path: '/' + path, slug, title: navTitle || title })
    }
    const tree = buildExamplesTree(allExamples)
    // const MDXContent = useMDXComponent(example?.body.code || '')
    return(
        <div className="relative mx-auto w-full max-w-1636 lg:flex lg:items-start">
        <div
          style={{ height: 'calc(100vh - 64px)' }}
          className="sticky top-16 hidden shrink-0 border-r border-gray-200 dark:border-gray-800 lg:block"
        >
          <div className="-ml-3 h-full overflow-y-scroll p-4 pl-8">
            <DocsNavigation tree={tree} />
          </div>
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-t from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
        </div>
        <div id="page" className="relative w-full grow">
 
          <DocsHeader tree={tree} breadcrumbs={breadcrumbs} title={example.title } />
          <div className="docs prose prose-slate prose-violet mx-auto mb-4 w-full max-w-3xl shrink p-4 pb-8 prose-headings:font-semibold prose-a:font-normal prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-hr:border-gray-200 dark:prose-invert dark:prose-a:text-violet-400 dark:prose-hr:border-gray-800 md:mb-8 md:px-8 lg:mx-0 lg:max-w-full lg:px-16">
            {/* {MDXContent && <MDXContent components={components as any} />} */}
            {/* <MDXLayoutRenderer code={example?.body.code} components={components} toc={example?.toc} /> */}
            {/* {example?.body.code} */}
            <MDXLayoutRenderer code={example?.body.code} components={components} toc={example?.toc} />
            {/* <MarkdownContent code={example?.body.code || ""} /> */}
            {/* {example.github_repo && (
              <div
                className={
                  fullScreen
                    ? 'fixed inset-0 top-16 z-20 bg-gray-950/10 p-8 backdrop-blur-lg backdrop-filter dark:bg-gray-950/50'
                    : 'relative mt-8 lg:mt-16'
                }
              >
                <div className="mb-8 hidden justify-end md:flex">
                  <Button
                    theme="primary"
                    label={fullScreen ? 'Collapse Playground' : 'Expand Playground'}
                    icon={fullScreen ? 'collapse' : 'expand'}
                    action={() => setFullScreen(!fullScreen)}
                  />
                </div>
                <div
                  className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
                  style={{ height: fullScreen ? 'calc(100vh - 190px)' : 700 }}
                >
                  <div className="h-full w-full" ref={ref} />
                </div>
              </div>
            )} */}
            <ExamplesFooter example={example} />
          </div>
        </div>
        <div
          style={{ maxHeight: 'calc(100vh - 128px)' }}
          className="sticky top-32 hidden w-80 shrink-0 overflow-y-scroll p-8 pr-16 1.5xl:block"
        >
          <PageNavigation headings={example.headings} />
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-t from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
        </div>
 
 

      </div>
    
    )
}

 
