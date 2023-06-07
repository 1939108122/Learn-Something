<template>
    <div class="dialog-add-product"  v-if="productListAll.length" :class="{'is-single-product-select':single}">
        <ui-dialog v-model="selectDialog"
            preventLayer
            wrapClass="modify-production-select-dialog"
            :showFooter="false"
            :title="title"
            @on-close="hideddProductDialog">
            <div class="add-product-box" slot="content">
                <!-- <div class="dialog-header">{{title}}</div> -->
                <div class="dialog-box">
                    <div class="search-name">
                        <ui-select v-model="searchServiceId"
                                clearable filterable
                                placeholder="搜索产品"
                                @on-change="onChangeSearch">
                            <ui-option v-for="item in productListAll"
                                    :value="item.encryptId"
                                    :key="item.encryptId"
                                    v-show="innerTab.includes(item.itemType)">{{item.itemName}}</ui-option>
                        </ui-select>
                    </div>
                    <div class="dialog-con">
                        <div class="inner">
                            <!-- <h4>可选产品列表</h4> -->
                            <ul class="tab-box">
                                <li v-for="(item, idx) in productlist"
                                    :key="idx"
                                    :class="idx == activeTab ? 'active' : ''"
                                    @click="switchTab(item,idx)" v-show="innerTab.includes(item[0].itemType)">
                                    {{item[0].itemTypeStr}}
                                </li>
                            </ul>
                            <div v-for="(item, idx) in productlist" :key="idx" v-show="activeTab==idx" class="tab-list-con">
                                <!-- <ui-checkbox v-model="item.ischeckall" @on-change="checkAll(item.ischeckall,idx)"
                                            v-if="!single">
                                    全部
                                </ui-checkbox> -->
                                <!-- {{needFilterCanNotDiscount}} - {{notDiscountType.includes(+val.itemType)}} - {{val.discountType != 1}} -->
                                <template>
                                    <!-- // discountType 1、允许打折 0、不允许打折 -->
                                    <ui-checkbox v-for="(val, index) in item"
                                        prop="auto"
                                        v-model="val.checked"
                                        :key="index"
                                        :disabled="discountItem(val)"
                                        :class="['option-checkbox',{'active':val.activeShow}]"
                                        @on-change="changeCheckbox(val)">
                                        {{val.itemName}}
                                    </ui-checkbox>
                                </template>
                            </div>
                        </div>
                        <div class="inner">
                            <h4>
                                已选（{{checkedlist.length}}）
                                <span class="clear-all icrm-delete-trash" @click="clearAll()" v-if="needClear">
                                清空全部
                                </span>
                            </h4>
                            <div class="selected-list">
                                <span v-for="(item,idx) in checkedlist" :key="idx">
                                    {{item.itemName}}
                                    <i class="icrm-icon-clean" @click="delectItem(idx,item)" v-if="!productDisabledId.includes(item.productId)"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button class="btn btn-primary" @click="confirmDialog">保存</button>
                    </div>
                </div>
            </div>
         </ui-dialog>
    </div>
</template>
<script>
export default {
    name: 'add-product',
    props: {
        needFilterCanNotDiscount: { // 需要过滤不允许打折的产品不允许选择 客户合同中有用
            type: Boolean,
            default: false
        },
        notDiscountType: {
            type: Array, // 需要过滤不允许打折产品的类型 和 needFilterCanNotDiscount:true 一起使用，数字类型，客户合同中有用
            default: () => ([])
        },
        productChecked: {
            // 被选中的产品
            type: Array, // 必须有itemName 或者 productName 进行反显
            default: () => ([])
        },
        productDisabledId: { // idList   [123,123]
            type: Array,
            default: () => ([])
        },
        productDisabledParams: {
            // disabled产品查询参数
            type: Object,
            default: () => ({})
        },
        // productListAll: {
        //     // 所有产品
        //     type: Array,
        //     default: () => ([])
        // },
        showAddProductDialog: {
            type: Boolean,
            default: false
        },
        single: {
            type: Boolean,
            default: false
        },
        needClear: {
            type: Boolean,
            default: true
        },
        //展示几个tab
        canShowTab: {
            type: Array,
            default: () => ([])
        },
        url: {
            type: String,
            default: '/calculator/priceCalculator/getProducts'
        },
        needExclusion: { // 是否需要判断互斥
            type: Boolean,
            default: true
        }
    },
    watch: {
        notDiscountType: {
            handler (val) {
                // console.error(val);
            },
            immediate: true
        }
        // productDisabledId: {
        //     handler (val) {
        //         if (val) {
        //             this.exclusionlist = val;
        //         }
        //     },
        //     immediate: true,
        //     deep: true
        // }
    },
    data() {
        return {
            productListAll: [],
            searchServiceId: '',
            activeTab: '1',
            switchTabData: '',
            title: '添加产品',
            checkedlist: [],
            productlist: {},
            productlistArr: [],
            exclusionlist: [],
            isCheckAll: false,
            innerTab: [],
            isGetExclution: true,
        };
    },
    mounted() {
        this.getProducts();

        for (let key in this.productlist) {
            this.productlist[key].every((ele) => {
                if (!ele.checked) {
                    return this.productlist[key].ischeckall = false;
                } else {
                    return this.productlist[key].ischeckall = true;
                }
            });
        }
    },
    methods: {
        discountItem(val) {
            if (!this.needExclusion) {
                return false;
            }
            if (this.isGetExclution) {
                return true;
            }
            return (this.productDisabledId.includes(val.productId) ? true : (this.exclusionlist.indexOf(String(val.itemId)) >= 0 ? true : false)) ||
                (this.needFilterCanNotDiscount && this.notDiscountType.includes(+val.itemType) && val.discountType != 1);
        },
        getProducts () {
            let vm = this;
            this.$ajax({
                url: this.url,
                method: 'GET',
                params: this.productDisabledParams
            }).then(({success, root, message, code, data}) => {
                if (success || code == 1) {
                    // success、root 兼容旧接口
                    vm.productListAll = root ? [...root] : [...data];
                    vm.timestamp = Date.now();
                    if (vm.productListAll.length) {
                        vm.selectDialog = true;
                        this.formatProductlist();
                        if (!this.canShowTab.length) {
                            this.innerTab = Object.keys(this.productlist).map(item => item | 0);
                        } else {
                            this.innerTab = this.canShowTab;
                        }
                        this.activeTab = this.innerTab[0];

                        this.checkedlist = [...this.productChecked].map(item=>{
                            item.itemName = item.itemName || item.productName;
                            item.checked = true;
                            return item;
                        });
                    } else {
                        vm.$toast({
                            content: '当前条件下无可偿选产品',
                            type: 'error',
                            wrapClass: 'dialog-inner-toast'
                        });
                    }
                } else {
                    vm.$toast({
                        content: message,
                        type: 'error',
                        wrapClass: 'dialog-inner-toast'
                    });
                }
            });
        },
        hideddProductDialog() {
            this.$emit('confirmProduct');
        },
        clearAll() {
            this.checkedlist = [];
            this.exclusionlist = [];
            for (let k in this.productlist) {
                this.productlist[k].ischeckall = false;
                this.productlist[k].map(item => {
                    item.checked = false;
                });
            }
        },
        onChangeSearch() {
            for (let key in this.productlist) {
                this.productlist[key].forEach((ele) => {
                    if (ele.encryptId == this.searchServiceId) {
                        this.activeTab = key;
                        ele.activeShow = true;
                    } else {
                        ele.activeShow = false;
                    }
                });
            }
        },
        switchTab(item, idx) {
            this.activeTab = idx;
            this.switchTabData = item;
        },
        formatProductlist() {
            this.productListAll.map((item) => {
                if (!this.productlist[item.itemType]) {
                    this.productlist[item.itemType] = [];
                }
                Object.assign(item, {checked: false});
                this.productlist[item.itemType].push(item);
            });
            if (this.productChecked.length) {
                this.productChecked.map((item) => {
                    (this.productlist[item.itemType] || []).map((item2) => {
                        if (item2.encryptId == item.encryptId) {
                            item2.checked = true;
                            this.checkedlist.unshift(item2);
                        }
                    });
                });
            }
            for (let key in this.productlist) {
                this.productlist[key].forEach((ele) => {
                    this.productlistArr.push(ele);
                });
            }
            if (this.needExclusion) {
                this.getExclusionlist();
            }
            
        },
        changeCheckbox(val) {
            if (this.single) {
                this.checkedlist = [val];
                return;
            }
            let flag = true;
            if (val.checked) {
                this.checkedlist.map((item) => {
                    if (item.encryptId == val.encryptId) {
                        flag = false;
                        return false;
                    }
                });
                if (flag) {
                    this.checkedlist.unshift(val);
                    this.productlist[val.itemType].map((item, idx) => {
                        if (item.encryptId == val.encryptId) {
                            item.checked = true;
                            this.$set(this.productlist[val.itemType], idx, item);
                        }
                    });
                }
            } else {
                this.checkedlist.map((item) => {
                    if (item.encryptId == val.encryptId) {
                        item.checked = false;
                        return false;
                    }
                });
                this.checkedlist = this.checkedlist.filter((item) => {
                    return item.checked;
                });
            }
            if (this.needExclusion) {
                this.getExclusionlist();
            }
            
            for (let key in this.productlist) {
                this.productlist[key].every((ele) => {
                    if (!ele.checked) {
                        return this.productlist[key].ischeckall = false;
                    } else {
                        return this.productlist[key].ischeckall = true;
                    }
                });
            }
        },
        getExclusionlist() {
            let checkedItemIds = [];
            this.checkedlist.map((item) => {
                if (item.itemId) {
                    checkedItemIds.push(item.itemId);
                } else {
                    checkedItemIds.push(item.productId);
                }

            });
            let params = {
                customerId: this.productDisabledParams.customerId,
                signType: this.productDisabledParams.signType,
                sellType: this.productDisabledParams.sellType,
                sourceType: 2,
                checkedItemIds: checkedItemIds.join(',')
            };
            this.isGetExclution = true;
            this.$ajax({
                url: '/package/rule/exclusion',
                method: 'GET',
                params: params
            }).then(({success, root}) => {
                if (success) {
                    this.exclusionlist = [...root].concat(this.productDisabledId);
                    this.isGetExclution = false;
                }
            });
        },
        confirmDialog() {
            if (!this.checkedlist.length) {
                this.$toast({
                    content: '请选择产品',
                    type: 'error',
                    wrapClass: 'dialog-inner-toast'
                });
                return;
            }
            this.$emit('confirmProduct', this.checkedlist);
        },
        delectItem(index, val) {
            if (this.single) {
                this.checkedlist = [];
                return;
            }
            this.checkedlist.splice(index, 1);
            this.productlist[val.itemType].map((item, idx) => {
                if (item.encryptId == val.encryptId && item.checked) {
                    item.checked = false;
                }
            });
        }
    }
};
</script>
<style lang="less">
    .modify-production-select-dialog {}
    .add-product-box {
        .dialog-header {
            font-size: 18px;
            line-height: 25px;
            font-weight: bold;
            padding: 10px 0 15px;
        }
        .dialog-box {
            .search-name {
                .ui-select {
                    width: 100%;
                }
            }
            .dialog-con {
                width: 100%;
                display: flex;
                .tab-box {
                    height: 50px;
                    margin: 0;
                    & > li {
                        box-sizing: border-box;
                        padding: 11px 0;
                        margin: 0 12px;
                        &:nth-child(3) {
                            min-width: 74.69px;
                        }
                    }
                }
                .inner {
                    border: 1px solid #dadada;
                    border-top: none;
                    height: 300px;
                    flex-shrink: 0;
                    flex-grow: 0;
                    &:nth-child(1){
                        min-width: 490px;
                    }
                    &:nth-child(2){
                        width: 400px;
                    }
                    .tab-list-con {
                        max-height: 250px;
                        overflow-y: auto;
                        label {
                            display: block;
                            line-height: 30px;
                            padding: 0 10px;
                            padding-left: 40px;
                            margin: 0;
                            &.checkbox-disabled {
                                opacity: 0.5;
                                &:hover .checkbox-inner {
                                    border-color: #e3e7ed;
                                }
                            }
                            &.active {
                                background: #f4f4f4;
                            }
                        }
                    }
                    &:last-child {
                        border-left: none;
                    }
                }
                h4 {
                    padding: 10px 20px;
                    font-size: 14px;
                    color: #414a60;
                    font-weight: bold;
                    height: 50px;
                    line-height: 30px;
                    border-bottom: 1px solid #ededed;
                    span.clear-all {
                        float: right;
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 700;
                        cursor: pointer;

                        &:before {
                            color: #53CAC3;
                        }
                    }
                }
                .selected-list {
                    border-radius: 4px;
                    width: 400px;
                    min-height: 58px;
                    margin-bottom: 20px;
                    padding: 16px 20px;
                    max-height: 248px;
                    overflow-y: auto;
                    .icrm-icon-clean {
                        color: #c0c4cc;
                        font-size: 12px;
                        vertical-align: middle;
                        padding: 0 12px 0 5px;
                    }
                    span {
                        background: #f5f7fa;
                        margin-right: 10px;
                        border-radius: 4px;
                        padding-left: 10px;
                        margin-bottom: 10px;
                        display: inline-block;
                    }
                }
            }
            .btn-box {
                margin-top: 10px;
                text-align: right;
            }
        }
    }

    .is-single-product-select {
        .checkbox-inner {
            display: none;
        }
    }
</style>
