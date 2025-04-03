export function errorResponseHandler(error: any, event: any) {
  if (event) {
    setResponseStatus(event, error?.status || error?.data?.status || 400)
  }
  return {
    message: error?.message || error?.data?.message || 'Bad request',
    status: error?.status || error?.data?.status || 'FAILED',
    statusCode: error?.status || error?.data?.status || 400,
    code: error?.data?.code || null,
    data: error?.data || null,
    proxyApi: error?.request?.path
  }
}
