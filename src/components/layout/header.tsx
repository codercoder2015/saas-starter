"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Dictionary } from '@/lib/dictionaries'
import { Locale } from '@/lib/i18n'
import LanguageSwitcher from '@/components/language-switcher'
import { useAuth } from '@/contexts/AuthContext'
import { User as UserType } from '@/lib/auth'


import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

// import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"



interface HeaderProps {
  dict?: Dictionary
  initialUser?: UserType | null
}

export function Header({ dict, initialUser }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Extract current language from path
  const currentLang = (pathname.split('/')[1] || 'en') as Locale
  
  // 直接使用认证状态，AuthContext 会处理状态同步
  const { user, loading, signOut } = useAuth()
  // console.log(user, loading, signOut)
  
  // Use default values if dict is not provided
  const siteInfo = dict?.site || {
    name: "EdgeOne Saas Starter"
  }
  const headerConfig = dict?.header || {
    navigation: [],
    cta: { text: "Get Started", href: "/pricing" },
    navigationMenu: {
      imageMenuLabel: '',
      imageMenu: [],
      videoMenuLabel: '',
      videoMenu: [],
      promptMenuLabel: '',
      promptMenu: []
    }
  }

  // Add language prefix to navigation links
  const getLocalizedHref = (href: string) => {
    if (href === '/') {
      return `/${currentLang}`
    }
    return `/${currentLang}${href}`
  }

  // Check if link is current page
  const isActive = (href: string) => {
    const localizedHref = getLocalizedHref(href)
    if (href === '/') {
      // For homepage, need exact match to avoid false positives with other pages
      return pathname === localizedHref || pathname === `${localizedHref}/`
    }
    // For other pages, use startsWith matching
    return pathname.startsWith(localizedHref) && pathname !== `/${currentLang}` && pathname !== `/${currentLang}/`
  }

  
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
// AI图像
function NavigationMenuImage() {
  return (
    <NavigationMenu >
      <NavigationMenuList className="flex-wrap">        
        <NavigationMenuItem>
          <NavigationMenuTrigger>{headerConfig?.navigationMenu?.imageMenuLabel?.trim() || 'AI图像'}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {headerConfig?.navigationMenu?.imageMenu?.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={getLocalizedHref(component.href)}
                >
                  {component.description}
                </ListItem>
              ))}

            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>
)
}
// AI视频
function NavigationMenuVideo() {
  return (
    <NavigationMenu >
      <NavigationMenuList className="flex-wrap">        
        <NavigationMenuItem>
          <NavigationMenuTrigger>{headerConfig?.navigationMenu?.videoMenuLabel?.trim() || 'AI视频'}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {headerConfig?.navigationMenu?.videoMenu?.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={getLocalizedHref(component.href)}
                >
                  {component.description}
                </ListItem>
              ))}

            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>
)
}
// AI提示词
function NavigationMenuPrompt() {
  return (
    <NavigationMenu >
      <NavigationMenuList className="flex-wrap">        
        <NavigationMenuItem>
          <NavigationMenuTrigger>{headerConfig?.navigationMenu?.promptMenuLabel?.trim() || 'AI工具'}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {headerConfig?.navigationMenu?.promptMenu?.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={getLocalizedHref(component.href)}
                >
                  {component.description}
                </ListItem>
              ))}

            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>
)
}

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={getLocalizedHref('/')} className="text-2xl font-bold text-primary">
              {siteInfo.name}
            </Link>
          </div>

          {/* ok 2026-1-3  */}
          <NavigationMenuImage /> 
          <NavigationMenuVideo />
          <NavigationMenuPrompt />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {headerConfig.navigation.map((item) => (
              <Link
                prefetch={true}
                key={item.name}
                href={getLocalizedHref(item.href)}
                 className={`transition-colors duration-200 whitespace-nowrap ${
                  isActive(item.href)
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher currentLang={currentLang} dict={dict} />
            
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={dict?.common?.common?.toggleTheme || "Toggle theme"}
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <span className="inline-block h-5 w-5" />
              )}
            </Button>

            {/* Auth Buttons */}
            {loading ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href={getLocalizedHref('/profile')}
                  className="w-16 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer text-center flex items-center justify-center"
                >
                   <User className="h-4 w-4" />
                </Link>
                <Button
                  variant="link"
                  onClick={signOut}
                  className="flex items-center space-x-1 w-12 justify-center w-16"
                >
                  <LogOut className="h-4 w-4" />
                  {/* <span>{dict?.auth?.user?.signOut || 'Sign Out'}</span> */}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href={getLocalizedHref(`/login`)}
                  className="text-sm w-16 font-medium text-foreground hover:text-primary transition-colors text-center"
                >
                  {dict?.auth?.login?.signInButton || 'Sign In'}
                </Link>
                <Link
                  href={getLocalizedHref(`/signup`)}
                  className="bg-primary w-16 text-white py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap text-center"
                >
                  {dict?.auth?.signup?.signUpButton || 'Sign Up'}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {headerConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={getLocalizedHref(item.href)}
                  className={`transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary font-semibold bg-primary/10 px-3 py-2 rounded-md'
                      : 'text-foreground hover:text-primary px-3 py-2'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <LanguageSwitcher currentLang={currentLang} dict={dict} />
              </div>
              
              {/* Mobile Auth Buttons */}
              {loading ? (
                <div className="px-3 py-2">
                  <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    href={getLocalizedHref('/profile')}
                    className="block text-sm text-gray-600 text-center hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {dict?.auth?.user?.welcome || 'Welcome back'}, {user.email}
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{dict?.auth?.user?.signOut || 'Sign Out'}</span>
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    href={getLocalizedHref('/login')}
                    className="block text-center text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {dict?.auth?.login?.signInButton || 'Sign In'}
                  </Link>
                  <Link
                    href={getLocalizedHref('/signup')}
                    className="block bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors text-center whitespace-nowrap"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {dict?.auth?.signup?.signUpButton || 'Sign Up'}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 
