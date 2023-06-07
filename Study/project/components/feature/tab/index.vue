<template>
    <ul :class="['component-tab-box', { sticky: sticky }]">
        <li v-for="(i, n) in list" :key="n" :class="{'active': i.value === value, 'new': i.isNew}" @click="onTabClick(i, n)">
            <slot v-if="$scopedSlots.title" name="title" :item="i" :index="n"></slot>
            <template v-else>{{ i.name }}</template>
        </li>

        <slot name="side"></slot>
    </ul>
</template>

<script>
export default {
    props: {
        value: [String, Number],
        list: Array,
        sticky: Boolean
    },
    methods: {
        onTabClick (i, n) {
            if(i.value != this.value) this.onChangeTab(i.value);
            this.$emit('input', i.value);
            this.$emit('on-click', n);
        },
        onChangeTab(val) {
            this.$emit('on-change', val);
        }
    }
};
</script>
