import { config as baseConfig } from '@repo/jest-config/base';
import pkg from './package.json' with { type: 'json' };

export const jestConfig = {
    ...baseConfig,
    displayName: pkg.name,
    rootDir: '.',
};

export default jestConfig;
