const { rewireWorkboxInject, defaultInjectConfig, rewireWorkboxGenerate, defaultGenerateConfig } = require('react-app-rewire-workbox');
const path = require('path');

module.exports = function override(config, env) {
  if (env === 'production') {
    console.log('Production build - Adding Workbox for PWAs');
    // Extend the default injection config with required swSrc
    console.log(defaultGenerateConfig);
    const workboxConfig = {
      globDirectory: 'build/',
      include: ['**/*.{png,json,mp3,xml,ico,html,txt,svg,js,webmanifest,css}'],
      swDest: path.join(__dirname, 'public', 'sw.js'),
      maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
      exclude: [/\.map$/, /^(?:asset-)manifest.*\.js(?:on)?$/],
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/__/, /\/[^/]+.[^/]+$/],
      clientsClaim: true,
    };
    config = rewireWorkboxGenerate(workboxConfig)(config, env);
  }

  return config;
};
