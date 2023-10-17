import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: "A set of tools for building reliable Ruby services of any complexity",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: "/img/logo-full-light.svg",
      dark: "/img/logo-full-dark.svg",
      alt: "Servactory"
    },

    siteTitle: false,

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
          {
            text: 'Attributes',
            items: [
              { text: 'Input', link: '/guide/attributes/input' },
              { text: 'Internal', link: '/guide/attributes/internal' },
              { text: 'Output', link: '/guide/attributes/output' }
            ]
          },
          { text: 'Actions', link: '/guide/actions' },
          { text: 'Call and Result', link: '/guide/call-and-result' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Failures', link: '/guide/failures' },
          { text: 'I18n', link: '/guide/i18n' },
          { text: 'Testing', link: '/guide/testing' },
        ]
      },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Code of Conduct', link: '/code_of_conduct' },
      { text: 'Contributing', link: '/contributing' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/servactory/servactory' }
    ],

    search: {
      provider: 'local'
    },

    // footer: {
    //   message: 'Released under the MIT License',
    //   copyright: 'Copyright © 2023'
    // }
  },
}
