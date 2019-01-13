<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  const windowWidth: number = document.documentElement.clientWidth;
  const rem: number = windowWidth / 7.5;
  document.documentElement.style.fontSize = rem + 'px';
</script>


<style lang="scss">
body, html {
  width: 100%;
  height: 100%;
}
* {
  border: none;
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
