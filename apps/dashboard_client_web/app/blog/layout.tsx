import clsx from 'clsx';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className={clsx('flex-1 flex flex-col mt-18 min-h-full')}>
            {children}
        </main>
    );
}
