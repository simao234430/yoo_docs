import { FC } from 'react'
import Link from 'next/link'
import { Icon } from '../common/Icon'
import { format } from 'date-fns'
import { Doc, Example } from 'contentlayer/generated'

const githubBranch = 'main'
const githubBaseUrl = `https://github.com/contentlayerdev/website/blob/${githubBranch}/content/`

export const ExamplesFooter: FC<{ example: Example }> = ({ example }) => {
  return (
    <>
      <hr />
      <div className="space-y-4 text-sm sm:flex sm:justify-between sm:space-y-0">
        <p className="m-0">
          Was this example helpful to you? <br />{' '}
          <Link href="https://github.com/contentlayerdev/contentlayer/issues">
            <div className="inline-flex items-center space-x-1" target="_blank" rel="noreferrer">
              <span className="inline-block w-4">
                <Icon name="github" />
              </span>
              <span>Provide feedback</span>
            </div>
          </Link>
        </p>
        <p className="m-0 text-right">
          Last edited on {format(new Date(example.last_edited), 'MMMM dd, yyyy')}.<br />
          <Link href={githubBaseUrl + example._raw.sourceFilePath}>
            <div className="inline-flex items-center space-x-1" target="_blank" rel="noreferrer">
              <span className="inline-block w-4">
                <Icon name="github" />
              </span>
              <span>Edit this page</span>
            </div>
          </Link>
        </p>
      </div>
    </>
  )
}
