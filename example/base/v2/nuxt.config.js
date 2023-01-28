const { resolve } = require('path')

module.exports = {
  buildDir: resolve(__dirname, '.nuxt'),

  modules: [
    ['../../../lib/module', {
      siteKey: '0x4AAAAAAACKzobQ0zy4D-Mx'
    }]
  ],

  serverMiddleware: [
    { path: '/api/check-token', handler: '~/api/captcha' }
  ],

  srcDir: __dirname,

  render: { resourceHints: false },
  rootDir: resolve(__dirname, '..')
}
