// tailwind.config.ts
import type { Config } from 'tailwindcss';
import baseConfig from '@repo/tailwind-config/tailwind.config.ts';

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
    content: [
        './**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        '../../packages/ui/**/*.{ts,tsx}', // (공유 컴포넌트 사용 시) 실제 파일 경로
    ],
    plugins: [require('tailwindcss-animate')],
};

export default config;
