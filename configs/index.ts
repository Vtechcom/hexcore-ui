const loadConfigs = () => {
  return {
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
    hydraNodeProxyPattern: process.env.NUXT_PUBLIC_HYDRA_NODE_PROXY_PATTERN,
    hydraNodeProxySSL: process.env.NUXT_PUBLIC_HYDRA_NODE_PROXY_SSL === 'true'
  }
}

export default loadConfigs
