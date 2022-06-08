const { defineConfig } = require('@vue/cli-service')
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true
})

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = 8099

module.exports = {

  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,

  devServer: {
    port: port,
    open: true
  },
  configureWebpack: {
    name: 'facade-generator-vue',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
