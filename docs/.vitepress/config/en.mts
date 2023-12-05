import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: "A set of tools for building reliable Ruby services (Service Object) of any complexity",

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'v1', link: 'https://v1.servactory.com' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Why Servactory', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' }
        ]
      },
      {
        text: 'Guide',
        items: [
          { text: 'Call and Result', link: '/guide/call-and-result' },
          {
            text: 'Attributes',
            items: [
              { text: 'Input', link: '/guide/attributes/input' },
              { text: 'Internal', link: '/guide/attributes/internal' },
              { text: 'Output', link: '/guide/attributes/output' }
            ]
          },
          {
            text: 'Options',
            items: [
              { text: 'Usage', link: '/guide/options/usage' },
              { text: 'Advanced', link: '/guide/options/advanced' }
            ]
          },
          {
            text: 'Actions',
            items: [
              { text: 'Usage', link: '/guide/actions/usage' },
              { text: 'Options', link: '/guide/actions/options' },
              { text: 'Grouping', link: '/guide/actions/grouping' }
            ]
          },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Failures', link: '/guide/failures' },
          { text: 'Extensions', link: '/guide/extensions' },
          { text: 'I18n', link: '/guide/i18n' },
          { text: 'Testing', link: '/guide/testing' },
        ]
      },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Code of Conduct', link: '/code_of_conduct' },
      { text: 'Contributing', link: '/contributing' }
    ],

    outline: {
      // label: 'On this page',
      level: [2, 3]
    },

    editLink: {
      pattern: 'https://github.com/servactory/servactory.com/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // footer: {
    //   message: 'Released under the MIT License',
    //   copyright: 'Copyright © 2023'
    // }
  },
}
