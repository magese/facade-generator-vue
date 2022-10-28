<template>
  <div style="display: flex; justify-content: center; align-items: center; margin: 10px 0 20px 0">
    <img alt="Vue logo" src="./assets/logo.svg">
    <h1 style="font-size: 42px">服务前置低代码平台</h1>
  </div>
  <facade-generator/>
</template>

<script>
import FacadeGenerator from './components/FacadeGenerator'

export default {
  name: 'App',
  components: {
    FacadeGenerator
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
