import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const ruConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: "Набор инструментов для построения надежных сервисов любой сложности",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: "/img/logo-full-light.svg",
      dark: "/img/logo-full-dark.svg",
      alt: "Servactory"
    },

    siteTitle: false,

    nav: [
      { text: 'Руководство', link: '/ru/getting-started' },
      { text: 'v1', link: 'https://v1.servactory.com/ru' }
    ],

    sidebar: [
      {
        text: 'Введение',
        items: [
          { text: 'Почему Servactory', link: '/ru/introduction' },
          { text: 'Начало работы', link: '/ru/getting-started' }
        ]
      },
      {
        text: 'Руководство',
        items: [
          {
            text: 'Атрибуты',
            items: [
              { text: 'Входящие', link: '/ru/guide/attributes/input' },
              { text: 'Внутренние', link: '/ru/guide/attributes/internal' },
              { text: 'Выходящие', link: '/ru/guide/attributes/output' }
            ]
          },
          { text: 'Действия', link: '/ru/guide/actions' },
          { text: 'Вызов и результат', link: '/ru/guide/call-and-result' },
          { text: 'Конфигурация', link: '/ru/guide/configuration' },
          { text: 'Неудачи', link: '/ru/guide/failures' },
          { text: 'I18n', link: '/ru/guide/i18n' },
          { text: 'Тестирование', link: '/ru/guide/testing' },
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
