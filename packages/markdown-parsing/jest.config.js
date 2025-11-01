import { config as baseConfig } from '@repo/jest-config/base';
import pkg from './package.json' with { type: 'json' };

export const jestConfig = {
    ...baseConfig,
    displayName: pkg.name,
    rootDir: '.',
    // testMatch: [
    // 	"<rootDir>/__test__/**/*.(spec|test).{ts,tsx}",
    // 	"<rootDir>/src/**/*.(spec|test).{ts,tsx}",
    // ],
};

export default jestConfig;
