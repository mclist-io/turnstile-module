import { useBody } from 'h3'

/**
 * It is highly recommended to use enviroment variables instead of hardcoded secrets.
 */

// TEST KEY, DO NOT USE IN PRODUCTION. GENERATE YOUR OWN.
const SECRET_KEY = '0x4AAAAAAACKzpqnAPdbjm7YxlZV7fmWnvg'

/**
 * This is an example that demonstrates how verifying turnstile on the server side works.
 * Do not use this middleware in your production.
 */
export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const { token } = await useBody(req)

    if (!token) {
      res.end(JSON.stringify({
        success: false,
        message: 'Invalid token'
      }))
      return
    }

    let formData = new FormData();
    formData.append('secret', SECRET_KEY);
    formData.append('response', token);
  
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    });

    const response = await result.json();

    if (response.success) {
      res.end(JSON.stringify({
        success: true,
        message: 'Token verifyed',
        response: response
      }))
    } else {
      res.end(JSON.stringify({
        success: false,
        message: 'Invalid token - ' + token,
        response: response
      }))
    }
  } catch (e) {
    console.log('turnstile error:', e)
    res.end(JSON.stringify({
      success: false,
      message: 'Internal error'
    }))
  }
}
