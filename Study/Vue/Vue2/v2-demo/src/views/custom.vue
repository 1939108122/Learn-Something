<template>
    <div>
        {{a}}
        {{b}}
        <button @click="change">修改a</button>

        <button @click="change2">修改b</button>
        <slot :user="user">氟元素的slot</slot>
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
        },
        user: {
            type: Object,
            default: {}
        }
    },
    beforeCreate() {
        console.log('子beforeCreate');
    },
    created() {
        console.log('子created');
    },
    beforeMount() {
        console.log('子beforeMount');
    },
    mounted() {
        console.log('子Mounted');
    },
    updated() {
        console.log('子updated');
    },
    beforeDestroy() {
        console.log('子beforeDestroy');
    },
    destroyed() {
        console.log('子destroyed');
    },
    methods: {
        change() {
            this.$emit('change', 2);
        },
        change2() {
            this.$emit('update:b', 3);

            console.log(this);

            function a() {
                console.log(this, '12312');
            }
            a();
        }
    }
}
</script>