<template>
  <div id="app">
    <AppHeader />
    <Home />
  </div>
</template>

<script>
import AppHeader from './components/Header.vue'
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    Home
  }
}
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
