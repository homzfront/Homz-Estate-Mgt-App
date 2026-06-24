import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/resident',
          '/resident/*',
          '/api/*',
          '/auth/*',
          '/select-profile',
          '/verify-email',
        ],
      },
    ],
    sitemap: 'https://community.homz.ng/sitemap.xml',
  }
}