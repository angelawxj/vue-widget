// vue.config.js
module.exports = {
  configureWebpack: {
    output: {
      library: 'wxj-widget',  // 设置库名称
      libraryTarget: 'umd',   // 设置库的构建格式
    },
  },
  css: {
    extract: false,  // 保持CSS内联
  },
};
