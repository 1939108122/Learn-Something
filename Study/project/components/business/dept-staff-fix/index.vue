<template>
    <div class="dept-staff dept-staff__box">
        <ul :class="ulClass">
            <slot name="otherSearch-prefix"></slot>
            <li class="dept-staff-item" v-show="deptVisible">
                <span class="t" v-if="!$slots.deptLabelPrefix">{{ deptLabel }}</span>
                <tree-box
                    v-model="defaultDeptId"
                    customData
                    :clickLine="clickLine"
                    :encryptDeptIdArr="encryptDeptIdArr"
                    :dataSource="dataSource"
                    @on-finished="$emit('on-finished', $event)"
                    @on-select="refreshDepart"
                    :deptUrl="deptUrl"
                    single
                    size="default"
                    :placeholder="placeholder"
                    :width="width"
                >
                    <span slot="labelPrefix" v-if="$slots.deptLabelPrefix">
                        <slot name="deptLabelPrefix"></slot>
                    </span>
                </tree-box>
            </li>
            <li class="dept-staff-item dept-staff-item-personal" v-show="personVisible">
                <!-- <span class="t" v-if="!$slots.personalLabelPrefix">{{ staffLabel }}</span>
                <ui-select ref="selectPerson" :key="selectKey" @on-query-change="onQueryChange" @on-open-change="onOpenChange" clearable :filterable="filterable" :placeholder="staffPlaceholder" :style="`width:${width}px`">
                    <span slot="labelPrefix" v-if="$slots.personalLabelPrefix">
                        <slot name="personalLabelPrefix"></slot>
                    </span>
                    <List :staffList="staffList" @change-item="changeItem" ref="virtualList"></List>
                </ui-select> -->
                <span class="t" v-if="!$slots.personalLabelPrefix">{{ staffLabel }}</span>
                <ui-popover trigger="click" popper-class="dept-select-personal" ref="deptSelectPersonal" v-model="dropdownVisible" :width="poperWidth">
                    <ui-input
                        slot="reference"
                        v-model="personName"
                        ref="input"
                        :disabled="false"
                        placeholder="请选择"
                        @on-change="changeInput"
                        @on-blur="blur"
                        @click.native="clickInput"
                        @on-clear="clearInput"
                        clearable
                    >
                        <span slot="labelPrefix" v-if="$slots.personalLabelPrefix">
                            <slot name="personalLabelPrefix"></slot>
                        </span>
                        <i class="icrm-side-arrow" :class="{ 'icrm-side-arrow-active': dropdownVisible }" slot="suffix"></i>
                    </ui-input>
                    <div style="padding: 4px 0">
                        <div class="empty-text" v-show="staffList.length === 0">无匹配数据</div>
                        <List v-show="staffList !== 0" :staffList="staffList" @change-item="changeItem" ref="virtualList"></List>
                    </div>
                </ui-popover>
            </li>
            <slot name="otherSearch"></slot>
        </ul>
    </div>
</template>

<script>
import List from './list.vue';
import { throttle } from '@/utils/tools/optimize.js';
export default {
    name: 'dept-staff',
    components: { List },
    props: {
        deptUrl: {
            type: String,
            default: '/dept/sub.json',
        },
        stafftUrl: {
            type: String,
            default: '/dept/user.json',
        },
        hasDefaultDept: {
            type: Boolean,
            default: true,
        },
        deptLabel: {
            type: String,
            default: '部门',
        },
        staffLabel: {
            type: String,
            default: '人员',
        },
        placeholder: {
            type: String,
            default: '请选择部门',
        },
        staffPlaceholder: {
            type: String,
            default: '请选择',
        },
        updateDeptEncryptId: {
            type: String,
            default: '',
        },
        updateStaffId: {
            type: String,
            default: '',
        },
        filterable: {
            type: Boolean,
            default: true,
        },
        encryptDeptIdArr: {
            // 传入选中的部门id（加密），渲染部门名称
            type: Array,
            default: () => [],
        },
        width: [Number, String], // select宽度
        clickLine: {
            // 部门整行可点击选择，不仅仅是点击文案选择
            type: Boolean,
            default: false,
        },
        ulClass: {
            type: String,
            default: '',
        },
        // 部门是否显示
        deptVisible: {
            type: Boolean,
            default: true,
        },
        // 人员是否显示
        personVisible: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            deptId: '', //当前部门 明文id
            deptEncryptId: '', //当前部门 加密id
            defaultDeptId: [],

            dataSource: [], //部门数据源
            selectKey: '',
            // 人员
            staffList: [],
            defaultList: [],
            initPersnId: '',
            personId: '', //人员加密id
            personName: '', // 人员名称
            temporraryName: '',
            fromBlur: false,
            poperWidth: 230,
            dropdownVisible: false,
        };
    },
    watch: {
        deptId(newVal) {
            this.$emit('update:updateDeptId', newVal);
        },
        updateDeptEncryptId: {
            immediate: true,
            handler(val) {
                if (val && val != this.deptEncryptId) {
                    //组件外切换，需要更新视图
                    this.getInitDeptData(this.dataSource, val);
                    this.getPersonList(val).then(() => {
                        // 拿到下拉项后再赋值
                        this.personId = this.updateStaffId;
                    });
                } else {
                    //组件内切换（无需重复渲染视图）
                }
                this.deptEncryptId = val;
                //解决重置后，部门为默认部门
                if (!val && this.dataSource.length) {
                    this.defaultDeptId = [this.dataSource[0].id];
                }
            },
        },
        updateStaffId(val) {
            if (!val) {
                this.personId = val;
            }
        },
        // 处理下拉
        personId(val) {
            if (this.initPersnId == val) {
                return;
            }
            let item = (this.defaultList || []).filter((item) => item.id == val)[0] || {};
            this.changeItem(item);
        },
    },
    methods: {
        clearSingleSelect() {
            // 供外部ref调用
            this.$refs.selectPerson?.clearSingleSelect();
        },
        /* 获取部门数据 初始化可选部门数据*/
        getDeptData() {
            this.$ajax({
                method: 'GET',
                url: this.deptUrl,
            }).then(
                (res) => {
                    if (res.root && res.root.length !== 0) {
                        this.dataSource = res.root;
                        const { id, encryptId } = res.root[0];
                        this.$emit('changeDepartment', res.root[0]);
                        //判断部门是否有默认值
                        if (this.hasDefaultDept) {
                            if (this.deptEncryptId) {
                                this.getInitDeptData(res.root, this.deptEncryptId);
                            } else {
                                this.defaultDeptId = [id];
                                this.deptId = id;
                            }
                            this.$emit('update:updateDeptEncryptId', this.deptEncryptId || encryptId); //清空人员
                        }
                    }
                },
                () => {}
            );
        },
        getInitDeptData(data, id) {
            data.map((item) => {
                if (item.encryptId == id) {
                    this.defaultDeptId = [item.id];
                    this.deptId = item.id;
                } else {
                    if (item.subLevelModelList && item.subLevelModelList.length) {
                        this.getInitDeptData(item.subLevelModelList, id);
                    }
                }
            });
        },
        /* 获取当前所选部门下的人员列表*/
        getPersonList(encryptId, from) {
            return this.$ajax({
                url: this.stafftUrl,
                method: 'GET',
                params: {
                    id: encryptId,
                },
            }).then(({ success, root }) => {
                this.staffList = success && root ? root : [];
                this.defaultList = JSON.parse(JSON.stringify(this.staffList));
            });
        },
        refreshDepart(data) {
            const { id, name, encryptId } = data[0];
            this.defaultDeptId = [id];
            this.deptId = id;
            this.selectKey = Math.random(); // 重新渲染人员select

            this.$emit('update:updateStaffId', ''); //清空人员
            this.$emit('update:updateDeptEncryptId', encryptId); //清空人员
            this.$emit('changeDepartment', data[0]);
        },
        // 虚拟列表
        changeItem(res) {
            this.$emit('update:updateStaffId', res.id || '');
            this.$emit('changePersonal', res || {});

            this.personId = res.id || ''; //人员加密id
            this.initPersnId = res.id || '';
            this.personName = res.name || ''; // 人员名称
            this.temporraryName = res.name || ''; // 记录选中的名字
            this.fromBlur = false;
            this.$refs.deptSelectPersonal?.doClose();
        },
        changeInput(res) {
            // if (this.fromBlur) {
            //     return;
            // }
            this.$refs.deptSelectPersonal?.doShow();
            this.staffList = this.defaultList.filter((item) => {
                return item.name.includes(res.target.value);
            });
        },
        blur() {
            this.fromBlur = true;
            this.personName = this.temporraryName;
        },
        clickInput() {
            this.$refs.input?.$el?.querySelector('input').focus();
        },
        clearInput() {
            this.changeItem({});
        },
    },
    created() {
        this.getDeptData();
        this.changeItem = throttle(this.changeItem, 300);
    },
    mounted() {
        setTimeout(() => {
            this.poperWidth = this.$refs.input?.$el?.querySelector('input').offsetWidth;
        });
    },
};
</script>

<style lang="less" scoped="scoped">
::v-deep {
    .labelPrefix,
    .el-input-range__labelPrefix,
    .label-prefix {
        font-size: 14px;
    }
}

.dept-staff {
    display: inline-block;
    font-size: 0;
    .depart-tree {
        width: 100%;
    }
    .dept-staff-item {
        font-size: 14px;
        display: inline-block;

        &:not(:last-of-type) {
            margin-right: 12px;
        }
        .t {
            display: inline-block;
            padding: 0 5px;
            .t {
                display: inline-block;
            }
            &:nth-of-type(1) {
                padding-left: 0;
            }
        }
    }
    .icrm-side-arrow {
        font-size: 17px;
        color: #8790a2;
        display: inline-block;
        transform: rotateZ(0deg);
        transition-duration: 100ms;
        &-active {
            transform: rotateZ(180deg);
        }
    }
    /deep/.suffix-clear {
        z-index: 2;
    }
}
</style>
<style lang="less">
.dept-select-personal {
    // padding: 4px 0;
    padding: 0;
    &.ui-popper[x-placement^='bottom'] {
        margin-top: 1px;
    }
    .popper__arrow {
        display: none;
    }
    .empty-text {
        padding: 4px 10px;
        font-size: 12px;
        color: #d1d4db;
        text-align: center;
    }
}
</style>
