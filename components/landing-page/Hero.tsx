import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { Dashed } from './Dashed'
import { Button } from '../common/Button'
import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { Checklist } from './Checklist'
import { Video } from '../Video'
const content = {
  heading: 'Content made easy for developers',
  //
  // This will show a little section at the top pointing to the most recent blog
  // post, but it's been so long since we published anything that we're just
  // going to comment it out for now.
  //
  // recentBlogPost: {
  //   title: 'Introducing Contentlayer (Beta): Content Made Easy for Developers',
  //   url: '/blog/beta',
  // },
  text: (
    <>
      Contentlayer is a{' '}
      <Dashed
        label="content SDK"
        tooltip="A content SDK simplifies working with structured content as data in your site/application"
      />{' '}
      that validates and transforms your content into{' '}
      <Dashed
        label="type-safe"
        tooltip="Contentlayer generates TypeScript types based on your content document definitions"
      />{' '}
      JSON data you can easily import into your application.
    </>
  ),
  features: [
    'Lightweight & easy to use',
    'Great developer experience',
    'Blazing fast build & page performance',
  ],
  primaryAction: { label: 'Get started', url: '/docs/getting-started' },
  secondaryAction: {
    label: 'Why Contentlayer?',
    url: '/blog/working-with-content-is-hard-for-developers',
  },
  video: {
    thumbnail: {
      url: '/static/images/5IKJALH.png',
      alt: 'Intro to Contentlayer Video Thumbnail',
    },
    youtubeId: '58Pj4a4Us7A',
  },
}
export const Hero: FC = () => {
  return (
    <div className="w-full pt-8 space-y-12 md:space-y-20 md:pt-16 lg:pt-20">
      <div className="grid w-full max-w-screen-xl grid-cols-1 gap-16 px-4 mx-auto md:grid-cols-2 md:px-8 ">
        <div className="space-y-8 sm:max-w-md">
          <Heading level={1}>{content.heading}</Heading>
          <Paragraph className="text-lg">{content.text}</Paragraph>
          <Checklist items={content.features} className="text-lg" />
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-col md:space-y-4 md:space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
            <Button
              label={content.primaryAction.label}
              href={content.primaryAction.url}
              theme="primary"
            />
            <Button
              label={content.secondaryAction.label}
              href={content.secondaryAction.url}
              theme="secondary"
            />
          </div>
        </div>
        <div className="relative flex items-center w-full">
          {/* TODO don't use image as thumbnail if possible */}
          <Video thumbnail={content.video.thumbnail} videoId={content.video.youtubeId} />
        </div>
      </div>
    </div>
  )
}
