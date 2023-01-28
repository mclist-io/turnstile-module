<template>
  <section class="index-page">
    <h2>Sign In</h2>

    <form @submit.prevent="onSubmit">
      <input
        autocomplete="true"
        placeholder="Email"
        type="email"
        v-model="email"
      >

      <input
        autocomplete="current-password"
        placeholder="Password"
        type="password"
        v-model="password"
      >

      <turnstile
        data-theme="light"
        @error="onError"
        @success="onSuccess"
        @expired="onExpired"
      />

      <button type="submit">Sign In</button> <NuxtLink to="about">about</NuxtLink>
      <p>turnstile object - {{ $turnstile }}<p>
      <p>status - {{ status }}</p>
    </form>
  </section>
</template>

<script>
export default {
  data: () => ({
    email: 'test@example.com',
    password: '123',
    status: false
  }),

  methods: {
    onError (error) {
      console.log('Error happened:', error)
    },

    async onSubmit() {
      try {
        const token = await this.$turnstile.getResponse()

        const response = await fetch('/api/check-token', {
          method: 'POST',
          body: JSON.stringify({
            token,
            email: this.email,
            password: this.password
          })
        }).then(res => res.json())

        console.log('Server Response: ', response)

        this.$turnstile.reset()
      } catch (error) {
        console.log('Login error:', error)
      }
    },

    onSuccess (token) {
      console.log('Succeeded:', token)
      this.status = true;
    },

    onExpired () {
      console.log('Expired')
      this.status = false;
    }
  },
}
</script>
