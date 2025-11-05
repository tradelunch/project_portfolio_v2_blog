// // jest.config.mjs
// export default {
//     preset: 'ts-jest',
//     testEnvironment: 'node',

//     // 테스트 파일 위치
//     roots: ['<rootDir>/__tests__'],
//     testMatch: ['**/*.spec.ts', '**/*.test.ts'],

//     // TypeScript 설정
//     transform: {
//         '^.+\\.tsx?$': [
//             'ts-jest',
//             {
//                 tsconfig: {
//                     esModuleInterop: true,
//                     allowSyntheticDefaultImports: true,
//                 },
//             },
//         ],
//     },

//     // 모듈 해석
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//     moduleNameMapper: {
//         '^@/(.*)$': '<rootDir>/src/$1',
//         '^@types/(.*)$': '<rootDir>/types/$1',
//         '^@utils/(.*)$': '<rootDir>/utils/$1',
//         '^@routes/(.*)$': '<rootDir>/routes/$1',
//         '^@config/(.*)$': '<rootDir>/config/$1',
//     },

//     // 커버리지 설정
//     collectCoverageFrom: [
//         'routes/**/*.ts',
//         'utils/**/*.ts',
//         'services/**/*.ts',
//         '!**/*.d.ts',
//         '!**/node_modules/**',
//         '!**/__tests__/**',
//     ],
//     coverageDirectory: 'coverage',
//     coverageReporters: ['text', 'lcov', 'html'],
//     coverageThreshold: {
//         global: {
//             branches: 70,
//             functions: 70,
//             lines: 70,
//             statements: 70,
//         },
//     },

//     // 테스트 환경 설정
//     setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
//     testTimeout: 10000,

//     // 성능 최적화
//     maxWorkers: '50%',

//     // 출력 설정
//     verbose: true,
//     silent: false,

//     // 캐시
//     cache: true,
//     cacheDirectory: '<rootDir>/.jest-cache',

//     // 전역 변수
//     globals: {
//         'ts-jest': {
//             isolatedModules: true,
//         },
//     },

//     // 무시할 경로
//     testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
//     transformIgnorePatterns: ['node_modules/(?!(module-to-transform)/)'],
// };
