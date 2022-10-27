<template>
  <div id="app">
    <Add></Add>
    <p>---------------------</p>
    <Sub></Sub>
  </div>
</template>

<script>

import Add from './components/add.vue';
import Sub from './components/sub.vue';

export default {
  name: 'App',
  components: {
    Add,
    Sub
  }
}
</script>

<style>
