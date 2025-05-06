export const getHydraNodeEndpoint = (port: number) => {
  const proxyPattern = useRuntimeConfig().public.hydraNodeProxyPattern
  const endpointWildcard = proxyPattern.replace('<port>', port.toString())
  const endpoint = useRuntimeConfig().public.hydraNodeProxySSL
    ? `https://${endpointWildcard}`
    : `http://${endpointWildcard}`
  return {
    ws: endpoint.replace('http', 'ws'),
    http: endpoint
  }
}
