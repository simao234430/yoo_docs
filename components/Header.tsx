"use client" 
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import { Logo } from './Logo'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { Label } from './Label'
import { Icon } from './Icon'
import { usePathname } from 'next/navigation'
const isExternalUrl = (link: string): boolean => !link.startsWith('/')
const navLinks: Array<{ label: string; url: string }> = [
  { label: 'Documentation', url: '/docs' },
  //
  // Removing this temporarily, until it is more active.
  { label: 'Blog', url: '/blog' },
  //
  // NOTE until we have a proper example overview page and multiple examples, link directly to Next.js example
  { label: 'Examples', url: '/examples/nextjs' },
]

const NavLink: FC<{ label?: string; hideLabel?: boolean; icon?: IconName; url: string }> = ({
  label,
  hideLabel = false,
  icon,
  url,
}) => {
  const pathname = usePathname()
  const active =  pathname.split('/')[1] == url.replace('/', '')
  return (
    <Link href={url}>
      <div
        className={`group flex h-8 items-center rounded-md bg-transparent px-3 text-sm font-medium leading-none ${
          active
            ? 'bg-primary-50 text-primary-900 dark:bg-primary-500/20 dark:text-primary-50'
            : 'text-slate-600 hover:bg-gray-50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-gray-900 dark:hover:text-slate-200'
        }`}
        target={isExternalUrl(url) ? '_blank' : undefined}
        rel={isExternalUrl(url) ? 'noreferrer' : undefined}
      >
        {icon && (
          <span className="block w-5 text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400">
            <Icon name={icon} />
          </span>
        )}
        {label && <span className={hideLabel ? 'sr-only' : ''}>{label}</span>}
      </div>
    </Link>
  )
}

const iconLinks: Array<{ label: string; icon: IconName; url: string }> = [
  { label: 'Github', icon: 'github', url: 'https://github.com/contentlayerdev/contentlayer' },
  { label: 'Discord', icon: 'discord', url: 'https://discord.gg/rytFErsARm' },
]
const Header = () => {


  return (
    <header className="fixed z-50 w-full bg-white border-b border-gray-200 bg-opacity-90 backdrop-blur backdrop-filter dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between w-full h-16 px-4 mx-auto max-w-screen-2xl md:px-8 lg:px-16">
        <div className="flex items-center space-x-2.5">
          <Link href="/">
            <div className="flex items-center space-x-2.5 font-bold text-slate-800 no-underline dark:text-white">
              <div className="mr-3">
                <Logo />
              </div>
              <span className="-mt-0.5">Contentlayer</span>
            </div>
          </Link>
          <Label text="Beta" />
        </div>
        <nav className="items-center hidden divide-x divide-gray-200 dark:divide-gray-800 lg:flex">
          <div className="flex items-center pr-2 lg:space-x-4 lg:pr-8">
          {navLinks.map(({ label, url }, index) => (
   <NavLink key={index} label={label} url={url} icon={isExternalUrl(url) ? 'external-link' : undefined} />
            ))}
            <div className="px-3">
              <SearchButton />
            </div>
          </div>
          <div className="flex items-center pl-2 lg:space-x-2 lg:pl-8">
            <ThemeSwitch />
            {iconLinks.map(({ label, icon, url }, index) => (
              <Link key={index} href={url}>          {icon && (
                <span className="block w-5 text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400">
                  <Icon name={icon} />
                </span>
              )}</Link>  
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
