<template>
    <div class="tree-content">
        <VirtualTree
            ref="virtualTree"
            :tree="treeData"
            titleKey="name"
            pidKey="parentUniqueId"
            idKey="uniqueId"
            :staffEncryptId="staffEncryptId"
            :deptEncryptId="deptEncryptId"
            :deptOnly="deptOnly"
            @update-item="updateItem"
            @on-select="onSelect"
        />
    </div>
</template>

<script>

import VirtualTree from './virtual-tree/tree.vue';

export default {
    name: 'TreeContent',
    components: { VirtualTree },
    props: {
        treeData: {
            type: Array,
            default: () => []
        },
        staffEncryptId: { // 销售加密id
            type: String,
            default: ''
        },
        deptEncryptId: { // 部门加密id
            type: String,
            default: ''
        },
        deptOnly: { // 只有部门
            type: Number,
            default: 0 // 0 默认全部  1 只取部门
        }
    },
    data() {
        return {};
    },
    methods: {
        updateItem(item) {
            this.$emit('update-item', item);
        },
        onSelect(item, resetFlag) {
            this.$emit('on-select', item, resetFlag);
        },
    },
};
</script>