import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const ruConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: "Набор инструментов для построения надежных сервисов (Service Object) любой сложности",

  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),

    outline: {
      label: 'На этой странице',
      level: [2, 3]
    },

    editLink: {
      pattern: 'https://github.com/servactory/servactory.com/edit/main/docs/:path',
      text: 'Редактировать эту страницу на GitHub'
    },

    // footer: {
    //   message: 'Released under the MIT License',
    //   copyright: 'Copyright © 2023'
    // }
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Руководство', link: '/ru/getting-started', activeMatch: '/guide/' },
    { text: 'Релизы', link: '/ru/releases/2.3', activeMatch: '/releases/' },
    { text: 'v1', link: 'https://v1.servactory.com/ru' }
  ]
}

function sidebar(): DefaultTheme.Sidebar {
  return {
    '/ru/introduction': { base: '', items: sidebarGuide() },
    '/ru/getting-started': { base: '', items: sidebarGuide() },
    '/ru/guide/': { base: '', items: sidebarGuide() },
    '/ru/releases/': { base: '', items: sidebarReleases() },
  }
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
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
          text: 'Использование',
          items: [
            { text: 'Вызов', link: '/ru/guide/usage/call' },
            { text: 'Результат', link: '/ru/guide/usage/result' },
            { text: 'Информация', link: '/ru/guide/usage/info' }
          ]
        },
        {
          text: 'Атрибуты',
          items: [
            { text: 'Входящие', link: '/ru/guide/attributes/input' },
            { text: 'Внутренние', link: '/ru/guide/attributes/internal' },
            { text: 'Выходящие', link: '/ru/guide/attributes/output' }
          ]
        },
        {
          text: 'Опции',
          items: [
            { text: 'Использование', link: '/ru/guide/options/usage' },
            { text: 'Расширенные', link: '/ru/guide/options/advanced' }
          ]
        },
        {
          text: 'Действия',
          items: [
            { text: 'Использование', link: '/ru/guide/actions/usage' },
            { text: 'Опции', link: '/ru/guide/actions/options' },
            { text: 'Группирование', link: '/ru/guide/actions/grouping' }
          ]
        },
        {
          text: 'Исключения',
          items: [
            { text: 'Успех', link: '/ru/guide/exceptions/success' },
            { text: 'Неудача', link: '/ru/guide/exceptions/failure' }
          ]
        },
        { text: 'Конфигурация', link: '/ru/guide/configuration' },
        { text: 'Расширения', link: '/ru/guide/extensions' },
        { text: 'I18n', link: '/ru/guide/i18n' },
        { text: 'Тестирование', link: '/ru/guide/testing' },
      ]
    },
    { text: 'Changelog', link: '/CHANGELOG' },
    { text: 'Code of Conduct', link: '/CODE_OF_CONDUCT' },
    { text: 'Contributing', link: '/CONTRIBUTING' }
  ]
}

function sidebarReleases(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Руководство',
      items: [
        { text: 'Вернуться', link: '/ru/guide/usage/call' }
      ]
    },
    {
      text: 'Релизы',
      items: [
        { text: 'Релиз 2.3', link: '/ru/releases/2.3' },
        { text: 'Релиз 2.2', link: '/ru/releases/2.2' },
      ]
    }
  ]
}
