
"use client"
import { CodeWindow } from "@/components/landing-page/CodeWindow";
import { FAQ } from "@/components/landing-page/FAQ";
import { Features } from "@/components/landing-page/Features";
import { Hero } from "@/components/landing-page/Hero";
import { codeSnippets, HowItWorks, type CodeSnippets } from '@/components/landing-page/HowItWorks'
import { Playground } from "@/components/landing-page/Playground";
import { Support } from "@/components/landing-page/Support";
import { Testimonials } from "@/components/landing-page/Testimonials";
import { Tweets } from "@/components/landing-page/Tweets";
import { mapObjectValues, promiseAllProperties } from '@/utils/object'
import { ColorScheme, snippetToHtml } from '@/utils/syntax-highlighting'

 
export default function LandPage() {
  // const snippetData = getSnippets()
 
  // // Wait for the promises to resolve
  // const preprocessedCodeSnippets = await Promise.all([snippetData])

 
    return (
      <>
      <Hero />
     
      <Support />
      <Testimonials usedByCount={999} />
      <Features />
 
      {/* <HowItWorks codeSnippets={codeSnippets} /> */}
      <Playground />
      <FAQ />
      <Tweets />
      </>
    )
  }
  