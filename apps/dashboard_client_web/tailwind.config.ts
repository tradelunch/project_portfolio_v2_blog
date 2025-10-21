// tailwind.config.ts
import baseConfig from '@repo/tailwind-config/tailwind.config.ts';
import type { Config } from 'tailwindcss';

const config: Config = {
    ...baseConfig,
    theme: {
        extend: {
            fontFamily: {
                geist: ['var(--font-geist)'],
                'ibm-plex': ['var(--font-ibm-plex)'],
                'ibm-plex-mono': ['var(--font-ibm-plex-mono)'],
            },
        },
    },
};

export default config;
