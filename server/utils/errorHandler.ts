export function errorResponseHandler(error: any, event: any) {
  setResponseStatus(event, error.status || 400)
  return {
    message: error.message || error?.data.message || 'Bad request',
    status: error.status || error?.data.status || 'FAILED',
    statusCode: error.status,
    code: error?.data.code || null,
    data: error.data || null,
    proxyApi: error.request?.path
  }
}
