import { defineConfig } from 'vitepress'
import { sharedConfig } from './shared.mjs'
import { enConfig } from './en.mjs'
import { ruConfig } from './ru.mjs'

export default defineConfig({
  ...sharedConfig,

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/',
      ...enConfig
    },
    ru: {
      label: 'Russian',
      lang: 'ru-RU',
      link: '/ru/',
      ...ruConfig
    }
  },
})
