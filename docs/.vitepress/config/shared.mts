import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export const sharedConfig = defineConfig({
  title: "Servactory",
  titleTemplate: ":title — Servactory",

  cleanUrls: true,
})
