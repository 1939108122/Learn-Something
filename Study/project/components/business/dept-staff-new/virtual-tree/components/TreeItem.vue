<template>
    <div>
        <div
            :style="{ paddingLeft: (item.deep - 1) * 20 + 'px' }"
            :class="{ selected: item.selected }"
            class="virtual-tree-item"
        >
            <tree-switch
                v-if="item.rNode - item.lNode > 1"
                :item="item"
                @expand="expand"
            />
            <div class="tree-text-item" :class="{ active: selectedId === item.id }">
                <ui-checkbox v-if="multi" :value="item.checked === checkEnum.check" :indeterminate="item.checked !== checkEnum.check && item.checked !== checkEnum.uncheck" style="margin-top: 1px" @on-change="change($event, item)" />
                <div class="item-text" @click="select(item)">
                    <i v-if="item.classCode === -1" class="icrm-user-pro" style="margin-right: 8px"></i>{{ item.title }}
                </div>
            </div>
        </div>
        <!-- <div v-if="item.children.length > 0">
            <template v-for="child in item.children">
                <tree-item
                    :key="child.id"
                    :item="child"
                    :multi="multi"
                    @expand="expand"
                    @check="({ id, checked }) => check(id, checked)"
                />
            </template>
        </div> -->
    </div>
</template>

<script>
import TreeSwitch from './TreeSwitch';
import { checkEnum } from '../utils/const-variable';

export default {
    name: 'TreeItem',
    components: { TreeSwitch },
    props: {
        item: {
            type: Object,
            required: true,
        },
        multi: {
            type: Boolean,
            default: false,
        },
        selectedId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            checkEnum,
        };
    },
    methods: {
        select(item) {
            this.$emit('select', item);
        },
        change(v, item) {
            item.checked === checkEnum.check ? this.check(item.id, checkEnum.uncheck) : this.check(item.id, checkEnum.check);
        },
        check(id, checked) {
            this.$emit('check', { id, checked });
        },
        expand({ item }) {
            this.$emit('expand', { item });
        },
    },
};
</script>

<style lang="less" scoped>
.virtual-tree-item {
  display: flex;
  align-items: center;

  .tree-text-item {
    display: flex;
    align-items: center;
    flex: 1 1 0;
    height: 36px;
    padding: 0 4px;
    margin-left: 4px;
    border-radius: 4px;
    &:hover {
        background: #F7F8FB;
    }
    &.active {
        background: #F7F8FB;
        color: #01A09C;
    }
    .item-text {
        display: flex;
        align-items: center;
        flex: 1 1 0;
        text-align: start;
        cursor: pointer;
        font-size: 13px;
        line-height: 18px;
    }
  }
}
</style>
