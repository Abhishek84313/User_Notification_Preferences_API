module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [ '<rootDir>/src/tests'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };