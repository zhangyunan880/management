const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      // 将 /api 匹配到 http://localhost:8000
      '/index.php': {
        // target: 'http://127.0.0.1:8099',// 后端端口号
        target: 'http://www.yn.com:888/',// 后端端口号

      
        changeOrigin: true, // 能否跨域
        ws: true, // 这里默认是true
        secure: false
      }
    }
}

 
  


})
