'use strict'

const { resolve } = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...moduleOptions,
    ...this.options.turnstile
  }

  this.addPlugin({
    fileName: 'recaptcha.js',
    options,

    src: resolve(__dirname, 'plugin.js')
  })

  this.addTemplate({
    fileName: 'turnstile.vue',
    src: resolve(__dirname, 'turnstile.vue')
  })
}

module.exports.meta = require('../package.json')
