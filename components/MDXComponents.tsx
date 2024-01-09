import TOCInline from 'pliny/ui/TOCInline'
// import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
 
import { ChevronLink } from './common/ChevronLink'
 
import { DocsCard } from './docs/DocsCard'
import { Callout } from './common/Callout'
import Pre from './common/Pre'
 
 

export const components: MDXComponents = {
  ChevronLink,
  Card:DocsCard,
  Callout,
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
}
