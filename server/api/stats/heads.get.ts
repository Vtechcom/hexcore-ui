import output from '~/server/data/head-stats.json'

export default defineEventHandler(async event => {
  try {
    const headData = output
    return headData
  } catch (error: any) {
    return errorResponseHandler(error, event)
  }
})
