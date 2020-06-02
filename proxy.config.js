const proxy = [
    {
      context: '/api-externa',
      target: 'http://192.168.56.1:8080',
      secure: false,
      logLevel: 'debug',
      changeOrigin: true,
      pathRewrite: { '^/api-externa': '' }
    }
  ]
  module.exports = proxy