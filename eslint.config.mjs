import globals from 'globals';
import pluginJs from '@eslint/js';
import daStyle from 'eslint-config-dicodingacademy'; 

export default [
  {
    files: ['**/*.js'], 
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module', 
      globals: {
        ...globals.browser, 
        ...globals.node, 
        lazySizes: 'readonly', 
        process: 'readonly', 
        __dirname: 'readonly', 
      },
    },
    rules: {
    },
  },
  pluginJs.configs.recommended,
  daStyle,
];