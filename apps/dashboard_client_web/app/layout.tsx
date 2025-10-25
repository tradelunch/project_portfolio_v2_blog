import type { Metadata } from 'next';
import { IBM_Plex_Mono, Geist, IBM_Plex_Sans } from 'next/font/google';
import clsx from 'clsx';
import { ClientTrailCursorCanvas } from '../components/ClientTrailCursorCanvas';
import { ClientTrailCursorDom } from '../components/ClientTrailCursorDom';

import '@repo/ui/styles.css';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { DesktopNavigation } from '@/components/navigation-desktop';
import { NavigationMenuDemo } from '@/components/navigation-header';

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist',
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-ibm-plex-mono',
});

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = {
    title: 'Total Dashboard',
    description:
        'computer science, cs, software, trading, investment, inflation',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={clsx(
                // geist.variable,
                // ibmPlexSans.variable,
                ibmPlexMono.variable
            )}
        >
            <body
                className={clsx(
                    // geist.className,
                    // ibmPlexSans.className,
                    ibmPlexMono.className,
                    'flex min-h-screen flex-col',
                    'bg-background text-foreground antialiased'
                )}
            >
                <ThemeProvider
                    // attribute="data-theme"
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <header className="sticky top-0 z-50 border-b-2 border-border bg-background">
                        <div className="mx-auto max-w-[95vw] px-2">
                            <DesktopNavigation />
                        </div>
                    </header>

                    {/* <header className={clsx('flex')}>
                        <NavigationMenuDemo />
                    </header> */}
                    <main className="flex-1">{children}</main>

                    {/* <footer>Main footer</footer> */}
                    <ClientTrailCursorCanvas />
                    <ClientTrailCursorDom />
                </ThemeProvider>
            </body>
        </html>
    );
}
