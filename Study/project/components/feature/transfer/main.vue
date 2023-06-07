<template>
    <div class="ui-transfer">
       <ui-transfer-panel class="left-transfer-panel"
            v-bind="$attrs"  
            :data="sourceData" v-model="checkedData"
            :props="props" :title="titles[0]" :theads="leftHeads"
            :deletable="false">
            <slot name="left-header-right" slot="header-right"></slot>
            <slot name="blank" slot="blank"></slot>
            <slot name="left-footer"></slot>
        </ui-transfer-panel>
       <div class="ui-transfer_buttons" v-if="showSeprator">
           <div class="btns-group">
                <span class="ui-icon ti-arrows-horizontal"></span>
           </div>
       </div>
       <ui-transfer-panel
            v-bind="$attrs"  
            :data="targetData" v-model="checkedData"
            :props="props" :title="titles[1]" :theads="righttHeads" 
            :selectable="false" :showtCheckAll="false">
            <slot name="right-header-right" slot="header-right"></slot>
            <slot name="blank" slot="blank"></slot>
            <slot name="right-footer"></slot>
        </ui-transfer-panel>  
    </div>
</template>
<script>
import uiTransferPanel from './transfer-panel';
export default {
    name: 'ui-transfer',
    inheritAttrs: false,
    components: { uiTransferPanel },
    props: {
        titles: {
            type: Array,
            default: () => ([])
        },
        data: {
            type: Array,
            default: () => ([])
        },
        value: {
            type: Array,
            default: () => ([])
        },
        leftHeads:{
            type: Array,
            default: () => ([])
        },
        righttHeads:{
            type: Array,
            default: () => ([])
        },
        props: {
            type: Object,
            default: () => ({
                key: 'value',
                name: 'name',
                disabled: 'disabled'
            })
        },
        immediate: {
            type:Boolean,
            default: true
        },
        showSeprator: Boolean
    },
    watch: {
        checkedData (nv, ov) {
            this.initViewData();
            this.immediate && (this.$emit('input', nv));
        },
        value: {
            immediate: true,
            deep: true,
            handler (nv) {
                this.initViewData();
            }
        },
        data: {
            immediate: true,
            deep: true,
            handler () {
                this.initViewData();
            }
        }
    },
    data () {
        return {
            sourceData: [],
            targetData: [],
            checkedData: JSON.parse(JSON.stringify(this.value))
        };
    },
    methods: {
        initViewData () {
            const { key } = this.props;
            const data = JSON.parse(JSON.stringify(this.data));
            this.sourceData = JSON.parse(JSON.stringify(this.data));
            this.targetData = data.filter(item => this.checkedData.indexOf(item[key].toString()) > -1);
        },
        getChecked () {
            return this.targetData;
        }
    }
};
</script>
<style lang="less">
.ui-transfer {
    display: flex;
    border-bottom:1px solid #ddd;
    .ui-transfer_buttons {
        position: relative;
        width: 100px;
        text-align: center;
        .btns-group {
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate3d(-50%, -50%, 0);
            .ui-icon {
                font-size: 30px;
                cursor: pointer;
                font-weight: bold;
                &:hover { color: #53cac3; }
            }
        }
    }
    .ui-transfer-panel {
        .ui-transfer-panel_head {
            border-bottom: 1px solid #ddd;
        }
        .ui-transfer-panel_content {
            border: none;
        }
        &.left-transfer-panel .ui-transfer-panel_content{ border-right: 1px solid #ddd;}
    }
}
</style>