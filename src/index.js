// index.js
import WxjWidget from './components/ChatWidget.vue';

export { WxjWidget }; // 命名导出

// 或者通过默认导出
export default {
  install(Vue) {
    Vue.component('WxjWidget', WxjWidget); // 注册全局组件
  },
  WxjWidget,
};
