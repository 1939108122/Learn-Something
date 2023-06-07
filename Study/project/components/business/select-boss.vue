<!--选择BOSS-->
<template>
    <div class="component-select-boss">
        <!------------------------------ 筛选 ------------------------------>
        <ui-form inline :model="formData" @submit.native.prevent="search">
            <form-item>
                <ui-input v-model.trim="formData.name" placeholder="请输入" :maxlength="30">
                    <span slot="labelPrefix">姓名</span>
                </ui-input>
            </form-item>

            <form-item>
                <ui-input v-model.trim="formData.mobile" placeholder="请输入" :maxlength="30">
                    <span slot="labelPrefix">手机号</span>
                </ui-input>
            </form-item>

            <form-item>
                <button type="submit" class="btn btn-primary">查询</button>
            </form-item>
        </ui-form>

        <!------------------------------ 表格 ------------------------------>
        <ui-table-pro2 ref="table" :data="tableData" highlightCurrentRow @select="onSelect" :class="{'single-selct': !multiple}">
            <ui-table-column label="选择" width="50" type="selection"></ui-table-column>
            <ui-table-column label="BossID" prop="bossId"></ui-table-column>
            <ui-table-column label="姓名" prop="name"></ui-table-column>
            <ui-table-column label="职务" prop="title"></ui-table-column>
            <ui-table-column label="邮箱" prop="resumeEmail"></ui-table-column>
            <ui-table-column label="手机号" prop="mobileStr"></ui-table-column>
            <ui-table-column label="客户名称" prop="customerName"></ui-table-column>

            <data-blank slot="empty" :loading="isLoading" no-data :blankTxt="isSearched && blankTxt || ''" style="height: 300px;min-height: 0;"></data-blank>
        </ui-table-pro2>

        <ui-pager v-if="totalCount > pageSize" show-total textAlign="right" :total="totalCount" :pageSize="pageSize" :current="currentPage" @update:page="onCurrentPageChange" style="padding: 20px 0;"></ui-pager>
    </div>
</template>

<script>
export default {
    props: {
        api: String, // 接口url
        customerId: [String, Number], // 加密的客户id

        // 是否多选
        multiple: {
            type: Boolean,
            default: false
        },

        // 默认选中项
        defaultChecked: {
            type: Array,
            default: () => []
        },

        blankTxt: String
    },
    data() {
        return {
            isLoading: false,
            currentPage: 1, // 当前页,从1开始
            pageSize: 10, // 每页条数
            totalCount: 0,
            tableData: [],

            formData: {
                name: '',
                mobile: ''
            },
            isSearched: false
        };
    },
    methods: {
        search() { // 点击查询
            this.currentPage = 1;
            this.getList();
        },

        onCurrentPageChange(val = 1) { // 页码改变时
            this.currentPage = val;
            this.getList();
        },

        getList() { // 获取列表
            this.totalCount = 0;
            this.tableData = [];
            this.isLoading = true;

            this.$ajax({
                url: this.api,
                params: {
                    ...this.formData,
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    customerId: this.customerId
                }
            }).then(res => {
                this.isSearched = true;
                let data = res.data || {};
                this.tableData = data.bossList || [];
                this.totalCount = data.totalCount || 0;

                // 设置默认选中项
                if (this.tableData.length && this.defaultChecked.length) {
                    this.$nextTick(() => {
                        this.tableData.forEach(i => {
                            this.defaultChecked.includes(i.bossId) && this.$refs.table.toggleRowSelection(i, true);
                        });
                    });
                }
            }).always(() => {
                this.isLoading = false;
            });
        },

        onSelect(list) { // 选择后
            if (!list.length) return;
            if (!this.multiple) { // 单选
                this.$nextTick(() => {
                    this.$refs.table.clearSelection();
                    this.$refs.table.toggleRowSelection(list.pop());
                });
            }
        },

        confirm() { // 确定
            const selection = this.$refs.table.selection;
            if (selection.length) { // 有选择
                this.$emit('change', this.$refs.table.selection);
            } else if (!this.tableData.length) { // 没有选择，且没有可选项
                this.$emit('cancel');
            }
        }
    }
};
</script>

<style lang="less">
    .component-select-boss .single-selct th .checkbox {
        display: none;
    }
</style>