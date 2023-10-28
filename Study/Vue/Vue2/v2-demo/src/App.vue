<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>


    <input v-model="inputVal" @input="inputChange">
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>

function throttle(fn, delay = 100) {
    let previous = 0;

    return function(...args) {
        let now = Date.now();

        if(now - previous > delay) {
            previous = now;
            fn.apply(this, args);
        }
    }
}

export default {
    data() {
        return {
            inputVal: '',
        };
    },
    mounted() {
        this.inputChange = throttle(this.inputChange, 2000);
    },
    methods: {
        inputChange() {
            console.log(this.inputVal, 'input');
        }
    }
}
</script>
