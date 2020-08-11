// 基础路径 注意发布之前要先修改这里
let baseUrl = '/'
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  publicPath: baseUrl, // 根据你的实际情况更改这里
  lintOnSave: true,
  productionSourceMap: false,
  // configureWebpack: config => {
  //     if (process.env.NODE_ENV === 'production') {
  //         return {
  //             plugins: [
  //                 new BundleAnalyzerPlugin()
  //             ]
  //         }
  //     }
  // },
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
  },
  /**
     * 环境配置
     */
  devServer: {
    proxy: {
      '/auth': {
        // target: 'http://49.232.134.179:9002',
        target: 'http://localhost:9002',
        changeOrigin: true
      },
      '/admin': {
        // target: 'http://49.232.134.179:9002',
        target: 'http://localhost:9002',
        changeOrigin: true
      },
    }
  }
  //
}
