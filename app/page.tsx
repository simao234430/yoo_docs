import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import SectionContainer from '@/components/SectionContainer'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return  (
    <SectionContainer>
          <Main posts={posts} />
    </SectionContainer>
 
  )
 
}
