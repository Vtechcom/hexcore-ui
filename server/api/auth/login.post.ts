export default defineEventHandler(async event => {
  const body = await readBody(event)
  const rs = await $axios.post('/hydra-main/login', body)
  return rs
})
