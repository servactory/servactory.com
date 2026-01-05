import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

// https://vitepress.dev/reference/site-config
export const sharedConfig = defineConfig({
  title: "Servactory",
  titleTemplate: ":title | Servactory",

  head: [
    [
      'link',
      { rel: 'icon', href: '/favicon-light.ico', media: '(prefers-color-scheme: light)' }
    ],
    [
      'link',
      { rel: 'icon', href: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' }
    ],
    // [
    //   'link',
    //   { rel: 'icon', href: '/favicon-dark.ico', type: 'image/png', media: '(prefers-color-scheme: dark)' }
    // ],
    // [
    //   'link',
    //   { rel: 'icon', href: '/favicon-dark.ico', type: 'image/png', media: '(prefers-color-scheme: dark)' }
    // ]
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-TQZ1KR4XMT' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TQZ1KR4XMT');`
    ],
  ],

  cleanUrls: true,

  appearance: 'dark',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: "/img/logo-full-light.svg",
      dark: "/img/logo-full-dark.svg",
      alt: "Servactory"
    },

    siteTitle: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/servactory/servactory' },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          ru: {
            translations: {
              button: {
                buttonText: "Поиск",
                buttonAriaLabel: "Поиск"
              },
              modal: {
                displayDetails: 'Показать подробный список',
                resetButtonTitle: 'Сбросить поиск',
                backButtonTitle: 'Закрыть поиск',
                noResultsText: 'Нет результатов для',
                footer: {
                  selectText: 'чтобы выбрать',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'для навигации',
                  navigateUpKeyAriaLabel: 'up arrow',
                  navigateDownKeyAriaLabel: 'down arrow',
                  closeText: 'чтобы закрыть',
                  closeKeyAriaLabel: 'escape'
                }
              }
            }
          }
        }
      }
    },
  },

  markdown: {
    // https://github.com/shikijs/shiki/blob/main/docs/themes.md
    // node_modules/shiki/themes
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  sitemap: {
    hostname: 'https://servactory.com'
  },

  vite: {
    plugins: [
      llmstxt({
        domain: 'https://servactory.com',
        ignoreFiles: [
          'ru/**',
          'CHANGELOG.md',
          'CODE_OF_CONDUCT.md',
          'CONTRIBUTING.md'
        ],
        customTemplateVariables: {
          title: 'Servactory',
          description: 'A service object framework for Ruby on Rails applications. Servactory provides a structured approach to organizing business logic using service objects with typed inputs, outputs, and actions.',
        }
      })
    ]
  }
})
