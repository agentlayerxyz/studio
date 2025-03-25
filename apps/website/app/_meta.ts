import { type MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    type: "page",
    title: "Home",
    theme: {
      sidebar: false,
      footer: false,
      layout: "full",
      navbar: false,
      toc: false,
      timestamp: false,
    },
  },
  docs: {
    type: "page",
    title: "Documentation",
  },
  examples: {
    type: "page",
    title: "Examples",
  },
  // blog: {
  //   type: 'page',
  //   title: 'Blog'
  // }
};

export default meta;
