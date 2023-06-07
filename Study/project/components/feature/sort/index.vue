<template>
    <span class="icrm-order-box">
        <i v-if="sort==='up'" class="icrm-order-up" @click="changeSort('down');"></i>
        <i v-if="sort==='down'" class="icrm-order-down" @click="changeSort('up');"></i>
    </span>
</template>
<script>
export default {
    name: 'sort',
    components: {},
    props: {
        value: {
            type: String,
            default: 'up'
        }
    },
    data() {
        return {
            sort: ''
        };
    },
    created() {
        this.sort = this.value;
    },
    methods: {
        changeSort(sort) {
            this.sort = sort;
            this.$emit('update:value', sort);
            this.$emit('on-change', sort);
        }
    },
    watch: {}
};
</script>
<style lang="less" scoped>
    .icrm-order-box {
        display: inline-block;
        margin-left: 5px;
        cursor: pointer;

        .icrm-order-up,
        .icrm-order-down {
            display: inline-block;
        }
        .icrm-order-down {
            color: #54d8c9;
        }
    }
</style>
