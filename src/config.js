const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
  basename: '/',
  defaultPath: '/admin',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,

  apiUrl: 'http://localhost:5203/api',
  urlFile: 'http://localhost:5203/Resources/',
  urlImages: 'http://localhost:5203',

  // apiUrl: 'https://api.quanlyvanbang.cenit.vn/api',
  // urlFile: 'https://api.quanlyvanbang.cenit.vn/Resources/',
  //urlImages: 'https://api.quanlyvanbang.cenit.vn'

  secretKey: 'mytopsecretkeywithatleast32characterslong'

  // urlImages: 'https://api.quanlyvanbang.cenit.vn',
  // apiUrl: 'https://api.quanlyvanbang.cenit.vn/api',
  // urlFile: 'https://api.quanlyvanbang.cenit.vn/Resources/'
};

export default config;
