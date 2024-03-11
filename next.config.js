/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com'],
  },
  i18n: {
    localeDetection: false,
  },
}

module.exports = nextConfig
