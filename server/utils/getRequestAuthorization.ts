export const getRequestAuthorization = (event: any) => {
  const authorization = getRequestHeader(event, 'Authorization')
  return authorization
}
