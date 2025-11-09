import { getCategoriesByUsername } from '@/apis/getCategories.api';
import { CategorySidebar } from '@/app/blog/CategorySidebar.server';
import { RightTechStackCard } from '@/app/blog/RightTechStackCard.client';
import { ScrollToTopButton } from '@/app/ScrollToTop';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

export const BlogMainLayout = ({ children }: { children: React.ReactNode }) => {
    const dataPromise = getCategoriesByUsername('taeklim');

    return (
        <div className="min-h-screen bg-background text-foreground font-mono">
            <div className="container mx-auto p-2 sm:p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Left Sidebar - Categories & Tech Stack */}
                    <aside className={cn('order-1', 'lg:col-span-1')}>
                        <div
                            className={cn(
                                'space-y-0 lg:space-y-4',
                                'lg:sticky lg:top-4'
                            )}
                        >
                            <Suspense
                                fallback={<div>loading categories...</div>}
                            >
                                <CategorySidebar data={dataPromise} />
                            </Suspense>

                            <RightTechStackCard />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main
                        className={cn(
                            'order-2',
                            'space-y-4 md:space-y-6',
                            'lg:col-span-3'
                        )}
                    >
                        {children}
                    </main>
                </div>
            </div>

            <ScrollToTopButton />
        </div>
    );
};

export default BlogMainLayout;
