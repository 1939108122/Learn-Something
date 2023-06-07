<template>
    <div class="dept-staff dept-staff__box">
        <ul>
            <li class="dept-staff-item" v-show="deptVisible">
                <span class="t" v-if="!$slots.deptLabelPrefix">{{ deptLabel }}</span>
                <tree-box v-model="defaultDeptId" customData :clickLine="clickLine" :encryptDeptIdArr="encryptDeptIdArr" :dataSource="dataSource" @on-finished="$emit('on-finished', $event)" @on-select="refreshDepart" :deptUrl="deptUrl" single size="default" :placeholder="placeholder" :width="width">
                    <span slot="labelPrefix" v-if="$slots.deptLabelPrefix">
                        <slot name="deptLabelPrefix"></slot>
                    </span>
                </tree-box>
            </li>
            <li class="dept-staff-item" v-show="personVisible">
                <span class="t" v-if="!$slots.personalLabelPrefix">{{ staffLabel }}</span>
                <ui-select ref="selectPerson" v-model="personId" :clearable="!disabled" :filterable="filterable" :placeholder="staffPlaceholder" @on-clear="selectStaff" :style="`width:${width}px`" :disabled="disabled">
                    <span slot="labelPrefix" v-if="$slots.personalLabelPrefix">
                        <slot name="personalLabelPrefix"></slot>
                    </span>
                    <ui-option v-for="(item,index) in staffList" :value="item.id" :key="index + item.id" @click.native="selectStaff(item)">{{ item.name }}</ui-option>
                </ui-select>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'dept-staff',
    props: {
        deptUrl: {
            type: String,
            default: '/dept/sub.json'
        },
        stafftUrl: {
            type: String,
            default: '/dept/user.json'
        },
        hasDefaultDept: {
            type: Boolean,
            default: true
        },
        deptLabel: {
            type: String,
            default: '部门'
        },
        staffLabel: {
            type: String,
            default: '人员',
        },
        placeholder: {
            type: String,
            default: '请选择部门'
        },
        staffPlaceholder: {
            type: String,
            default: '请选择'
        },
        updateDeptEncryptId: {
            type: String,
            default: ''
        },
        updateStaffId: {
            type: String,
            default: ''
        },
        filterable: {
            type: Boolean,
            default: true
        },
        encryptDeptIdArr: {
            // 传入选中的部门id（加密），渲染部门名称
            type: Array,
            default: () => ([])
        },
        width: [Number, String], // select宽度
        clickLine: {
            // 部门整行可点击选择，不仅仅是点击文案选择
            type: Boolean,
            default: false
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
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            personId: '', //人员加密id
            deptId: '', //当前部门 明文id
            deptEncryptId: '', //当前部门 加密id
            defaultDeptId: [],
            staffList: [],
            dataSource: [] //部门数据源
        };
    },
    watch: {
        deptId (newVal) {
            this.$emit('update:updateDeptId', newVal);
        },
        updateDeptEncryptId: {
            immediate: true,
            handler (val) {
                if(val && val != this.deptEncryptId) {
                    //组件外切换，需要更新视图
                    this.getInitDeptData(this.dataSource, val);
                    this.getPersonList(val);
                }
                this.deptEncryptId = val;
                //解决重置后，部门为默认部门
                if(!val && this.dataSource.length){
                    this.defaultDeptId = [this.dataSource[0].id];
                }
            }
        },
        updateStaffId: {
            handler(val) {
                this.$refs.selectPerson && this.$refs.selectPerson.setQuery(null); // fix：ui组件filterable问题（导致无法回显）
                this.$nextTick(() => {
                    this.personId = this.updateStaffId;
                });
            },
            immediate: true
        }
    },
    methods: {
        clearSingleSelect () { // 供外部ref调用
            this.$refs.selectPerson.clearSingleSelect();
        },
        /* 获取部门数据 初始化可选部门数据*/
        getDeptData () {
            this.$ajax({
                method: 'GET',
                url: this.deptUrl,
            }).then((res) => {
                if (res.root && res.root.length !== 0) {
                    this.dataSource = res.root;
                    const {id, encryptId} = res.root[0];
                    this.$emit('changeDepartment', res.root[0]);
                    //判断部门是否有默认值
                    if(this.hasDefaultDept) {
                        if(this.deptEncryptId) {
                            this.getInitDeptData(res.root, this.deptEncryptId);
                        } else {
                            this.defaultDeptId = [id];
                            this.deptId = id;
                        };
                        this.$emit('update:updateDeptEncryptId', this.deptEncryptId || encryptId); //清空人员
                    }
                };
            }, ()=>{});
        },
        getInitDeptData (data, id) {
            data.map((item) => {
                if(item.encryptId == id) {
                    this.defaultDeptId = [item.id];
                    this.deptId = item.id;
                } else {
                    if(item.subLevelModelList && item.subLevelModelList.length) {
                        this.getInitDeptData(item.subLevelModelList, id);
                    };
                };
            });
        },
        /* 获取当前所选部门下的人员列表*/
        getPersonList (encryptId, from) {
            return this.$ajax({
                url: this.stafftUrl,
                method: 'GET',
                params: {
                    id: encryptId
                },
            }).then(({success, root}) => {
                this.staffList = success && root ? root : [];
            });
        },
        refreshDepart (data) {
            const {id, name, encryptId} = data[0];
            this.defaultDeptId = [id];
            this.deptId = id;

            this.$emit('update:updateStaffId', ''); //清空人员
            this.$emit('update:updateDeptEncryptId', encryptId); //清空人员
            this.$emit('changeDepartment', data[0]);
        },
        selectStaff(item = {}) {
            this.$emit('update:updateStaffId', item.id);
            this.$emit('changePersonal', item);
        }
    },
    created () {
        this.getDeptData();
    }
};
</script>

<style lang="less" scoped="scoped">
.dept-staff {
    display: inline-block;
    font-size: 0;

    .dept-staff-item {
        font-size: 14px;
        display: inline-block;

        &:not(:last-of-type) {
            margin-right: 15px;
        }
        .t {
            display: inline-block;
            padding: 0 5px;
            .t {
                display: inline-block;
            }
            &:nth-of-type(1){
                padding-left: 0;
            }
        }
    }
}
</style>
