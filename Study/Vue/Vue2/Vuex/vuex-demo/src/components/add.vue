<template>
    <div>
        当前的值为 {{showNum}}
        <button @click="add">+1</button>
        <button @click="addSync">+1 async</button>
        local: {{localData}}
    </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            localData: localStorage.getItem('count')
        };
    },
    computed: {
        ...mapGetters(['showNum'])
    },
    methods: {
        add() {
            this.$store.commit('increment', 5);
            localStorage.setItem('count', 30);
        },
        addSync() {
            this.$store.dispatch('addSync', 20);
        }
    }
}
</script>