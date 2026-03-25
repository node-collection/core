import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/core/',
  title: 'Node Collection',
  description: 'Data Manipulation, Evolved.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/index' }, // 👈 Tambahkan /README kalau index.md gak ada
    ],
    sidebar: {
      '/api/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/api/README' },
            { text: 'Collect Factory', link: '/api/functions/collect' },
          ],
        },
        {
          text: 'Engines (Classes)',
          items: [
            { text: 'Collection', link: '/api/classes/Collection' },
            { text: 'LazyCollection', link: '/api/classes/LazyCollection' },
            { text: 'AsyncCollection', link: '/api/classes/AsyncCollection' },
            { text: 'AsyncLazyCollection', link: '/api/classes/AsyncLazyCollection' },
          ],
        },
        {
          text: 'Interfaces & Types',
          collapsed: true,
          items: [
            { text: 'Enumerable', link: '/api/interfaces/Enumerable' },
            { text: 'OperatorDefinitionApi', link: '/api/interfaces/OperatorDefinitionApi' },
          ],
        },
      ],
    },
  },
});
