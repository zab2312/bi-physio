/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Omogućava statički export za Netlify
  images: {
    unoptimized: true, // Potrebno za statički export
    formats: ['image/webp', 'image/avif'],
    // Omogući optimizaciju slika
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Isključi API rute iz builda za statički export
  // API rute će biti konvertirane u Netlify Functions
}

module.exports = nextConfig

