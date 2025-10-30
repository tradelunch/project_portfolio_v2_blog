import { AppSidebar } from '@/components/app-sidebar';
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

export const DashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <SidebarProvider>
            <AppSidebar side="left" />

            <SidebarInset>
                {/* <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger
                        className={clsx(
                            'fixed sm:hidden right-10 bottom-20 bg-zinc-700 z-20 '
                        )}
                    />

                    <SidebarTrigger
                        className={clsx(
                            '-ml-1 hidden sm:inline-flex sm:relative bg-transparent z-20'
                        )}
                    />

                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />

                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header> */}

                <SiteHeader />

                <main className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
