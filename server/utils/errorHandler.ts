export function errorResponseHandler(error: any, event: any) {
  if (event) {
    setResponseStatus(event, parseInt(error?.statusCode || error?.data?.statusCode) || 400)
  }
  return {
    message: error?.message || error?.data?.message || 'Bad request',
    status: error?.status || error?.data?.status || 'FAILED',
    statusCode: parseInt(error?.statusCode || error?.data?.statusCode) || 400,
    data: error?.data || null,
    proxyApi: error?.request?.path,
    trace: error?.trace || null
  }
}
