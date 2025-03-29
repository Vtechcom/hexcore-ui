export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const rs = await $axios.post('/hydra-main/active-party', body)
    return rs
  } catch (error) {
    errorResponseHandler(error, event)
  }
})
