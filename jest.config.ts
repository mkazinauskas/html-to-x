import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  preset: 'ts-jest',
  testEnvironment: 'node',

  testPathIgnorePatterns: [
    '<rootDir>/__tests__/src/__helpers'
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)