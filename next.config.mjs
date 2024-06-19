/** @type {import('next').NextConfig} */
// Example config for adding a loader that depends on babel-loader
// This source was taken from the @next/mdx plugin source:
// https://github.com/vercel/next.js/tree/canary/packages/next-mdx
const nextConfig = {
  webpack: (config, options) => {
    // console.log(options)
    if (options.isServer) {
      console.log(config.resolve.conditionNames);
    }
    return config;
  },
};

export default nextConfig;
