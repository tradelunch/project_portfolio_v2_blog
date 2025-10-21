import type { Metadata } from 'next';
import { IBM_Plex_Mono, Geist, IBM_Plex_Sans } from 'next/font/google';
import clsx from 'clsx';
import { ClientTrailCursorCanvas } from '../components/ClientTrailCursorCanvas';
import { ClientTrailCursorDom } from '../components/ClientTrailCursorDom';

import '@repo/ui/styles.css';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';

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
                    ibmPlexMono.className
                )}
            >
                <ThemeProvider
                    // attribute="data-theme"
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* <header>
                        <div>header</div>
                        <nav>
                            <ul>
                                <li>home</li>
                                <li>about</li>
                                <li>contact</li>
                                <li>
                                    <ModeToggle />
                                </li>
                            </ul>
                        </nav>
                    </header> */}
                    {children}

                    {/* <footer>Main footer</footer> */}
                    <ClientTrailCursorCanvas />
                    <ClientTrailCursorDom />
                </ThemeProvider>
            </body>
        </html>
    );
}
