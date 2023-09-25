<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{ count }}
  </div>

  {{ state }}

  <button>dadssd</button>
</template>

<script setup>
import { ref, reactive } from 'vue';
let count = ref(1);



let state = reactive({
    b: 1
});


console.log(count);


console.log(state);
</script>

<script lang="ts">
</script>