const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir => path.join(__dirname, 'src', dir)

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/': {
        target: 'https://fapi.dev.aiads.com',
        changeOrigin: true,
        ws: true,
        bypass(req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html'
          }
        },
        onProxyRes(proxy) {
          const cookies = proxy.headers['set-cookie']
          if (cookies) {
            const newCookies = cookies.map(it =>
              it.replace(/Domain=[^\s;]+;?/i, 'Domain=localhost;'))
            proxy.headers['set-cookie'] = newCookies
          }
        }
      }
    }
  },

  chainWebpack: config => {
    const isDev = process.env.NODE_ENV === 'development'
    // 开发|测试|仿真|生产：aiads-dev|qas|stg|prd
    ; [
      {
        env: 'dev',
        baseUrl: isDev ? '/' : 'https://dev.aiads.com',
        ajaxBaseUrl: isDev ? '/' : 'https://fapi.dev.aiads.com',
      },
      {
        env: 'qas',
        baseUrl: 'https://qas.aiads.com',
        ajaxBaseUrl: 'https://fapi.qas.aiads.com',
      },
      {
        env: 'stg',
        baseUrl: 'https://stg.aiads.com',
        ajaxBaseUrl: 'https://fapi.stg.aiads.com',
      },
      {
        env: 'prd',
        baseUrl: 'https://aiads.com',
        ajaxBaseUrl: 'https://fapi.aiads.com',
      },
    ].forEach(it => {
      const { env } = it
      config.plugin(env === 'dev' ? 'html' : `html-${env}`).use(HtmlWebpackPlugin, [{
        template: 'public/index.html',
        filename: isDev && env === 'dev'
          ? 'index.html'
          : `index-aiads-${env}.html`,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          removeAttributeQuotes: true,
        },
        VAR: it,
      }])
    })

    config.performance.hints(false)
  }
}
