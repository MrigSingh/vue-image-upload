<template>
  <div id="app">
    <h1>Vue image upload application</h1>
    <div class="container">
      <FileHandler />
    </div>
  </div>
</template>

<script>
import FileHandler from './components/FileHandler.vue';
import Vue from 'vue';
import VueFileAgent from 'vue-file-agent';

Vue.use(VueFileAgent);

export default {
  name: 'app',
  components: {
    FileHandler
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
h1 {
  margin: 0;
  text-align: center;
  background: #333;
  color: #fff;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
}
</style>
