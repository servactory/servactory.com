import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const jaConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: "あらゆる複雑さのRuby/Railsサービス（Service Object）を構築するためのツールセット",

  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),

    outline: {
      label: 'このページの内容',
      level: [2, 3]
    },

    editLink: {
      pattern: 'https://github.com/servactory/servactory.com/edit/main/docs/:path',
      text: 'GitHubでこのページを編集'
    },

    lastUpdated: {
      text: '最終更新日'
    },

    // footer: {
    //   message: 'Released under the MIT License',
    //   copyright: 'Copyright © 2023'
    // }
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'ガイド', link: '/ja/getting-started', activeMatch: '/guide/' },
    { text: 'リリース', link: '/ja/releases/3.0', activeMatch: '/releases/' },
    { text: 'Datory', link: '/ja/datory/getting-started', activeMatch: '/datory/' },
    { text: 'Featury', link: '/ja/featury/getting-started', activeMatch: '/featury/' },
    // { text: 'v1', link: 'https://v1.servactory.com/ja' },
  ]
}

function sidebar(): DefaultTheme.Sidebar {
  return {
    '/ja/introduction': { base: '', items: sidebarGuide() },
    '/ja/getting-started': { base: '', items: sidebarGuide() },
    '/ja/guide/': { base: '', items: sidebarGuide() },
    '/ja/datory/': { base: '', items: sidebarDatory() },
    '/ja/featury/': { base: '', items: sidebarFeatury() },
    '/ja/releases/': { base: '', items: sidebarReleases() },
  }
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'はじめに',
      items: [
        { text: 'Servactoryを選ぶ理由', link: '/ja/introduction' },
        { text: '始め方', link: '/ja/getting-started' }
      ]
    },
    {
      text: 'ガイド',
      items: [
        {
          text: '使い方',
          items: [
            { text: '呼び出し', link: '/ja/guide/usage/call' },
            { text: '結果', link: '/ja/guide/usage/result' },
            { text: '情報', link: '/ja/guide/usage/info' }
          ]
        },
        {
          text: 'アトリビュート',
          items: [
            { text: '入力', link: '/ja/guide/attributes/input' },
            { text: '内部', link: '/ja/guide/attributes/internal' },
            { text: '出力', link: '/ja/guide/attributes/output' }
          ]
        },
        {
          text: 'オプション',
          items: [
            { text: '使い方', link: '/ja/guide/options/usage' },
            { text: '応用', link: '/ja/guide/options/advanced' },
            { text: 'ダイナミック', link: '/ja/guide/options/dynamic' }
          ]
        },
        {
          text: 'アクション',
          items: [
            { text: '使い方', link: '/ja/guide/actions/usage' },
            { text: 'オプション', link: '/ja/guide/actions/options' },
            { text: 'グルーピング', link: '/ja/guide/actions/grouping' }
          ]
        },
        {
          text: '例外',
          items: [
            { text: '成功', link: '/ja/guide/exceptions/success' },
            { text: '失敗', link: '/ja/guide/exceptions/failure' }
          ]
        },
        { text: '設定', link: '/ja/guide/configuration' },
        {
          text: 'テスト',
          items: [
            { text: 'RSpec', link: '/ja/guide/testing/rspec/fluent' },
            { text: 'RSpec (Legacy)', link: '/ja/guide/testing/rspec/legacy' },
            { text: 'マイグレーション', link: '/ja/guide/testing/rspec/migration' },
          ]
        },
        { text: '拡張機能', link: '/ja/guide/extensions' },
        {
          text: 'Rails',
          items: [
            { text: 'ジェネレーター', link: '/ja/guide/rails/generators' }
          ]
        },
        { text: 'I18n', link: '/ja/guide/i18n' },
      ]
    },
    { text: 'Changelog', link: '/CHANGELOG' },
    { text: 'Code of Conduct', link: '/CODE_OF_CONDUCT' },
    { text: 'Contributing', link: '/CONTRIBUTING' },
    { text: 'GitHub', link: 'https://github.com/servactory/servactory' },
  ]
}

function sidebarDatory(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Servactory',
      items: [
        { text: 'Servactoryに戻る', link: '/ja/getting-started' }
      ]
    },
    {
      text: 'はじめに',
      items: [
        { text: '始め方', link: '/ja/datory/getting-started' },
      ]
    },
    {
      text: 'ガイド',
      items: [
        {
          text: 'データ',
          items: [
            { text: 'アトリビュート', link: '/ja/datory/guide/data/attributes' },
            { text: 'ネスト', link: '/ja/datory/guide/data/nesting' },
          ]
        },
        {
          text: '使い方',
          items: [
            { text: 'シリアライゼーション', link: '/ja/datory/guide/usage/serialization' },
            { text: 'デシリアライゼーション', link: '/ja/datory/guide/usage/deserialization' },
          ]
        },
        { text: '情報', link: '/ja/datory/guide/info' },
      ],
    },
    { text: 'Changelog', link: 'https://github.com/servactory/datory/blob/main/CHANGELOG.md' },
    { text: 'Code of Conduct', link: 'https://github.com/servactory/datory/blob/main/CODE_OF_CONDUCT.md' },
    { text: 'Contributing', link: 'https://github.com/servactory/datory/blob/main/CONTRIBUTING.md' },
    { text: 'GitHub', link: 'https://github.com/servactory/datory' },
  ]
}

function sidebarFeatury(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Servactory',
      items: [
        { text: 'Servactoryに戻る', link: '/ja/getting-started' }
      ]
    },
    {
      text: 'はじめに',
      items: [
        { text: '始め方', link: '/ja/featury/getting-started' },
      ]
    },
    {
      text: 'ガイド',
      items: [
        { text: 'アクション', link: '/ja/featury/guide/actions' },
        { text: 'コールバック', link: '/ja/featury/guide/callbacks' },
        { text: 'フィーチャー', link: '/ja/featury/guide/features' },
        { text: '情報', link: '/ja/featury/guide/info' },
      ],
    },
    { text: 'Changelog', link: 'https://github.com/servactory/featury/blob/main/CHANGELOG.md' },
    { text: 'Code of Conduct', link: 'https://github.com/servactory/featury/blob/main/CODE_OF_CONDUCT.md' },
    { text: 'Contributing', link: 'https://github.com/servactory/featury/blob/main/CONTRIBUTING.md' },
    { text: 'GitHub', link: 'https://github.com/servactory/featury' },
  ]
}

function sidebarReleases(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'ガイド',
      items: [
        { text: 'ガイドに戻る', link: '/ja/guide/usage/call' }
      ]
    },
    {
      text: 'リリース',
      items: [
        { text: 'リリース 3.0', link: '/ja/releases/3.0' },
        { text: 'リリース 2.16', link: '/ja/releases/2.16' },
        { text: 'リリース 2.15', link: '/ja/releases/2.15' },
        { text: 'リリース 2.14', link: '/ja/releases/2.14' },
        { text: 'リリース 2.13', link: '/ja/releases/2.13' },
        { text: 'リリース 2.12', link: '/ja/releases/2.12' },
        { text: 'リリース 2.11', link: '/ja/releases/2.11' },
        { text: 'リリース 2.10', link: '/ja/releases/2.10' },
        { text: 'リリース 2.9', link: '/ja/releases/2.9' },
        { text: 'リリース 2.8', link: '/ja/releases/2.8' },
        { text: 'リリース 2.7', link: '/ja/releases/2.7' },
        { text: 'リリース 2.6', link: '/ja/releases/2.6' },
        { text: 'リリース 2.5', link: '/ja/releases/2.5' },
        { text: 'リリース 2.4', link: '/ja/releases/2.4' },
        { text: 'リリース 2.3', link: '/ja/releases/2.3' },
        { text: 'リリース 2.2', link: '/ja/releases/2.2' },
      ]
    },
    { text: 'GitHub', link: 'https://github.com/servactory/servactory/releases' },
  ]
}
