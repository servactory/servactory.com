import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: "A set of tools for building reliable Ruby services (Service Object) of any complexity",

  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),

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

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Guide', link: '/getting-started' },
    // { text: 'Releases', link: '/releases/2.4' },
    // { text: 'v1', link: 'https://v1.servactory.com' },
  ]
}

function sidebar(): DefaultTheme.Sidebar {
  return {
    '/introduction': { base: '', items: sidebarGuide() },
    '/getting-started': { base: '', items: sidebarGuide() },
    '/guide/': { base: '', items: sidebarGuide() },
    // '/releases/': { base: '', items: sidebarReleases() },
  }
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
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
          text: 'Usage',
          items: [
            { text: 'Call', link: '/guide/usage/call' },
            { text: 'Result', link: '/guide/usage/result' },
            { text: 'Info', link: '/guide/usage/info' }
          ]
        },
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
            { text: 'Advanced', link: '/guide/options/advanced' },
            { text: 'Dynamic', link: '/guide/options/dynamic' }
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
        {
          text: 'Exceptions',
          items: [
            { text: 'Success', link: '/guide/exceptions/success' },
            { text: 'Failure', link: '/guide/exceptions/failure' }
          ]
        },
        { text: 'Configuration', link: '/guide/configuration' },
        {
          text: 'Testing',
          items: [
            { text: 'RSpec', link: '/guide/testing/rspec' },
          ]
        },
        { text: 'Extensions', link: '/guide/extensions' },
        { text: 'I18n', link: '/guide/i18n' },
      ]
    },
    { text: 'Changelog', link: '/CHANGELOG' },
    { text: 'Code of Conduct', link: '/CODE_OF_CONDUCT' },
    { text: 'Contributing', link: '/CONTRIBUTING' }
  ]
}

// function sidebarReleases(): DefaultTheme.SidebarItem[] {
//   return [
//     {
//       text: 'Guide',
//       items: [
//         { text: 'Return to guide', link: '/guide/usage/call' }
//       ]
//     },
//     {
//       text: 'Releases',
//       items: [
//         { text: 'Release 2.4', link: '/releases/2.4' },
//         { text: 'Release 2.3', link: '/releases/2.3' },
//         { text: 'Release 2.2', link: '/releases/2.2' },
//       ]
//     }
//   ]
// }
