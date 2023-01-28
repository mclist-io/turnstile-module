<template>
  <div
    :data-sitekey="siteKey || $turnstile.siteKey"
    :data-theme="dataTheme"
    :data-tabindex="dataTabindex"

    data-callback="turnstileSuccessCallback"
    data-expired-callback="turnstileExpiredCallback"
    data-error-callback="turnstileErrorCallback"
    class="cf-turnstile"
  />
</template>

<script>
export default {
  props: {
    siteKey: {
      type: String,
      default: ''
    },

    dataTheme: {
      default: 'auto',
      type: String,

      validator: (value) => {
        return ['auto', 'dark', 'light'].includes(value)
      }
    },

    dataTabindex: {
      default: 0,
      type: Number
    }
  },
  beforeDestroy() {
    this.$turnstile.destroy()
  },

  mounted() {
    this.$turnstile.init()

    this.$turnstile.on('turnstile-error', this.onError)
    this.$turnstile.on('turnstile-success', this.onSuccess)
    this.$turnstile.on('turnstile-expired', this.onExpired)
  },

  methods: {
    onError(message) {
      return this.$emit('error', message)
    },

    onSuccess(token) {
      return this.$emit('success', token)
    },

    onExpired() {
      return this.$emit('expired')
    }
  }
}
</script>
