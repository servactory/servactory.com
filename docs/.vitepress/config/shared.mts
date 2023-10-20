import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export const sharedConfig = defineConfig({
  title: "Servactory",
  titleTemplate: ":title — Servactory",

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
  ],

  cleanUrls: true,

  appearance: 'dark',

  markdown: {
    // https://github.com/shikijs/shiki/blob/main/docs/themes.md
    // node_modules/shiki/themes
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
