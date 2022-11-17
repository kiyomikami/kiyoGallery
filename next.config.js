/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'nytmp.rule34.xxx',
      'api-cdn.rule34.xxx',
      'api-cdn-us.rule34.xxx',
      '*',
    ],
  },
}

module.exports = nextConfig
