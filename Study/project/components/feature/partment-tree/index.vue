<template>
    <li class="tree-item">
        <div v-if="!hiddenDepartList.includes(treeData[filed])" @click="doSelect(treeData)" class="root-item" :class="{'ui-depart-tree-item-selected': isSelected(treeData) && single, 'root-item-hover': clickLine}">
            <div class="tree-node-expand-icon">
                <i :class="{'icrm-triangle not-expand': !expandChild,'icrm-triangle':expandChild,
                 'none': !treeData.subLevelModelList || treeData.subLevelModelList.length === 0}"
                @click.stop="toggle"></i>
            </div>
            
            <div class="item-content">
                <template v-if="single">
                    <span @click="select(treeData)">{{ treeData.name }}</span>
                </template>
                <ui-checkbox v-else v-model="treeData.checked" :disabled="disabled"
                    @on-change="check(treeData)">{{ treeData.name }}</ui-checkbox>
                <span v-if="treeData.count">({{treeData.count}}人)</span>
            </div>
        </div>
        <ul v-if="treeData.subLevelModelList && treeData.subLevelModelList.length" v-show="expandChild">
            <partment-tree v-for="(item, index) in treeData.subLevelModelList" :disabled="disabled"
            :single="single" :key="index" :tree-data="item" :onlyLeaf="onlyLeaf" :clickLine="clickLine"
            @update:check="handleAllCheck" @update:select="select" :checkedIdArr="checkedIdArr" @emitExpand="emitExpand"></partment-tree>
        </ul>
    </li>
</template>

<script type="text/javascript">

export default {
    name: 'partment-tree',
    props: {
        treeData: {
            type: Object,
            default: () => ({})
        },
        single: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        hiddenDepartList: {
            type: Array,
            default: () => ([])
        },
        checkedIdArr: {
            type: Array,
            default: ()=>([])
        },
        onlyLeaf: {
            type: Boolean,
            default: false
        },
        clickLine: {
            // 部门整行可点击选择，不仅仅是点击文案选择
            type: Boolean,
            default: false
        },
        filed: {
            type: String,
            default: 'id',
        },
    },
    watch: {
        checkedIdArr: {
            handler(val){
                if(val){
                    if(this.onlyLeaf){
                        if(val.includes(this.treeData.name)){
                            this.$emit('emitExpand');
                        }
                    }else{
                        if(val.includes(this.treeData[this.filed])){
                            this.$emit('emitExpand');
                        }
                    }
                }
            },
            deep: true,
            immediate: true
        },
        treeData: {
            handler(val){
                if(val && val.checked){
                    this.$emit('emitExpand');
                }
            },
            deep: true,
            immediate: true
        }
    },
    data () {
        return {
            expandChild: false
        };
    },
    methods: {
        emitExpand(){
            this.expandChild = true;
            this.$emit('emitExpand');
        },
        isSelected(params){
            return this.checkedIdArr.includes(params[this.filed]);
        },
        toggle(e) {
            if(this.disabled) {
                return;
            }

            this.$emit('expand');

            this.expandChild = !this.expandChild;
            // let cls = e.target.parentNode.parentNode.classList;
            // if(cls.contains('expand')){
            //     cls.remove('expand');
            //     this.expandChild = false;
            // }else {
            //     cls.add('expand');
            //     this.expandChild = true;
            // }
        },
        doSelect(item) {
            if(this.clickLine) this.select(item);
        },
        select (item) {
            this.$emit('update:select', item);
        },
        check (item) {
            if(item.checked && item.subLevelModelList && item.subLevelModelList.length > 0){
                this.checkChild(item.subLevelModelList);
            }else if(!item.checked && item.subLevelModelList && item.subLevelModelList.length > 0){
                this.clearChild(item.subLevelModelList);
            }
            this.$emit('update:check');
        },
        checkChild(data){
            data.forEach( item => {
                // item.checked = true;
                this.$set(item, 'checked', true);
                if(item.subLevelModelList){
                    this.checkChild(item.subLevelModelList);
                }
            });
        },
        clearChild(data){
            data.forEach( item => {
                // item.checked = false;
                this.$set(item, 'checked', false);
                if(item.subLevelModelList){
                    this.clearChild(item.subLevelModelList);
                }
            });
        },
        handleAllCheck () {
            let allChecked = this.treeData.subLevelModelList.every(item => item.checked);
            // this.treeData.checked = allChecked;
            this.$set(this.treeData, 'checked', allChecked);
            this.$emit('update:check');

        }
    }
};
</script>
<style lang="less" scoped>
    .tree-item.tree-item__box {
        min-width: fit-content;
        padding: 0 10px;
        margin-bottom: 0;

        .root-item {
            line-height: 33px;
            margin-bottom: 0;
            
    }
        
    }
</style>
<style lang="less">
    .tree-item {
        padding: 0 0 0 10px;
        margin-bottom: 3px;
        line-height: 30px;
        color: #9fa3b0;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        .root-item{
            padding-left: 5px;
            margin-bottom: 3px;
            .tree-node-expand-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                .icrm-triangle {
                    &.not-expand {
                        transform: rotate(-90deg);
                    }
                }
        }
        }
        .root-item-hover {
            &:hover {
                background-color: #eceef1;
                border-radius: 5px;
            }
        }
        label {
            line-height: 30px;
        }
        &>ul {
            display: block;
        }
        &.expand>ul {
            display: block;
        }
        .ui-icon-plus,.ui-icon-minus {
            display:inline-block;
            border:1px solid #b0b4be;
            font-size: 12px;
            &.none {
                visibility: hidden;
            }
        }
        .item-content {
            display: inline-block;
            vertical-align: bottom;
            padding: 0 10px;
        }
    }
    .ui-depart-tree-item-selected{
        background: #eceef1;
        border-radius: 5px;
    }
</style>
