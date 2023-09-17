<template>
    <div>
        {{a}}
        {{b}}
        <button @click="change">修改a</button>

        <button @click="change2">修改b</button>
    </div>
</template>

<script>
export default {
    model: {
        prop: 'a',
        event: 'change'
    },
    props: {
        a: {
            type: Number,
            default: 0
        },
        b: {
            type: Number,
            default: 0
        }
    },
    methods: {
        change() {
            this.$emit('change', 2);
        },
        change2() {
            
        }
    }
}
</script>