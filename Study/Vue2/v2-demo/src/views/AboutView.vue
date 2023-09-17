<template>
  <div class="about">
    <h1>This is an about page</h1>
    <custom v-model="a" :b.sync="b"></custom>    
    
  </div>
</template>
<script>

import custom from './custom.vue';

export default {
    data() {
        return {
            a: 1,
            b: 2
        };
    },
    components: {
        custom
    } 
}
</script>
