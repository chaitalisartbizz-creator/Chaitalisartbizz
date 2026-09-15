const reactHooks = require('eslint-plugin-react-hooks');
const babelParser = require('@babel/eslint-parser');

module.exports = [
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
    },
    files: ['src/**/*.{js,jsx}'],
  },
];
