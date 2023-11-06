import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const ruConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: "Набор инструментов для построения надежных сервисов (Service Object) любой сложности",

  themeConfig: {
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
          { text: 'Расширения', link: '/ru/guide/extensions' },
          { text: 'I18n', link: '/ru/guide/i18n' },
          { text: 'Тестирование', link: '/ru/guide/testing' },
        ]
      },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Code of Conduct', link: '/code_of_conduct' },
      { text: 'Contributing', link: '/contributing' }
    ],

    outline: {
      label: 'На этой странице',
      level: [2, 3]
    },

    // footer: {
    //   message: 'Released under the MIT License',
    //   copyright: 'Copyright © 2023'
    // }
  },
}
