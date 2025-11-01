// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ko'];

// export default getRequestConfig(async ({ locale }: { locale?: string }) => {
//     console.log('>>> next-intl config');

//     if (!locale || !locales.includes(locale)) notFound();

//     const commonMessages = (await import(`./messages/${locale}/common.json`))
//         .default;
//     const homeMessages = (await import(`./messages/${locale}/home.json`))
//         .default;

//     return {
//         locale,
//         messages: {
//             ...commonMessages,
//             ...homeMessages,
//         },
//     };
// });
