import { EventEmitter } from 'events'
import Vue from 'vue'

const API_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

class Turnstile {
  constructor ({ siteKey }) {
    if (!siteKey) {
      throw new Error('Turnstile error: No key provided')
    }

    this._elements = {}
    this._turnstile = null

    this._eventBus = null
    this._ready = false

    this.siteKey = siteKey
  }

  destroy () {
    if (this._ready) {
      this._ready = false

      const { head } = document

      const scripts = [...document.head.querySelectorAll('script')]
        .filter(script => script.src.includes('turnstile'))

      if (scripts.length) {
        scripts.forEach(script => head.removeChild(script))
      }
    }
  }

  async execute (action) {
    try {
      await this.init()

      if ('turnstile' in window) {
        return this._turnstile.execute(
          this.siteKey,
          { action }
        )
      }
    } catch (error) {
      throw new Error(`turnstile error: Failed to execute ${error}`)
    }
  }

  getResponse (widgetId) {
    return new Promise((resolve, reject) => {
      if ('turnstile' in window) {
        const response = this._turnstile.getResponse(widgetId)

        if (response) {
          this._eventBus.emit('turnstile-success', response)
          resolve(response)
        } else {
          const errorMessage = 'Failed to execute'

          this._eventBus.emit('turnstile-error', errorMessage)
          reject(errorMessage)
        }
      }
    })
  }

  init () {
    // weird bypass of "multiple turnstile instances" check
    delete window.turnstile;

    if (this._ready) {
      // make sure caller waits until turnstile get ready
      return this._ready
    }

    this._eventBus = new EventEmitter()
    this._elements = {
      script: document.createElement('script')
    }

    const { script } = this._elements

    script.setAttribute('src', API_URL)

    window.turnstileSuccessCallback = (token) => this._eventBus.emit('turnstile-success', token)
    window.turnstileExpiredCallback = () => this._eventBus.emit('turnstile-expired')
    window.turnstileErrorCallback = () => this._eventBus.emit('turnstile-error', 'Failed to execute')

    this._ready = new Promise((resolve, reject) => {
      script.addEventListener('load', () => {
        this._turnstile = window.turnstile;
        this._turnstile.ready(resolve);
      })

      script.addEventListener('error', () => {
        document.head.removeChild(script)
        reject('turnstile error: Failed to load script')
        this._ready = null;
      })

      document.head.appendChild(script)
    })

    return this._ready
  }

  on (event, callback) {
    return this._eventBus.on(event, callback)
  }

  reset (widgetId) {
    if (typeof window.turnstile !== 'undefined') {
      window.turnstile.reset(widgetId)
    }
  }

  render (reference, { sitekey, theme }) {
    return this._turnstile.render(reference.$el || reference, { sitekey, theme })
  }
}

export default function (_, inject) {
  const { turnstile = {} } = _.$config || {}
  const options = {
    ...<%= serialize(options) %>,
    ...turnstile,
  }

  Vue.component('Turnstile', () => import('./turnstile.vue'))
  inject('turnstile', new Turnstile(options))
}
