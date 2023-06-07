<template>
    <div class="virtual-tree-wrap">
        <div v-if="deptOnly === 0" class="tree-search-wrap">
            <ui-input v-model="searchVal" ref="searchInput" placeholder="搜索销售姓名" clearable @click.native.stop :class="{ 'input-fill': !!searchVal }">
                <i slot="suffix" class="icrm-bsearch"></i>
            </ui-input>
        </div>
        <div v-show="!searchVal" ref="virtualTreeRef" class="virtual-tree" :style="{ minHeight }" @scroll="scrollEvent" @click="clickTree">
            <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }" />
                <div class="infinite-list" :style="{ transform: transformOffset }">
                <template v-for="item in currentTreeList">
                    <tree-item
                        :multi="multi"
                        :key="item.id"
                        :item="item"
                        :selectedId="selectedId"
                        @expand="expand"
                        @check="({ id, checked }) => check(id, checked)"
                        @select="select"
                    />
                </template>
            </div>
        </div>
        <template v-if="searchVal">
            <ul v-if="searchList.length" class="search-list-wrap">
                <li v-for="item in searchList" :class="{ active: selectedId === item.id }" :key="item.id" @click="select(item)">
                    <i class="icrm-user-pro" style="margin-right: 8px"></i>
                    {{ item.title }}
                    <span v-if="item.deptName3" class="search-dept">{{ item.deptName3 }}</span>
                </li>
            </ul>
            <div v-else class="empty-text">暂无数据</div>
        </template>
    </div>
</template>

<script>
import { OperationData } from './mixins/operation-data';
import TreeItem from './components/TreeItem';
import { flattenTreeData } from './utils/const-variable';

let cacheRoot = {};

export default {
    name: 'VirtualTree',
    components: { TreeItem },
    mixins: [OperationData],
    props: {
        tree: {
            type: Array,
            default: () => [],
        },
        maxHeight: {
            type: Number,
            default: 232,
        },
        multi: { // 是否多选
            type: Boolean,
            default: false,
        },
        defaultExpandDeep: { // 默认展开到第几层
            type: Number,
            default: 2,
        },
        staffEncryptId: { // 销售加密id
            type: String,
            default: ''
        },
        deptEncryptId: { // 部门加密id
            type: String,
            default: ''
        },
        hasDefaultDept: { // 默认部门
            type: Boolean,
            default: true,
        },
        deptOnly: { // 只有部门
            type: Number,
            default: 0 // 0 默认全部  1 只取部门
        }
    },
    data() {
        return {
            currentTreeList: [],
            scrollTop: 0,
            startOffset: 0,
            searchVal: '', // 搜索值
            selectedId: '', // 选中的id
        };
    },
    computed: {
        //偏移量对应的style
        transformOffset() {
            return `translate3d(0, ${this.startOffset}px, 0)`;
        },
        factorHeight() {
            return this.listHeight > parseFloat(this.maxHeight)
                ? parseFloat(this.maxHeight)
                : this.listHeight;
        },
        minHeight() {
            const limit = Math.floor(this.maxHeight / this.itemSize);
            return this.currentTreeList.length < limit ? `${this.itemSize * this.currentTreeList.length}px` : `${this.maxHeight}px`;
        },
        searchList() {
            return this.searchVal ? this.mptt.filter(item => {
                return item.classCode === -1 && item.title.includes(this.searchVal);
            }) : [];
        }
    },
    watch: {
        tree: {
            handler() {
                const rootId = this.tree[0][this.pidKey];
                const treeData = flattenTreeData(this.tree);

                this._convert(treeData, rootId).then(() => {
                    this.currentTreeList = this._getVisibleItems(
                        this.scrollTop,
                        this.scrollTop + this.factorHeight
                    );
                    // for (const item of this.currentTreeList) {
                    //     item.collapseOnly = false;
                    // }

                    if (this.deptEncryptId || this.staffEncryptId) {
                        let findItem = {};
                        if (this.staffEncryptId) {
                            // 当人员id存在时，以人员id为主
                            findItem = this.mptt.filter(item => item.encryptId === this.staffEncryptId)[0] || {};
                            if (!findItem.id) {
                                findItem = this.mptt.filter(item => item.encryptId === this.deptEncryptId)[0] || {};
                            }
                        } else {
                            // 只存在部门
                            findItem = this.mptt.filter(item => item.encryptId === this.deptEncryptId)[0] || {};
                        }
                        this.selectedId = findItem.id || '';
                        this.$emit('update-item', findItem);

                        cacheRoot = { ...findItem }; // 暂存初始
                    } else if (this.hasDefaultDept) {
                        // 部门、人员 均不存在
                        this.selectedId = this.tree[0]?.uniqueId;
                        const findItem = this.mptt.filter(item => item.id === this.selectedId)[0] || {};

                        this.$emit('update-item', findItem);

                        cacheRoot = { ...findItem };  // 暂存初始
                    }

                    this.$emit('onLoad');
                });
            },
        },
    },
    methods: {
        clickTree() {
            this.$nextTick(() => {
                this.$refs.searchInput?.focus(); // 搜索框聚焦
            });
        },
        select(item, resetFlag) {
            this.selectedId = item.id;
            this.$emit('on-select', item, resetFlag);
        },
        check(id, checked) {
            if (this.multi) {
                this._check(id, checked, this.multi);
            }
        },
        expand({ item }) {
            this.$nextTick(() => {
                this.$refs.searchInput?.focus(); // 搜索框聚焦
            });
            // 取消删除
            // this._recursiveDelete(this.currentTreeList);
            // this.resetRemovable();
            item.expand = !item.expand;
            this._expand(item.id, item.lNode, item.rNode, item.expand);
            // if (item.expand) { // 展开
            //     // this._recursiveDeleteMark(this.currentTreeList);

            //     // 获取子元素
            //     const addChildren = this._getVisibleItems(
            //         item.bottom,
            //         this.startOffset + this.factorHeight,
            //         item.id,
            //     );


            //     // 子元素加入children里面
            //     // item.collapseOnly = false;
            //     item.children.push(...addChildren);
            //     // this.$nextTick(() => {
            //     //     this._recursiveDelete(this.currentTreeList);
            //     // });

            //     // console.log(addChildren, '&*(');
            // } else { // 收起
            //     let lastItem = null;
            //     // let startPos = Number.MAX_VALUE
            //     // let endPos = Number.MIN_VALUE
            //     // let childrenResult = []
            //     // item.collapseOnly = true;
            //     // 查出出父元素下children中的子元素
            //     const children = this._recursiveGetChildren(
            //         item.pid,
            //         item.lNode,
            //         item.rNode,
            //         this.currentTreeList
            //     );
            //     const addPos = children.length;
            //     for (let i = this.currentTreeList.length - 1; i >= 0; i--) {
            //         const treeItem = this.currentTreeList[i];
            //         if (treeItem.lNode > item.lNode && treeItem.rNode < item.rNode) {
            //             children.splice(addPos, 0, treeItem);
            //             this.currentTreeList.splice(i, 1);
            //         }
            //     }
            //     item.children.push(...children);

            //     lastItem = this._recursiveGetLastItem(item.id, this.currentTreeList);

            //     const addItem = this._getVisibleItems(
            //         lastItem.bottom,
            //         this.startOffset + this.factorHeight
            //     );
            //     this.currentTreeList.push(...addItem);

            //     this.$nextTick(() => {
            //         item.children.splice(0);
            //         this._removeChildren(item);
            //     });
            // }
            this.scrollEvent();
        },
        _recursiveGetLastItem(id, items) {
            let result = null;
            for (const item of items) {
                if (item.children.length > 0 && item.id !== id) {
                    result = this._recursiveGetLastItem(id, item.children);
                } else {
                    result = item;
                }
            }
            return result;
        },
        // 递归获取子元素
        _recursiveGetChildren(pid, lNode, rNode, items) {
            let result = [];
            for (const item of items) {
                if (item.id === pid) {
                    for (let i = item.children.length - 1; i >= 0; i--) {
                        if (
                            item.children[i].lNode > lNode &&
                            item.children[i].rNode < rNode
                        ) {
                            result.splice(0, 0, item.children[i]);
                            item.children.splice(i, 1);
                        }
                    }
                    result.push(
                        ...this._recursiveGetChildren(item.pid, lNode, rNode, items)
                    );
                    break;
                }
            }
            return result;
        },
        /**
         * 标记需要删除的对象
         * @param items
         * @private
         */
        // _recursiveDeleteMark(items) {
        //     for (const cItem of items) {
        //         if (cItem.children.length > 0) {
        //             this._recursiveDeleteMark(cItem.children);
        //         }
        //         if (cItem.top >= this.scrollTop + parseFloat(this.height)) {
        //             cItem.removable = true;
        //         }
        //     }
        // },
        // 递归删除不显示的元素
        // _recursiveDelete(items) {
        //     for (let i = items.length - 1; i >= 0; i--) {
        //         const cItem = items[i];
        //         if (cItem.children.length > 0) {
        //             this._recursiveDelete(cItem.children);
        //         }
        //         if (cItem.removable) {
        //             items.splice(i, 1);
        //         }
        //     }
        // },
        // fuzzySearch(value) {
        //     console.log(value);
        // },
        scrollEvent() {
            // this.scrollTop = $event?.target?.scrollTop || 0;
            // this.$refs.virtualTreeRef?.scrollTop;
            // this.scrollTop = document.querySelector('.virtual-tree')?.scrollTop;
            this.scrollTop = this.$refs.virtualTreeRef?.scrollTop;
            //此时的偏移量
            this.startOffset = this.scrollTop - (this.scrollTop % this.itemSize);

            const results = this._getVisibleItems(
                this.startOffset,
                this.startOffset + this.factorHeight
            );

            for (const item of results) {
                item.children.splice(0);
                // item.collapseOnly = false;
            }
            this.currentTreeList = results;
        },

        reset() {
            this.select(cacheRoot, true);  // 恢复初始化
            this.searchVal = '';
        },

        clear() {
            this.select({}, true);  // 恢复初始化
            this.clearSearch();
        },
        clearSearch() {
            this.searchVal = '';
        }
    },
};
</script>

<style lang="less">
.virtual-tree-wrap {
    .tree-search-wrap {
        margin: 12px 12px 0 12px;
        .input-wrap {
            display: block;
            min-width: initial;
            .suffix-clear {
                z-index: 3;
                .ui-icon-circle-close {
                    text-align: center;
                    line-height: 32px;
                }
            }
        }
        .input-wrap-clearable {
            &.input-fill {
                .suffix-clear {
                    display: block;
                }
                .icrm-bsearch {
                    display: none;
                }
                &.input-focusing {
                    .icrm-bsearch {
                        display: none;
                    }
                }
                .ui-icon-circle-close {
                    display: block !important;
                }
            }

        }
    }
    .virtual-tree {
        overflow: auto;
        position: relative;
        margin: 12px 0px;
        &::-webkit-scrollbar-track-piece {
            background-color: transparent;
        }
        .infinite-list-phantom {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            z-index: -1;
        }
        .infinite-list {
            display: grid;
            position: absolute;
            width: 100%;
            padding: 0 12px;
            white-space: nowrap;
        }
    }

    .search-list-wrap {
        padding: 12px 0;
        max-height: 232px;
        overflow-y: auto;
        &::-webkit-scrollbar-track-piece {
            background-color: transparent;
        }
        li {
            display: flex;
            align-items: center;
            height: 36px;
            padding: 0 12px;
            white-space: nowrap;
            &:hover {
                cursor: pointer;
                background-color: #F7F8FB;
            }
            .search-dept {
                margin-left: 8px;
                font-size: 12px;
                color: #757D8C;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &.active {
                background: #F7F8FB;
                color: #4465EB;
            }
        }
    }
    .empty-text {
        padding: 12px;
        font-size: 12px;
        color: #d1d4db;
        text-align: center;
    }
}
</style>
