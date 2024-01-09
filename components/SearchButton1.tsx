
import { useKBar } from 'kbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
 
 
import { Label } from './Label'
 
import { Icon } from './common/Icon'
export const SearchButton1: FC<{ showShortcut?: boolean }> = ({ showShortcut = true }) => {
  const { query } = useKBar()

  return (
    <button
      aria-label="Search"
      onClick={query.toggle}
      className="flex items-center h-8 px-2 text-sm border border-gray-200 rounded-md cursor-text bg-gray-50 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800"
    >
      <span className="block w-3 mr-2">
        <Icon name="search" />
      </span>
      <span className="mr-8 text-slate-400 dark:text-slate-500">Search...</span>
      {showShortcut && <Label text="⌘K" />}
    </button>
  )
}