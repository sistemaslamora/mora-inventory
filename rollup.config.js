export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
  },
  plugins: [vue(), commonjs(), resolve()],
  external: ['devextreme-vue/pivot-grid'],
};
