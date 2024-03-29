import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import '@/css/globals.css'
 
import { ThemeProviders } from './theme-providers'
import SectionContainer from '@/components/SectionContainer'
import Header from '@/components/Header'
import {Footer} from '@/components/Footer'
// import { SearchProvider, SearchConfig } from 'pliny/search'
// const inter = Inter({ subsets: ['latin'] })
import siteMetadata from '@/data/siteMetadata'
import NoSSR from './NoSSR'
import { SearchProvider } from './SearchContext'
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      // className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body className="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
      <NoSSR>  
        <ThemeProviders>
          {/* <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} /> */}
          <SearchProvider  >
          <Header />
          </SearchProvider>
          <div className="flex min-h-screen flex-col justify-between"> 
          {/* <SectionContainer> */}
                <main         style={{ scrollPaddingTop: '150px' }} className="relative pt-16"  >{children}</main>
                {/* </SectionContainer> */}
                </div>
          <Footer />
        </ThemeProviders>
        </NoSSR>  
      </body>
    </html>
  )
}
