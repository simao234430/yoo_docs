'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Icon } from './common/Icon'
const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const fixScrollPadding = () => {
    if (document.documentElement.classList.contains('scroll-padding')) {
      document.documentElement.classList.remove('scroll-padding')
    } else {
      document.documentElement.classList.add('scroll-padding')
    }
  }
  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    // <button
    //   aria-label="Toggle Dark Mode"
    //   onClick={() => setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark')}
    // >
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 20 20"
    //     fill="currentColor"
    //     className="h-6 w-6 text-gray-900 dark:text-gray-100"
    //   >
    //     {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
    //       <path
    //         fillRule="evenodd"
    //         d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
    //         clipRule="evenodd"
    //       />
    //     ) : (
    //       <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    //     )}
    //   </svg>
    // </button>

<DropdownMenu.Root onOpenChange={fixScrollPadding}>
<DropdownMenu.Trigger className="flex h-8 items-center rounded-md bg-transparent px-3 text-slate-400 hover:bg-gray-50 hover:text-slate-500 dark:text-slate-500 dark:hover:bg-gray-900 dark:hover:text-slate-400">
  <span className="block w-4">
    <Icon name={theme === 'light' ? 'sun' : 'moon'} />
  </span>
</DropdownMenu.Trigger>
<DropdownMenu.Content className="rounded-md border border-gray-100 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900">
  <DropdownMenu.Item
    onSelect={() => setTheme('light')}
    className={`group flex h-8 cursor-pointer items-center space-x-4 rounded-md px-3 text-sm font-medium leading-none hover:outline-none ${
      theme == 'light'
        ? 'bg-violet-50 text-violet-900 dark:bg-violet-500/20 dark:text-violet-50'
        : 'text-slate-500 hover:bg-gray-50 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300'
    }`}
  >
    <span className="block w-4">
      <Icon name="sun" />
    </span>
    <span>Light</span>
  </DropdownMenu.Item>
  <DropdownMenu.Item
    onSelect={() => setTheme('dark')}
    className={`group flex h-8 cursor-pointer items-center space-x-4 rounded-md bg-transparent px-3 text-sm font-medium leading-none hover:outline-none ${
      theme == 'dark'
        ? 'bg-violet-50 text-violet-900 dark:bg-violet-500/20 dark:text-violet-50'
        : 'text-slate-500 hover:bg-gray-50 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300'
    }`}
  >
    <span className="block w-4">
      <Icon name="moon" />
    </span>
    <span>Dark</span>
  </DropdownMenu.Item>
  {/* <DropdownMenu.Item
    onSelect={() => setTheme('system')}
    className={`group flex h-8 cursor-pointer items-center space-x-4 rounded-md bg-transparent px-3 text-sm font-medium leading-none hover:outline-none ${
      theme == 'system'
        ? 'bg-violet-50 text-violet-900 dark:bg-violet-500/20 dark:text-violet-50'
        : 'text-slate-500 hover:bg-gray-50 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300'
    }`}
  >
    <span className="block w-4">
      <Icon name="gear" />
    </span>
    <span>System</span>
  </DropdownMenu.Item> */}
</DropdownMenu.Content>
</DropdownMenu.Root>
  )
}

export default ThemeSwitch
