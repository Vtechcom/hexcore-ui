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

export const getHydraNodeUrl = (port: number) => {
  // const host = 'hydranode.io.vn'
  // Wildcard: hydranode-10005.hexcore.io.vn
  const pattern = useRuntimeConfig().public.hydraNodeProxyPattern
  return `wss://${pattern.replace('<port>', String(port))}`
}
