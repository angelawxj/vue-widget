<template>
  <div id="app">
    <ChatWidget />
  </div>
</template>

<script>
import ChatWidget from './components/ChatWidget.vue';

export default {
  name: 'App',
  components: {
    ChatWidget,
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
