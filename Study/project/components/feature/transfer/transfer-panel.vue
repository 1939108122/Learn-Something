<template>
    <div class="ui-transfer-panel">
        <div class="ui-transfer-panel_head" v-if="showHead">
            <span>{{ title }}</span><span>(共<span class="text-primary"> {{ data.length }} </span>个)</span>
            <div class="ui-transfer-panel_head--right">
                <slot name="header-right"></slot>
            </div>
        </div>
        <div class="ui-transfer-panel_content">
            <div class="ui-transfer-panel_content--filter" v-if="filterable">
                <ui-input v-model.trim="query" :placeholder="placeholder" clearable></ui-input>
            </div>
            <ui-table fixedHeader maxHeight="270">
                <thead slot="header" v-if="showtHead">
                    <tr>
                        <th width="30" v-if="selectable">
                            <ui-checkbox v-model="checkAll" @on-change="handleCheckAll" v-if="showtCheckAll"></ui-checkbox>
                        </th>
                        <th v-for="(thr,idx) in theads" :key="idx">{{ thr.name }}</th>
                        <th width="30" v-if="deletable"></th>
                    </tr>
                </thead>
                <tbody slot="body">
                    <template v-for="(item, idx) in filterData">
                        <tr :key="idx" class="transfer-item">
                            <td width="30" v-if="selectable">
                                <ui-checkbox v-model="item.checked" label="" @on-change="changeItem(item)"></ui-checkbox>
                            </td>
                            <td v-for="(tds,idx) in theads" :key="idx" v-html="item[`${tds.key}-filter`]"></td>
                            <td width="30" v-if="deletable">
                                <i class="ui-icon ui-icon-close" @click="deleteItem(item)"></i>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </ui-table>
            <data-blank v-if="filterData.length === 0" :no-data="filterData.length === 0">
                <slot v-if="query.length>0" name="blank" slot="no-data"></slot>
            </data-blank>
        </div>
        <div class="ui-transfer-panel_footer">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ui-transfer-panel',
    componentName: 'uiTransferPanel',
    props: {
        title: String,
        placeholder: String,
        filterable: {
            type:Boolean,
            default: true
        },
        selectable: {
            type:Boolean,
            default: true
        },
        deletable: {
            type:Boolean,
            default: true
        },
        showtHead: {
            type:Boolean,
            default: true
        },
        showtCheckAll: {
            type:Boolean,
            default: true
        },
        immediate: {
            type:Boolean,
            default: true
        },
        data: {
            type: Array,
            default: () => ([])
        },
        value: {
            type: Array,
            default: () => ([])
        },
        theads: {
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
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            checkAll: false,
            query: '',
            viewData: [],
            filterData: []
        };
    },
    watch: {
        query: {
            immediate: true,
            handler (nv, ov) {
                this.computeFilteData();
            }
        },
        viewData: {
            immediate: true,
            handler (nv, ov) {
                this.computeFilteData();
            }
        },
        data: {
            immediate: true,
            deep: true,
            handler (nv, ov) {
                this.initViewData();
            }
        },
        filterData:{
            immediate: true,
            deep: true,
            handler (nv, ov) {
                this.checkAll = nv.length >0 && nv.length === nv.filter(item => item.checked).length;
            }
        }
    },
    created () {
        this.initViewData();
    },
    methods: {
        initViewData () {
            const { key } = this.props;
            const data = JSON.parse(JSON.stringify(this.data));
            this.viewData = data.map(item => {
                item[key] += '';
                this.$set(item, 'checked', this.value.indexOf(item[key]) > -1 || this.value.indexOf(item[key]*1) > -1 );
                return item;
            });
        },
        deleteItem (row) {
            const { key } = this.props;
            const idx = this.viewData.findIndex(item => item[key] === row[key]);
            this.viewData.splice(idx, 1);
            this.updateValue();
        },
        changeItem (row) {
            const { key } = this.props;
            this.viewData.forEach(item => {
                if(item[key] === row[key]){
                    item.checked = row.checked;
                }
            });
            this.updateValue();
        },
        handleCheckAll (status) {
            const { key } = this.props;
            this.filterData.forEach(item => {
                this.$set(item, 'checked', status);
            });
            this.viewData.forEach(item => {
                const idx = this.filterData.findIndex(row => row[key] === item[key]);
                if(idx > -1){
                    item.checked = status;
                }
            });

            this.updateValue();
        },
        getChecked () {
            const { key } = this.props;
            const checkedData = this.viewData.filter(item => item.checked);
            const curChecked = checkedData.map(item => item[key]);
            return {
                curChecked,
                checkedData
            };
        },
        updateValue () {
            const { curChecked, checkedData } = this.getChecked();
            if(this.immediate){
                this.$emit('input', curChecked);
            }
            this.$emit('on-change', checkedData);
        },
        /** 计算视图数据 */
        computeFilteData () {
            const { key, name } = this.props;
            const curVal = JSON.parse(JSON.stringify(this.viewData));
            this.filterData = curVal.filter(item => item[key].indexOf(this.query) > -1 || item[name].indexOf(this.query) > -1)
                .map(item => {
                    this.$set(item, `${name}-filter`, item[name]);
                    this.$set(item, `${key}-filter`, item[key]);
                    if(this.query){
                        var rule = new RegExp(this.query, 'g');
                        this.$set(item, `${name}-filter`, item[name].replace(rule, `<span class="text-danger">${this.query}</span>`));
                        this.$set(item, `${key}-filter`, item[key].replace(rule, `<span class="text-danger">${this.query}</span>`));
                    }
                    return item;
                });
        }
    }
};
</script>
<style lang="less">
.ui-transfer-panel {
    flex: 1;
    .ui-transfer-panel_head {
        overflow: hidden;
        line-height: 30px;
        .ui-transfer-panel_head--right {
            float: right;
            margin-right: 20px;
        }
    }
    .ui-transfer-panel_content {
        height: 348px;
        .ui-transfer-panel_content--filter {
            text-align: center;
            padding-top: 10px;
            .input-wrap {
                min-width: unset;
                display: inline-block;
                width: 90%;
                .input {
                    box-shadow: unset;
                    border-radius: 5px;
                }
            }
        }
        .ui-table {
            margin-top: 0px;
            .table-header {
                width: auto!important;
                background-color: unset;
                th {
                    line-height: 1;
                    color: #DADADA;
                    background-color: unset;
                }
            }
            .table-body {
                td { border: none; }
            }
            .ui-icon:hover{
                cursor: pointer;
                color: #53cac3;
            }
            .ui-icon-close { opacity: 0;}
            .transfer-item:hover .ui-icon-close { opacity: 1; }
        }
        .data-tips {
            height: 270px;
            min-height: unset;
            .data-blank {
                width: unset;
            }
        }
    }
}
</style>
