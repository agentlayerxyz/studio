/** @type {import('next').NextConfig} */

import nextra from "nextra";

const withNextra = nextra({
  search: {
    codeblocks: false,
  },
});

const nextConfig = {};

export default withNextra(nextConfig);
