'use client'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
}

 
import { useMDXComponent } from 'next-contentlayer/hooks'
interface MDXContentProps {
  code: string
}

export default function MarkdownContent({ code }: MDXContentProps) {
  const MDXContent = useMDXComponent(code)

  // @ts-expect-error
  return <MDXContent components={components as MDXComponentsType} />
}
