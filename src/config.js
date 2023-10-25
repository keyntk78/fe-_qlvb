const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
  basename: '/',
  defaultPath: '/',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,

  // apiUrl: 'http://localhost:5203/api',
  // urlFile: 'http://localhost:5203/Resources/',
  apiUrl: 'https://api.quanlyvanbang.cenit.vn/api',
  urlFile: 'https://api.quanlyvanbang.cenit.vn/Resources/',

  secretKey: 'mytopsecretkeywithatleast32characterslong',

  urlImages: 'https://api.quanlyvanbang.cenit.vn'
};

export default config;
