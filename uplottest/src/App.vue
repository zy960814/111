<template>
  <div id="app">
    <div class="left-menu">
      <router-link to="/">home</router-link> |
      <router-link to="/uPlot">uPlot</router-link> |
      <router-link to="/echart">echart</router-link>
    </div>
    <div>
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  .left-menu {
    width: 200px;
  }
}

nav {
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
