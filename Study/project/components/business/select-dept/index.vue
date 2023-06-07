<!--选择部门（外层结合ui-dailog，实现弹框里选择部门）-->
<!--用例：/system/tagSetting/component/create-->

<template>
    <div class="component-select-dept">
        <!--tree-->
        <div class="panel">
            <div class="panel-header">
                <ui-input v-model.trim="filterText" placeholder="输入可筛选部门" clearable class="filter-input"></ui-input>
            </div>

            <div class="panel-content">
                <ui-tree ref="tree" :data="treeData" show-checkbox :node-key="nodekey" :default-expanded-keys="defaultExpandedKeys"   :default-checked-keys="checked" :props="defaultProps" @check-change="onCheckChange" :filter-node-method="filterNode" class="tree">
                </ui-tree>
            </div>
        </div>

        <!--已选-->
        <div class="panel">
            <div class="panel-header">
                <span class="clear-btn" @click="deleteAllChecked"><i class="icrm-delete-trash icon"></i>清空全部</span>
            </div>

            <div class="panel-content">
                <span v-for="(i, n) in checkedList" :key="n" class="dept-item">{{ i.fullPath }}<i class="ui-icon-error icon" @click="deleteChecked(i, n)"></i></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        treeData: Array, // 树结构
        checked: Array, // 已选的id数组
        nodekey: {
            type: String,
            default: 'encryptId'
        }
    },
    data() {
        return {
            filterText: '',
            defaultProps: {
                children: 'subLevelModelList',
                label: 'name'
            },
            defaultExpandedKeys: [], // 默认展开的
            checkedList: [] // 已选中的
        };
    },
    watch: {
        filterText (val) {
            this._timeout && clearTimeout(this._timeout);
            this._timeout = setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.tree && this.$refs.tree.filter(val);
                });
            }, 300);
        },
        checked: {
            handler(list) {
                this.$nextTick(() => {
                    this.onCheckChange();
                });
            },
            immediate: true
        },
        treeData: {
            handler(list) {
                this.defaultExpandedKeys = list.map(i => i[this.nodekey]); // 默认展开一级
                this.$nextTick(() => {
                    this.onCheckChange();
                });
            },
            immediate: true
        }
    },
    methods: {
        filterNode(str, data) {
            return data.name.indexOf(str) > -1;
        },

        onCheckChange() {
            this.checkedList = this.$refs.tree.getCheckedNodes();
        },

        deleteChecked(i, n) { // 删除已选
            this.checkedList.splice(n, 1);
            this.$refs.tree.setChecked(i, false, true); // 通过 key / data 设置某个节点的勾选状态
        },

        deleteAllChecked() { // 删除全部已选
            this.checkedList = [];
            this.$refs.tree.setCheckedNodes([]);
        },

        getData() {
            return this.checkedList || [];
        }
    }
};
</script>