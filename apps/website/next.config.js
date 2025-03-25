/** @type {import('next').NextConfig} */

import nextra from "nextra";

const withNextra = nextra({
  search: {
    codeblocks: false,
  },
});

const nextConfig = {
  output: "standalone",
};

export default withNextra(nextConfig);
