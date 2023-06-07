<template>
    <div class="depart-tree">
        <div :class="['data-place', {'data-place-disabled': isDisabled}]" :style="{'padding-left': paddingLeftStr}" v-if="checkedStr" @click.self.stop="toggleTree">{{ checkedStr }}</div>
        <ui-select2 :placeholder="placeholder" ref="tree" :size="size" :disabled="isDisabled" :style="`width:${width}px`" :transfer="transfer" :placement="placement">
            <span slot="labelPrefix" v-if="$slots.labelPrefix">
                <slot name="labelPrefix"></slot>
            </span>
            <partment-tree v-for="(item, index) in rootData" :key="index" :clickLine="clickLine" :tree-data="item" :single="single"
            @update:check="handleCheck" @update:select="handleSelect" @expand="expand" :hiddenDepartList="hiddenDepartList"
            :checkedIdArr="checkedIdArr" :onlyLeaf="onlyLeaf" :filed="filed"
            ></partment-tree>
        </ui-select2>
    </div>
</template>

<script type="text/javascript">
import partmentTree from './index';
export default {
    name: 'tree-box',
    props:{
        isDisabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default: () => ([])
        },
        single: {
            type: Boolean,
            default: false
        },
        deptUrl: {
            type: String,
            default: '/dept/sub.json'
        },
        customData: {
            type: Boolean,
            default: false
        },
        onlyLeaf: {
            type: Boolean,
            default: false
        },
        dataSource: {
            type: Array,
            default: () => ([])
        },
        separator: {
            type: String,
            default: ','
        },
        placeholder: {
            type: String,
            default: '请选择部门'
        },
        size: {
            type: String,
            default: 'small'
        },
        hiddenDepartList: { // 隐藏部分部门
            type: Array,
            default: () => ([])
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
        transfer: {
            type: Boolean,
            default: false
        },
        placement: {
            type: String,
            default: 'bottom'
        },
        // 字段拼写错误
        filed: { // value 值要获取哪个字段， id，encryptId ..
            type: String,
            default: 'id',
        },
    },
    components: {
        partmentTree
    },
    computed: {
        checkedIdArr () {
            return this.checkedArr.map(item => item[this.filed]);
        }
    },
    watch: {
        value: {
            handler (newval) {
                this.checkedArr = [];
                if (newval.length){
                    // 初始化无默认值没有必要去做选中
                    this.rootData = JSON.parse(JSON.stringify(this.tempRootData));
                    this.refreshView();
                }
            },
            immediate: true,
        },
        //异步dataSource 渲染视图
        dataSource (newval) {
            this.init();
            this.checkedArr = [];
            this.refreshView();
        },
        encryptDeptIdArr: {
            handler (nVal) {
                if (nVal.length) {
                    this.checkedStr = '';
                    this.reView();
                }
            },
            immediate: true,
            deep: true
        }
    },
    data () {
        return {
            tempRootData: [],
            rootData: [],
            checkedArr: [],
            checkedStr: '',
            paddingLeftStr: '10px'
        };
    },
    created () {
        this.init();
    },
    mounted () {
        if (this.$slots.labelPrefix) {
            this.$nextTick(() => {
                let offsetWidth = this.$slots.labelPrefix[0].elm.offsetWidth;
                this.paddingLeftStr = (offsetWidth | 0) + 23 + 'px';
            });
        }
    },
    methods: {
        async init () {
            this.tempRootData = this.customData
                ? this.dataSource
                : await this.getTteeData();
            this.rootData = JSON.parse(JSON.stringify(this.tempRootData));

            this.$emit('on-finished', this.rootData);
            // 需要保证数据已经拿到，才能保证出初始化选项成功
            this.refreshView();
            this.reView();
        },
        async getTteeData () {
            let res = await this.$ajax({
                method: 'GET',
                url: this.deptUrl,
            });
            let result = res.root || [];
            // 改到123行
            // this.$emit('on-finished', result);
            return result;
        },
        refreshView () {
            this.handDataChecked(this.rootData);
            this.handChecked(this.rootData);
            if(this.single){
                this.checkedStr = this.checkedArr.length > 0
                    ? this.checkedArr[0].name : '';
            }else {
                this.checkedStr = this.onlyLeaf
                    ? this.checkedArr.filter(item => item.leaf).map(item => item.name).join(this.separator)
                    : this.checkedArr.map(item => item.name).join(this.separator);
            }
        },
        reView() {
            let fn = (db) => {
                for (let item of db) {
                    if (this.encryptDeptIdArr.includes(String(item.encryptId))) {
                        item.checked = true;
                        this.checkedStr += this.checkedStr ? `,${item.name}` : item.name;
                    }
                    if (item.subLevelModelList && item.subLevelModelList.length) {
                        fn(item.subLevelModelList);
                    }
                }
            };
            fn(this.rootData);
        },
        handDataChecked (data) {
            data.forEach( item => {
                this.$set(item, 'checked', item.checked || this.value.indexOf(item[this.filed]) > -1);
                this.$set(item, 'leaf', !item.subLevelModelList || item.subLevelModelList.length === 0);
                if(item.subLevelModelList && item.subLevelModelList.length > 0){
                    if(!this.single && item.checked){
                        this.checkedChildren(item.subLevelModelList);
                    }else{
                        this.handDataChecked(item.subLevelModelList);
                    }
                }
            });
        },
        checkedChildren (data) {
            data.forEach(item => {
                this.$set(item, 'checked', true);
                this.$set(item, 'leaf', !item.subLevelModelList || item.subLevelModelList.length === 0);
                if(item.subLevelModelList && item.subLevelModelList.length > 0){
                    this.checkedChildren(item.subLevelModelList);
                }
            });
        },
        handChecked (data) {
            data.forEach( item =>{
                let idx = this.checkedArr.findIndex(cell => cell[this.filed] === item[this.filed]);
                // 选中状态并且之前未被记录过
                if(item.checked && idx === -1){
                    this.checkedArr.push(item);
                }
                if(!item.checked && idx > -1){
                    this.checkedArr.splice(idx, 1);
                }
                if(item.subLevelModelList && item.subLevelModelList.length > 0){
                    this.handChecked(item.subLevelModelList);
                }
            });
        },
        handleCheck () {
            let checkedIdArr = [];
            let checkedArr = [];
            this.handChecked(this.rootData);

            this.checkedStr = this.checkedArr.map(item => item.name).join(this.separator);
            if(this.onlyLeaf){
                checkedArr = this.checkedArr.filter(item => item.leaf);
                checkedIdArr = checkedArr.map(item => item[this.filed]);
                this.checkedStr = checkedArr.map(item => item.name).join(this.separator);
            }
            this.$emit('input', this.onlyLeaf ? checkedIdArr : this.checkedIdArr);
            this.$emit('on-select', this.onlyLeaf ? checkedArr : this.checkedArr);
        },
        handleSelect (data) {
            if(data){
                this.checkedArr.splice(0, 1, data);
            }
            if(this.checkedArr.length) {
                const res = this.checkedArr[0];
                this.checkedStr = res.name;
                this.$emit('input', [res[this.filed]]);
                this.$refs.tree.visible = false;
                this.$emit('on-select', [res]);
            }
        },
        toggleTree () {
            this.$refs.tree.$el.querySelector('input').click();
        },
        expand() {
            if (this.$refs.tree.broadcast) {
                this.$refs.tree.broadcast('Dropdown', 'on-update-popper');
            }
        }
    }
};
</script>

<style lang="less">
    .depart-tree {
        display: inline-block;
        position: relative;
        .ui-select-label-prefix{
            .ui-select-selection{
               height: 32px !important;
            }
        }
        .data-place {
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
            position: absolute;
            background-color: #fff;
            z-index: 1;
            left: 1px;
            right: 30px;
            top: 50%;
            /*height: 84%;*/
            transform: translate3d(0, -50%, 0);
            line-height: 1.5;
            &.data-place-disabled {
                background-color: #f7f7f7;
            }
        }
        div.ui-select {
            margin: 0;
            .ui-select-selection {
                height: 32px;
            }
            &.ui-select-small .ui-select-selection {
                height: 26px;
            }
            .ui-select-dropdown {
                max-height: 300px;
                /*.ui-dropdown-list li{*/
                    /*line-height: 30px;*/
                    /*color: #9fa3b0;*/
                    /*white-space: nowrap;*/
                    /*text-overflow: ellipsis;*/
                    /*cursor: pointer;*/
                    /*label {*/
                        /*line-height: 30px;*/
                    /*}*/
                /*}*/
            }
            // .ui-select-placeholder {
            //     color: #d7d8de;
            // }
        }
    }
</style>
