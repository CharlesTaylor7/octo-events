import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';

module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['dist/'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
};
