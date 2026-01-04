import React from 'react'
import { Layout } from '@/components/layout/layout'
import { LayoutNobottom } from '@/components/layout/layout-nobottom'
import { SectionLayout } from '@/components/layout/section-layout'
import { getDictionary } from '@/lib/dictionaries'
import { Locale, locales } from '@/lib/i18n'
import { Sparkles } from 'lucide-react'
import { AIImageGenerator } from '../../ai/ai-image-generator'
import { Sidebar } from '@/components/sections/sidebar'

import { Hero } from "@/components/sections/hero";

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }));
}

export default async function AIPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const aiConfig = dict.ai;

  // Merge generator config with additional fields from dict
  const generatorConfig = {
    ...aiConfig.generator,
    checkingCredits: aiConfig.generator.checkingCredits,
    credits: aiConfig.generator.credits,
    cost: aiConfig.generator.cost,
    creditsUnavailable: aiConfig.generator.creditsUnavailable,
    notEnoughCredits: aiConfig.generator.notEnoughCredits,
    pleaseSignIn: aiConfig.generator.pleaseSignIn,
    unableToFetchCredits: aiConfig.generator.unableToFetchCredits,
    unableToFetchCost: aiConfig.generator.unableToFetchCost,
    failedToFetchCost: aiConfig.generator.failedToFetchCost,
    imageGenerationTimeout: aiConfig.generator.imageGenerationTimeout,
    modelNotConfigured: aiConfig.generator.modelNotConfigured,
  };

  return (    
    // <Layout dict={dict}>      
    <LayoutNobottom dict={dict}>


    {/* <div className="pt-8">
      <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10"/>
        </svg>
      </button>

      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
            <ul className="space-y-2 font-medium">
              <li>
                  <a href="#" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <svg className="w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"/></svg>
                    <span className="ms-3">Dashboard</span>
                  </a>
              </li>
              <li>
                  <a href="#" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                    <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm">Pro</span>
                  </a>
              </li>
              <li>
                  <a href="#" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8"/></svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                    <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-fg-danger-strong bg-danger-soft border border-danger-subtle rounded-full">2</span>
                  </a>
              </li>

            </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-1 border-default border-dashed rounded-base">

            
            
        </div>
      </div>
    </div> */}

      <div className="pt-8">
        <Sidebar dict={dict} lang={lang} />
      </div>

      <div className="pt-8">

       
       
        {/* Hero Section */}
        <SectionLayout
          className="px-4"
          padding="small"
          title={aiConfig.generator.title}
          description={aiConfig.generator.description}
          titleClassName="text-3xl md:text-4xl"
          descriptionClassName="max-w-3xl"
          headerClassName="mb-16"
          locale={lang}          
        >
        
          

          <AIImageGenerator config={generatorConfig} />
        </SectionLayout>
      </div>
      


      
    </LayoutNobottom>
    // </Layout>
  )
}

