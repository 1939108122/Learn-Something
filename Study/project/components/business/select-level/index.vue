<template>
    <ui-popover
        v-model="dropdownVisible"
        trigger="click"
        appendToBody
        :disabled="disabled"
        :visible-arrow="false"
        :offset="0"
        :popper-class="`${popperClass} ui-select-level`"
        :width="dropdownWidth"
    >
        <ui-similar-input ref="similarInputRef" :class-name="similarInputClasses" slot="reference" no-scroll>
            <template v-if="$slots.labelPrefix" #labelPrefix>
                <slot name="labelPrefix"></slot>
            </template>

            <template v-if="currentCheckedNodeList.length === 0">
                <span class="placeholder">请选择</span>
                <i class="ui-icon-arrow-down icon"></i>
            </template>

            <template v-else>
                <TagTooltipCount
                    :props="{ label: 'name', value: 'id' }"
                    :data-list="currentCheckedNodeList"
                    :showSearch="showSearch"
                    closable
                    @close="onClose"
                />

                <i class="ui-icon-circle-close icon" @click.stop="onClear"></i>
            </template>
        </ui-similar-input>
        <div class="panel-header" v-if="showSearch">
            <ui-input v-model.trim="filterText" placeholder="输入关键词搜索" @on-change="inputNumber">
                <i class="ui-icon-search" slot="suffix"></i>
            </ui-input>
        </div>
        <div class="tree-wrapper">
            <div v-show="searchList && searchList.length">
                <ui-checkbox
                    v-for="item in searchList"
                    :key="item.encryptId"
                    :label="item.name"
                    :value="item.checked"
                    :disabled="item.disabled"
                    class="obj-check-item"
                    @on-change="selectCheckedItem($event, item)"
                >
                    <span class="check-name">{{ item.name }}</span>
                    <div class="check-desc">{{ item.parentName }} > {{ item.name }}</div>
                </ui-checkbox>
            </div>
            <ui-tree
                v-show="!searchFlag && searchList.length === 0"
                ref="uiTree"
                render-after-expand
                check-strictly
                show-checkbox
                check-on-click-node
                node-key="id"
                :props="{
                    label: 'name',
                    children: 'children'
                }"
                :data="treeList"
                :default-expanded-keys="expandedKeys"
                :expand-on-click-node="false"
                @check="onCheck"
            />
            <span v-if="searchFlag && searchList.length === 0" class="no-data">暂无搜索结果</span>
        </div>
    </ui-popover>
</template>

<script>
import UiSimilarInput from '@/components/feature/similar-input';
import UiTag2 from '@/components/feature/tag/index';
import TagTooltipCount from '@/components/feature/tag-tooltip-count';

import { userLevelTree } from '@/store/modules/common/state-datas/level';

export default {
    name: 'UiSelectLevel',
    components: { TagTooltipCount, UiSimilarInput, UiTag2 },
    props: {
        popperClass: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        showSearch: {
            type: Boolean,
            default: false
        },
        treeData: {
            type: Array,
            default: () => userLevelTree
        },
        showClear: {
            type: Boolean,
            default: false
        },
        selectedTreeItems: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dropdownVisible: false,
            dropdownWidth: 272,
            currentCheckedNodeList: [], // 当前选中的所有节点
            userLevelTree,
            filterText: '',
            searchList: [],
            checkedSearchList: [],
            searchFlag: false
        };
    },
    computed: {
        similarInputClasses() {
            return ['select-level-input', this.dropdownVisible && 'select-visible'].filter(Boolean).join(' ');
        },

        checkedKeys() {
            return this.currentCheckedNodeList.map(item => item.id);
        },

        // 默认展开的节点key
        expandedKeys() {
            return [...new Set(this.currentCheckedNodeList.map(item => item.parentId).filter(Boolean))];
        },
        treeList() {
            return this.treeData;
        }
    },
    watch: {
        async dropdownVisible(newVal) {
            if (!newVal) return;

            await this.$nextTick();

            this.$refs.uiTree.setCheckedKeys(this.checkedKeys);
        },
        checkedKeys: {
            handler(newVal) {
                this.$emit('input', newVal.join(','));
                this.$emit('change', this.currentCheckedNodeList);
            },
            deep: true
        },
        selectedTreeItems: {
            handler(newValue) {
                this.currentCheckedNodeList = newValue;
            },
            deep: true
        }
    },
    methods: {
        startObserver() {
            // 🥱输入框容器
            const inputResizeObserver = new ResizeObserver(([inputContainer]) => {
                this.dropdownWidth = inputContainer.target.offsetWidth;
            });
            /* 监听 */
            inputResizeObserver.observe(this.$refs.similarInputRef.$el);

            /* 取消监听 */
            this.$on('hook:beforeDestroy', () => {
                inputResizeObserver.disconnect();
            });
        },
        async reCalcTreeData(callback) {
            if (!this.$refs.uiTree) return;

            await this.$nextTick();

            const { getCheckedNodes } = this.$refs.uiTree;
            // 当前选中的所有节点
            this.currentCheckedNodeList = getCheckedNodes();

            callback?.();
        },
        onCheck(currentNodeData) {
            const { setChecked, getNode, getCheckedNodes } = this.$refs.uiTree;
            // 当前操作的节点
            const currentNode = getNode(currentNodeData.id);

            // 当前节点是选中状态
            if (currentNode.checked) {
                // 取消选中子节点
                if (currentNode.data.children) {
                    currentNode.data.children.forEach(childNodeData => {
                        setChecked(childNodeData.id, false);
                    });
                }

                // 取消选中父节点
                if (currentNodeData.parentId !== null) {
                    setChecked(currentNodeData.parentId, false);
                }
            }

            this.reCalcTreeData();
        },
        onClose(nodeId) {
            if (this.dropdownVisible) {
                this.$refs.uiTree.setChecked(nodeId, false);
            } else {
                this.currentCheckedNodeList = this.currentCheckedNodeList.filter(item => item.id !== nodeId);
            }

            this.reCalcTreeData();
        },
        // 清空
        onClear() {
            if (this.dropdownVisible) {
                this.$refs.uiTree.setCheckedKeys([]);
            } else {
                this.currentCheckedNodeList = [];
            }

            this.reCalcTreeData(() => {
                this.dropdownVisible = false;
            });
        },
        selectCheckedItem(val, item) {
            if (val) {
                this.currentCheckedNodeList.push(item);
                this.$refs.uiTree.setChecked(item.encryptId, true, false);
            } else {
                this.searchList = this.searchList.map(cell => {
                    if (cell.encryptId === item.encryptId) {
                        cell.checked = false;
                    }
                    return cell;
                });
                this.currentCheckedNodeList = this.currentCheckedNodeList
                    .map(cell => {
                        if (cell.encryptId === item.encryptId) {
                            return;
                        } else {
                            return cell;
                        }
                    })
                    .filter(Boolean);
                this.$refs.uiTree.setChecked(item.encryptId, false, false);
            }
        },
        getSearchList(val, list) {
            const encryptIds = this.currentCheckedNodeList?.map(item => item.encryptId) || [];

            (list || []).forEach(item => {
                if (item.name.includes(val)) {
                    const index = encryptIds.indexOf(item.encryptId);

                    if (item.encryptId)
                        if (index !== -1) {
                            item.checked = true;
                        }
                    this.searchList.push(item);
                }
                item.children && this.getSearchList(val, item.children);
            });
        },
        inputNumber(e) {
            if (e.target.value) {
                this.searchFlag = true;
                this.getSearchList(e.target.value, this.treeData);
            } else {
                this.searchFlag = false;
                this.searchList = [];
            }
        }
    },
    mounted() {
        this.startObserver();
    }
};
</script>

<style lang="less" scoped>
.select-level-input {
    position: relative;
    min-width: 272px;
    width: 100%;
    padding-right: 32px;

    .ui-tag2:not(:last-child) {
        margin-right: 4px;
    }

    &:hover {
        .ui-icon-circle-close {
            display: inline-block;
        }
    }

    .icon {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%) rotate(0deg);
        color: #8790a2;
        transition: all 0.2s ease-in-out;
    }

    .ui-icon-circle-close {
        display: none;
        transition: all 0.3s;

        &:hover {
            color: #8790a2;

            &::after {
                content: '';
                position: absolute;
                left: -1px;
                top: -1px;
                display: inline-block;
                width: 16px;
                height: 16px;
                background: #e4e8f0;
                z-index: -1;
                border-radius: 4px;
            }
        }
    }

    &.select-visible {
        .ui-icon-arrow-down {
            transform: translateY(-50%) rotate(180deg);
        }
    }

    .placeholder {
        font-size: 14px;
        color: #9fa6b5;
        line-height: 20px;
    }

    .text-content {
        font-size: 14px;
        color: #363f55;
        line-height: 20px;
    }
}
.panel-header {
    padding: 6px;
    ::v-deep {
        .input-wrap {
            width: 100%;
            min-width: auto;
        }
    }
}
.obj-check-item {
    width: 100%;
    height: 54px;
    padding: 8px 10px;
    .check-name {
        line-height: 20px;
        color: #363f55;
        font-size: 14px;
    }
    .check-desc {
        margin-left: 18px;
        line-height: 17px;
        color: #9fa6b5;
        font-size: 12px;
        font-weight: 400;
    }
}
</style>

<style lang="less">
.ui-select-level {
    padding: 0;
    .icon-close::before {
        display: none;
    }
    &.ui-popper[x-placement^='bottom'] {
        margin-top: 1px;
    }

    .tree-wrapper {
        display: flex;
        padding: 4px;
        height: 240px;
        overflow: auto;

        &::-webkit-scrollbar {
            &-track-piece {
                background-color: transparent !important;
            }
        }

        .ui-tree {
            min-width: 100%;
            color: #363f55;
            .ui-tree-node__content {
                height: 40px;
                border-radius: 4px;

                &:hover {
                    .checkbox:not(.checkbox-disabled) {
                        .checkbox-inner {
                            border-color: #00bebd;
                        }
                    }
                }

                .checkbox-inner {
                    width: 16px;
                    height: 16px;
                }
            }
            .ui-tree-node__children {
                display: inline-block;
                min-width: 100%;
            }
        }
        .no-data {
            margin: auto;
            line-height: 18px;
            color: #9fa6b5;
            font-size: 13px;
            font-weight: 400;
        }
    }
}
</style>
