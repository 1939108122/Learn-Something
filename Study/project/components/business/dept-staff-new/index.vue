<template>
    <div class="dept-staff-new" :class="{ 'is-hovering': selectName && clearable && isHovering }">
        <div
            class="data-place"
            :style="{ 'padding-left': paddingLeftStr }"
            @mouseover="isHovering = true"
            @mouseout="isHovering = false"
            @click.self.stop="toggleTree"
        >
            {{ selectName }}
            <span
                v-if="selectName && clearable"
                class="ui-icon-circle-close"
                @click="clear"
            />
        </div>

        <ui-select2 ref="selectRef" @on-open-change="onOpenChange">
            <span slot="labelPrefix">
                <slot name="labelPrefix"></slot>
            </span>
            <tree-content
                ref="treeContent"
                :staffEncryptId.sync="staffEncryptId"
                :deptEncryptId.sync="deptEncryptId"
                :deptOnly="deptOnly"
                :treeData="treeData"
                @update-item="updateItem"
                @on-select="onSelect"
            />
        </ui-select2>
    </div>
</template>

<script>
import TreeContent from './tree-content.vue';

export default {
    name: 'DeptStaffNew',
    components: { TreeContent },
    props: {
        // 销售加密id
        staffEncryptId: {
            type: String,
            default: ''
        },
        // 部门加密id
        deptEncryptId: {
            type: String,
            default: ''
        },
        clearable: {
            type: Boolean,
            default: false
        },
        // 是否展示离职人员
        isShowLeave: {
            type: Boolean,
            default: false
        },
        // 只有部门
        deptOnly: {
            type: Number,
            default: 0 // 0 默认全部  1 只取部门
        },
        // 请求接口 url
        fetchUrl: {
            type: String,
            default: '/dept/subWithUser.json',
        },
        // 请求参数
        fetchParams: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            selectName: '',
            treeData: [],
            paddingLeftStr: '60px',
            isHovering: false,
        };
    },
    mounted() {
        this.getDeptStaff();
        if (this.$slots.labelPrefix) {
            this.$nextTick(() => {
                let offsetWidth = this.$slots.labelPrefix[0]?.elm?.offsetWidth || 0;
                this.paddingLeftStr = offsetWidth + 23 + 'px';
            });
        }
    },
    methods: {
        updateItem(item) {
            this.selectName = item.title;

            if (item.classCode === -1) {
                // 选中的是人员
                this.$emit('update:staffEncryptId', item.encryptId);
                this.$emit('update:deptEncryptId', item.encryptParentId);
            } else {
                this.$emit('update:staffEncryptId', '');
                this.$emit('update:deptEncryptId', item.encryptId);
            }

            this.$emit('change', item);
        },
        onSelect(item, resetFlag = false) {
            if (!resetFlag) {
                this.$nextTick(() => {
                    this.toggleTree();
                });
            }
            this.updateItem(item);
        },
        getDeptStaff() {
            this.$ajax({
                url: this.fetchUrl,
                params: {
                    ...this.fetchParams,
                    leaveAuth: this.isShowLeave ? 1 : 0,
                    deptOnly: this.deptOnly
                },
            }).then(({ success, root }) => {
                if (success) {
                    this.treeData = root || [];
                }
            });
        },
        toggleTree() {
            this.$refs?.selectRef?.$el.querySelector('input')?.click();
        },
        reset() {
            this.$refs.treeContent?.$refs.virtualTree?.reset();
        },
        clear() {
            this.$refs.treeContent?.$refs.virtualTree?.clear();
        },
        // 清空搜索
        clearSearch() {
            this.$refs.treeContent?.$refs.virtualTree?.clearSearch();
        },
        // 聚焦搜索框
        focusInput() {
            this.$refs.treeContent?.$refs.virtualTree?.$refs.searchInput?.focus();
        },
        onOpenChange() {
            setTimeout(() => {
                this.clearSearch();
                this.focusInput();
            }, 100);
        }
    }
};
</script>

<style lang="less">
.dept-staff-new {
    position: relative;
    cursor: pointer;
    &.is-hovering {
        .ui-select  {
            .ui-icon-arrow-down {
                display: none;
            }
        }
    }
    .data-place {
        position: absolute;
        left: 1px;
        right: 1px;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        z-index: 1;
        background-color: #FFF;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;

        &>.ui-icon-circle-close {
            display: none;
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            color: #9fa6b5;
            z-index: 99;
            cursor: pointer;
            &::before {
                background-color: #FFF;
            }
            &:hover {
                color: #757D8C;
                transition: all .3s;
                &::before {
                    box-shadow: 0 0 0 3px #e4e8f0;
                    background-color: #e4e8f0;
                    border-radius: 2px;
                }
            }
        }
        &:hover {
            &>.ui-icon-circle-close {
                display: block;
            }
        }
    }
    &:hover {
        .ui-select {
            .ui-select-selection {
                border-color: #2CD7C8;
            }
        }
    }
    .ui-select {
        .ui-select-dropdown {
            padding: 0;
            max-height: 300px;
            &::-webkit-scrollbar-track-piece {
                background-color: transparent;
            }
            .input-wrap {
                cursor: pointer;
                input {
                    padding-top: 7px;
                    padding-bottom: 7px;
                    height: 32px !important;
                }
            }
        }
        .ui-icon-arrow-down {
            z-index: 2;
        }
    }
}
.dept-staff-popper-class {
    padding: 0;
    margin-top: 4px!important;
    .popper__arrow {
        display: none;
    }
}
</style>