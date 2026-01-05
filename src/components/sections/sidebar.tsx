"use client"

// 2026-1-4 lgw

import React from 'react'
import Link from 'next/link'
import { Dictionary } from '@/lib/dictionaries'
import { usePathname } from 'next/navigation'
import { Locale } from '@/lib/i18n'

import '../../app/globals.css'

interface SidebarProps {
  dict?: Dictionary
  lang?: string
}

export function Sidebar({ dict, lang }: SidebarProps) {
    const pathname = usePathname()

 // Extract current language from path
  const currentLang = (pathname.split('/')[1] || 'en') as Locale
  
  // Add language prefix to navigation links
  const getLocalizedHref = (href: string) => {
    if (href === '/') {
      return `/${currentLang}`
    }
    return `/${currentLang}${href}`
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

  return (
    <div className="pt-8">
      <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10"/>
        </svg>
      </button>
      
    <aside id="top-bar-sidebar" className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto ">
             <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
                 <a href="https:flowbite.com/" className="flex items-center ps-2.5 mb-5">
                   <img src="https:flowbite.com/docs/images/logo.svg" className="h-6 me-3" alt="Flowbite Logo" />
                   <span className="self-center text-lg text-heading font-semibold whitespace-nowrap">Flowbite</span>
                 </a>
                
                <ul className="space-y-2 font-medium">
                    <div className="text-heading text-gray-500">{headerConfig?.navigationMenu?.imageMenuLabel?.trim() || 'AI图像'}</div>
                    {headerConfig?.navigationMenu?.imageMenu?.map((component) => (
                      <li>
                          <Link href={getLocalizedHref(component.href)} className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image h-4 w-4 shrink-0 mt-0.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                              <span className="ms-3">{component.title}</span>
                              {component.newFlag && <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm bg-red-500 text-white">{component.newFlag}</span>}
                          </Link> 
                      </li>
                    ))} 
                </ul>
                
                 <ul className="space-y-2 font-medium border-t border-default pt-4 mt-4">
                    <div className="text-heading text-gray-500">{headerConfig?.navigationMenu?.videoMenuLabel?.trim() || 'AI视频'}</div>
                    {headerConfig?.navigationMenu?.videoMenu?.map((component) => (
                    <li>
                        <Link href={getLocalizedHref(component.href)} className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-film h-4 w-4 shrink-0 mt-0.5"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path><path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path></svg>
                            <span className="ms-3">{component.title}</span>
                            {component.newFlag && <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm bg-red-500 text-white">{component.newFlag}</span>}
                        </Link> 
                      </li>
                    ))}                    
                 </ul>
                  <ul className="space-y-2 font-medium border-t border-default pt-4 mt-4">
                  <div className="text-heading text-gray-500">{headerConfig?.navigationMenu?.promptMenuLabel?.trim() || 'AI工具'}</div>                    
                      {headerConfig?.navigationMenu?.promptMenu?.map((component) => (
                      <li>
                        <Link href={getLocalizedHref(component.href)} className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles h-4 w-4 shrink-0 mt-0.5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
                          <span className="ms-3">{component.title}</span>
                          {component.newFlag && <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm bg-red-500 text-white">{component.newFlag}</span>}
                          </Link>
                        </li>
                      ))}                   
                  </ul>
             </div>

      </div>
    </aside> 

     <div className="p-4 sm:ml-64">
        <div className="p-4 border-1 border-default border-dashed rounded-base">
           
            
        </div>
      </div>
    </div>
  )
}

