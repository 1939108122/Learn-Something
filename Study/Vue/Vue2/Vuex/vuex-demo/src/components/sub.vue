<template>
    <div>
        {{c}}
        <button @click="sub()">-1</button>
        local: {{local}}
    </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';



export default {
    data() {
        return {
            local: localStorage.getItem('count')
        };
    },
    computed: {
        // ...mapState(['count'])
        ...mapState({
            c: state => state.count
        })
    },
    methods: {
        ...mapMutations(['sub']),
    }
}
</script>