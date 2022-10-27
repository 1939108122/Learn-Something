<template>
    <div>
        {{c}}
        <button @click="sub()">-1</button>
    </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';



export default {
    data() {
        return {

        };
    },
    computed: {
        // ...mapState(['count'])
        ...mapState({
            c: state => state.count
        })
    },
    methods: {
        ...mapMutations(['sub'])
    }
}
</script>