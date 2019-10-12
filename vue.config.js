const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

const resolve = dir => path.join(__dirname, 'src', dir)

module.exports = {
  // 加快编译速度
  productionSourceMap: true,

  devServer: {
    host: 'fdev.aiads-dev.com',
    disableHostCheck: true,
  },

  chainWebpack: config => {
    config
    .plugin('provide')
    // TODO: 去掉全局引入
    .use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill/dist/quill.js',
      'Quill': 'quill/dist/quill.js'
    }])
    const isDev = process.env.NODE_ENV === 'development'
    // 开发|测试|仿真|生产：aiads-dev|qas|stg|prd
    ; [
      {
        env: 'dev',
        baseUrl: isDev ? '/' : 'https://aiads-dev.com',
        ajaxBaseUrl: 'https://fapi.aiads-dev.com',
      },
      {
        env: 'qas',
        baseUrl: 'https:/www.jydata-qas.com',
        ajaxBaseUrl: 'https://fapi.jydata-qas.com',
      },
      {
        env: 'stg',
        baseUrl: 'https://www.jydata-stg.com',
        ajaxBaseUrl: 'https://fapi.jydata-stg.com',
      },
      {
        env: 'prd',
        baseUrl: 'https://jydata.com',
        ajaxBaseUrl: 'https://fapi.jydata.com',
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
        // 是否使用统计
        useStats: it.env == 'prd'
      }])
    })

    config.performance.hints(false)

    // 为了支持 iview theme
    config.module.rule('less').oneOf('normal').use('less-loader')
    .tap(args => ({ ...args, javascriptEnabled: true }))

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.transformAssetUrls = {
          ColorIcon: ['url']
        }
        return options
      })
  }
}
