import { cookies } from 'next/headers';
import { AppProvider } from '@/context/app-context';
import { geistMono, geistSans } from './config/font';
import { configMeta, siteConfig } from './config/site';
import { Theme, ThemeProvider, ThemeStateHidden } from '@repo/components/theme';
import { getCurrentUser } from '../lib/get-user';
import { Toaster } from '@repo/ui/toast';
import { auth } from '../auth/auth';

import type { Metadata } from 'next';

// import '@repo/styles';
// import '@repo/ui/styles.css';
// import '@repo/shells/styles.css';
import '@repo/viz/styles.css';
import './globals.css';

export function metadata(): Metadata {
  return {
    title: {
      template: `%s | ${siteConfig().name}`,
      default: siteConfig().name
    },
    applicationName: siteConfig().name,
    description: siteConfig().description,
    category: 'Store',
    // manifest: "/manifest.json",
    generator: siteConfig().name,
    publisher: siteConfig().name,
    referrer: 'origin-when-cross-origin',
    keywords: [...siteConfig().keywords],
    creator: siteConfig().creator,
    authors: [{ name: siteConfig().creator }, { name: siteConfig().creator, url: siteConfig().links.github }],
    robots: configMeta.robots,
    openGraph: configMeta.openGraph,
    alternates: configMeta.alternates,
    formatDetection: configMeta.formatDetection,
    icons: configMeta.icons,
    ...configMeta.links,
    ...configMeta.seo, // SEO verification
    archives: [...siteConfig().archives], // archives
    other: {
      hostname: siteConfig().url,
      'expected-hostname': siteConfig().url,
      'msapplication-config': '/browserconfig.xml',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': siteConfig().name,
      'format-detection': 'telephone=no',
      'msapplication-TileColor': '#ffffff',
      'msapplication-TileImage': '/favicon/ms-icon-144x144.png',
      'msapplication-tap-highlight': 'no'
    }
  };
}

export const viewport = {
  minimumScale: 1,
  maximumScale: 1,
  initialScale: 1,
  userScalable: true,
  width: 'device-width',
  height: 'device-height',
  viewportFit: 'cover',
  interactiveWidget: 'overlays-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: configMeta.color.light },
    { media: '(prefers-color-scheme: dark)', color: configMeta.color.dark }
  ]
};

async function cookiesValues() {
  const cookieStore = await cookies();
  const dir = (cookieStore.get('__dir')?.value || 'ltr') as Direction;
  const theme = (cookieStore.get('__theme')?.value || 'system') as Theme;

  return {
    store() {
      return cookieStore;
    },
    dir,
    theme
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const [session, user, { store: _, ...cookieStore }] = await Promise.all([auth(), getCurrentUser(), cookiesValues()]);

  // if (!session || !user) redirect(siteUrl('/sign-in'));

  return (
    <AppProvider {...cookieStore} {...{ session, user: user! }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
          <ThemeProvider>
            {children}
            <Toaster />
            <ThemeStateHidden />
          </ThemeProvider>
        </body>
      </html>
    </AppProvider>
  );
}
