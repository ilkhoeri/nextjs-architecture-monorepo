import type { Metadata } from 'next';

type SiteUrl = 'x' | 'github' | '/' | 'logo' | (string & {});

export function siteUrl(path: SiteUrl) {
  // const isDev = process.env.NODE_ENV !== "production";

  const absoluteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')!;

  switch (path) {
    case 'x':
      return 'https://x.com/ilkhoeri';

    case 'github':
      return 'https://github.com/ilkhoeri/';

    case '/':
      return absoluteUrl;

    case 'logo':
      return `${absoluteUrl}/logo.png`;

    default:
      return `${absoluteUrl}${path}`;
  }
}

export function siteConfig() {
  return {
    creator: '@ilkhoeri',
    url: siteUrl('/'),
    email: 'khoeriilham@gmail.com',
    name: 'Docs',
    ogImage: '/assets/images/homepage.webp',
    description: 'Docs - TypeScript-first schema validation with static type inference',
    archives: [siteUrl('github')],
    keywords: ['web', 'primitive', 'function', 'development', 'web app', 'straightforward', 'dependencies', 'npm', 'package'],
    links: {
      twitter: siteUrl('x'),
      github: siteUrl('github')
    }
  };
}

export const iconsConfig: Metadata = {
  icons: {
    icon: [
      { url: '/icons/docs-asset.png' },
      {
        url: '/icons/docs-asset.png',
        media: '(prefers-color-scheme: dark)'
      }
    ],
    shortcut: ['/icons/docs-asset.png'],
    apple: [
      { url: '/icons/apple-icon.png' },
      {
        url: '/icons/apple-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        rel: 'shortcut icon',
        type: 'image/vnd.microsoft.icon',
        url: '/icons/favicon.ico'
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/icons/apple-icon-precomposed.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icons/android-icon-192x192.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/icons/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        url: '/icons/favicon-96x96.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/icons/favicon-16x16.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        url: '/icons/apple-icon-57x57.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        url: '/icons/apple-icon-60x60.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        url: '/icons/apple-icon-72x72.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        url: '/icons/apple-icon-76x76.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        url: '/icons/apple-icon-114x114.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        url: '/icons/apple-icon-120x120.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        url: '/icons/apple-icon-144x144.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        url: '/icons/apple-icon-152x152.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/icons/apple-icon-180x180.png'
      }
    ]
  }
};

export const linksConfig: Metadata = {
  twitter: {
    card: 'app',
    title: siteConfig().name,
    description: siteConfig().description,
    siteId: '1467726470533754880',
    creator: siteConfig().creator,
    creatorId: '1467726470533754880',
    images: {
      url: siteUrl('/icons/docs-asset.png'),
      alt: 'docs'
    },
    app: {
      name: 'twitter_app',
      id: {
        iphone: 'twitter_app://iphone',
        ipad: 'twitter_app://ipad',
        googleplay: 'twitter_app://googleplay'
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url'
      }
    }
  },
  facebook: {
    admins: ['12345678', '87654321']
  },
  appLinks: {
    web: {
      url: siteConfig().url,
      should_fallback: true
    }
  },
  appleWebApp: {
    title: 'Apple Web App | Docs',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/icons/apple-touch-icon.png',
      {
        url: '/icons/apple-touch-icon.png',
        media: '(device-width: 768px) and (device-height: 1024px)'
      }
    ]
  }
};

/** SEO verification */
export const SEO_VERIFICATION = {
  verification: {
    google: '',
    yandex: '',
    yahoo: '',
    other: {
      // bing verification
      'msvalidate.01': [''],
      me: [siteConfig().email, siteConfig().url]
    }
  }
};

export type SiteConfig = InferType<typeof siteConfig>;

type OGImageDescriptor = {
  url: string | URL;
  secureUrl?: string | URL;
  alt?: string;
  type?: string;
  width?: string | number;
  height?: string | number;
};

type OGImage = string | OGImageDescriptor | URL;

export type ConfigMetadataProps = {
  url?: string;
  title?: string;
  locale?: string;
  siteName?: string;
  description?: string;
  ogImage?: string | URL;
  images?: Array<OGImage>;
};

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#090a15'
};

export function configMetadata({
  images = [],
  locale = 'en_US',
  url = siteConfig().url,
  title = siteConfig().name,
  siteName = siteConfig().name,
  ogImage = siteConfig().ogImage,
  description = siteConfig().description
}: ConfigMetadataProps): Metadata {
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      siteName: String(siteName),
      url: siteUrl(url),
      type: 'website',
      locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: String(siteName)
        },
        ...images
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [siteConfig().ogImage],
      creator: siteConfig().creator
    }
  };
}
