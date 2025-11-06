import { AppSidebar } from '@/components/blog/sidebar-blog.server';
import { SiteHeader } from '@/components/site-header';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Separator } from '@/components/ui/separator';

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import clsx from 'clsx';

export const BlogUserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar side="left" />

            <SidebarInset>
                {/* <SiteHeader /> */}

                <section
                    className={clsx(
                        'flex flex-1 flex-col gap-4',
                        'items-center',
                        'px-4 py-8'
                    )}
                >
                    {children}
                </section>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default BlogUserLayout;
