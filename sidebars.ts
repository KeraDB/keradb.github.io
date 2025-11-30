import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started w/ SDK',
      items: [
        'getting-started/nodejs',
        'getting-started/python',
        'getting-started/rust',
      ],
      collapsed: false,
    },
    {
      type: 'doc',
      id: 'core-concepts/index',
      label: 'Core Concepts',
    },
    {
      type: 'doc',
      id: 'query-guide',
      label: 'Query Guide',
    },
    {
      type: 'doc',
      id: 'examples',
      label: 'Examples',
    },
    {
      type: 'doc',
      id: 'contributing',
      label: 'Contributing',
    },
  ],
};

export default sidebars;
