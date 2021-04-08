module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{png,json,mp3,xml,ico,html,txt,svg,js,webmanifest,css}'],
  swDest: 'public/sw.js',
  maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
};
