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

  lastUpdated: true,

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
          },
          ja: {
            translations: {
              button: {
                buttonText: "検索",
                buttonAriaLabel: "検索"
              },
              modal: {
                displayDetails: '詳細リストを表示',
                resetButtonTitle: '検索をリセット',
                backButtonTitle: '検索を閉じる',
                noResultsText: '検索結果なし:',
                footer: {
                  selectText: '選択',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'ナビゲーション',
                  navigateUpKeyAriaLabel: 'up arrow',
                  navigateDownKeyAriaLabel: 'down arrow',
                  closeText: '閉じる',
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

  transformHead(ctx) {
    const canonicalUrl = `https://servactory.com/${ctx.page}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')

    const ogLocale = ctx.siteData.lang.replace('-', '_')

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: ctx.title }],
      ['meta', { property: 'og:description', content: ctx.description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'Servactory' }],
      ['meta', { property: 'og:locale', content: ogLocale }],
      ['meta', { property: 'og:image', content: 'https://servactory.com/img/og-image.png' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: ctx.title }],
      ['meta', { name: 'twitter:description', content: ctx.description }],
      ['meta', { name: 'twitter:image', content: 'https://servactory.com/img/og-image.png' }],
    ]
  },

  vite: {
    plugins: [
      llmstxt({
        domain: 'https://servactory.com',
        ignoreFiles: [
          'ru/**',
          'ja/**',
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
