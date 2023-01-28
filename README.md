# Cloudflare Turnstile for Nuxt 2

Based on Nuxt reCaptcha module. Created for use at https://mclist.io

## Setup

1. Add `@artur9010/turnstile` dependency with `yarn` or `npm` into your project
2. Add `@artur9010/turnstile` to `modules` section of `nuxt.config.js`
3. Configure it:

```js
{
  modules: [
    [
      '@artur9010/turnstile', {
        siteKey: ""
      }
    ],
  ]
}
```

## Runtime config

```js
// nuxt.config.js
export default {
  publicRuntimeConfig: {
    turnstile: {
      /* reCAPTCHA options */
      siteKey: process.env.TURNSTILE_SITE_KEY // for example
    }
  }
}
```
## Usage

1. Add `<turnstile>` component inside your form:

```vue
<form @submit.prevent="onSubmit">
  <input autocomplete="true" placeholder="Email" type="email" v-model="email">
  <input autocomplete="current-password" placeholder="Password" type="password" v-model="password">
  <turnstile />
  <button type="submit">Sign In</button>
</form>
```

2. Call `getResponse` inside form submit handler to get turnstile token:

```js
async onSubmit() {
  try {
    const token = await this.$recaptcha.getResponse()
    console.log('Turnstile token:', token)

    // send token to server alongside your form data

    // at the end you need to reset recaptcha
    await this.$turnstile.reset()
  } catch (error) {
    console.log('Login error:', error)
  }
},
```

### Server Side

Check https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Originally created by mvrlin <mvrlin@pm.me>