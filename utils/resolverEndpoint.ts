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

export const getHydraNodeWs = (port: number) => {
  // const host = 'hydranode.io.vn'
  // Wildcard: hydranode-10005.hexcore.io.vn
  // Check dev or prod
  const isLocalDev =
    useRuntimeConfig().BASE_API_URL.includes('localhost') || useRuntimeConfig().BASE_API_URL.includes('127.0.0.1')
  const pattern = useRuntimeConfig().public.hydraNodeProxyPattern
  return `${isLocalDev ? 'ws' : 'wss'}://${pattern.replace('<port>', String(port))}`
}
