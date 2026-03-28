import { defineConfig } from 'vitepress';
import { generateSidebar } from 'vitepress-sidebar';

export default defineConfig({
  base: '/core/',
  title: 'Node Collection',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/01-getting-started' },
      { text: 'API Reference', link: '/api/index' },
    ],
    sidebar: generateSidebar([
      {
        documentRootPath: 'docs',
        scanStartPath: 'guide',
        resolvePath: '/guide/',
        useTitleFromFileHeading: true,
        useFolderLinkFromIndexFile: true,
        hyphenToSpace: true,
        capitalizeFirst: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '-',
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'api',
        resolvePath: '/api/',
        useTitleFromFileHeading: true,
        useFolderLinkFromIndexFile: true,
        collapsed: true,
        hyphenToSpace: true,
        capitalizeFirst: true,
        // This ensures deep nested folders like core/engines show up
        includeRootIndexFile: true,
      },
    ]),
  },
});
