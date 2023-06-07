<template>
    <div class="select-customer">
        <div class="dialog-title">选择客户</div>
        <div class="data-search">
            <div class="form-row">
                <span>客户名称</span>
                <ui-input v-model.trim="queryData[propConf.name]" size="small"></ui-input>
                <span>客户ID</span>
                <ui-input v-model.trim="queryData[propConf.value]" size="small"></ui-input>
                <button type="submit" class="btn btn-small btn-primary" @click="getCustomerData()">查询</button>
            </div>
        </div>
        <div class="data-list" v-if="!isLoading && customerList.length>0">
            <ui-table fixedHeader>
                <thead slot="header">
                <tr>
                    <th width="30"></th>
                    <th width="60">客户ID</th>
                    <th>客户名称</th>
                    <th>客户简称</th>
                    <template v-if="isCalculator">
                        <th>经营状态</th>
                        <th>创建时间</th>
                    </template>
                    <th width="80">商务顾问</th>
                    <th width="80">所属部门</th>
                </tr>
                </thead>
                <tbody slot="body" v-if="customerList.length && !isLoading">
                <tr v-for="(item, index) in customerList" :key="index" @click="selectedCustomerId = item.customerId">
                    <td width="30">
                        <!-- <ui-radio v-if="item.customerId === selectedCustomerId" :value="true"></ui-radio>
                       <ui-radio v-else @on-change="selectedCustomerId = item.customerId"></ui-radio> -->
                        <ui-radio
                            :value="item.customerId === selectedCustomerId || (!selectedCustomerId && _selectedCustomerId && item.encryptId === _selectedCustomerId)"
                            @on-change="selectedCustomerId = item.customerId"></ui-radio>
                    </td>
                    <td width="60">{{item.customerId}}</td>
                    <td>{{item.name || item.customerName}}</td>
                    <td>{{item.simpleName}}</td>
                    <template v-if="isCalculator">
                        <td>
                            <span v-if="item.operatingCode" class="state-icon icrm-new-bulb"
                                  :class="`state-icon-${item.operatingCode}`">
                                <font>{{item.operatingState}}</font>
                            </span>
                        </td>
                        <td>{{item.estiblishTime && formatDate(new Date(item.estiblishTime))}}</td>
                    </template>
                    <td width="80">{{item.userName}}</td>
                    <td width="80">{{item.deptName}}</td>
                </tr>
                </tbody>
            </ui-table>
            <ui-pager v-if="totalCount" :total="totalCount" :current="queryData.page" showTotal
                      :pageSize="queryData.pageSize"
                      @update:page="getCustomerData"></ui-pager>
        </div>
        <!--加载中/无数据/请求有误-->
        <data-blank v-if="isLoading || customerList.length === 0 || showLoadError"
                    :loading="isLoading" :no-data="customerList.length === 0" :has-error="showLoadError"></data-blank>
        <div class="diglog-footer" v-if="!isLoading && customerList.length>0">
            <div class="btn-box">
                <button class="btn btn-primary" @click="confirmDialog">确定</button>
                <button class="btn btn-primary btn-outline" @click="hideDialog">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
import {formatDate} from '@/utils/tools/utils.js';

export default {
    name: 'selectCustomer',
    props: {
        action: {
            type: String,
            default: '/calculator/priceCalculator/getCustomers'
        },
        propConf: {
            type: Object,
            default: () => ({
                name: 'name',
                value: 'customerId'
            })
        },
        _selectedCustomerId: {
            type: [String, Number],
            default: '' // 加密id或明文
        },
        isCalculator: {
            // 价格计算器新增了两个字段
            type: Boolean,
            default: false
        }
    },
    data() {
        const {name, value} = this.propConf;
        return {
            queryData: {
                pageSize: 5,
                page: 1,
                [value]: '',
                [name]: ''
            },
            customerList: [],
            totalCount: 0,
            showLoadError: false,
            isLoading: true,
            selectedCustomerId: '' // 未加密id
        };
    },
    created() {
        this.getCustomerData();
    },
    methods: {
        formatDate,
        setDefaultValue() {
            for (let item of this.customerList) {
                if (item.encryptId == this._selectedCustomerId || item.customerId == this._selectedCustomerId) {
                    this.selectedCustomerId = item.customerId;
                    break;
                }
            }
        },
        getCustomerData(pageNum = 1) {
            this.queryData.page = pageNum;
            this.isLoading = true;
            this.$ajax({
                url: this.action,
                method: 'GET',
                params: this.queryData,
            }).then(({success, root, message}) => {
                this.isLoading = false;
                if (success) {
                    this.customerList = root.customers || root.list || [];
                    this.totalCount = root.totalCount;
                } else {
                    this.showLoadError = true;
                    this.$toast({
                        content: message,
                        type: 'error'
                    });
                }
            });
        },
        confirmDialog() {
            if (!this.selectedCustomerId && this._selectedCustomerId) this.setDefaultValue();
            if (this.selectedCustomerId) {
                this.$emit('selected', this.customerList.find((item) => item.customerId === this.selectedCustomerId));
            } else {
                this.$toast({
                    content: '请选择客户',
                    type: 'error'
                });
            }
        },
        hideDialog() {
            this.$emit('cancal');
        }
    }
};
</script>

<style lang="less">
    .select-customer {
        .data-tips {
            min-height: 400px;
        }
        .dialog-title {
            padding-left: 30px;
            line-height: 50px;
            font-size: 16px;
            color: #333;
            font-weight: bold;
        }
        .data-search {
            margin-top: 0;
            input {
                padding: 2px 10px 2px 10px;
                min-height: 22px;
                line-height: 22px;
                border: 1px solid #e3e7ed;
                vertical-align: middle;
            }
        }
        .data-list {
            .table-body {
                overflow-y: auto;
            }
            .ui-table {
                overflow-y: hidden;
                .radio {
                    margin-top: 4px;
                }
                th {
                    height: 20px;
                }
                .table-body {
                    max-height: 200px;
                    height: 200px;
                    overflow-y: auto;
                }
            }
            .state-icon {
                padding: 4px 6px;
                border: 1px solid #C4C4C4;
                border-radius: 3px;
                line-height: 1;
                font-size: 12px;
                color: #828A9E;

                & > font {
                    margin-left: 3px;
                }
            }
            .state-icon-1 {
                border-color: #53CAC3;
                background-color: rgba(83, 202, 195, .3);

                &:before {
                    color: #53CAC3;
                }
            }
            .state-icon-2,
            .state-icon-3 {
                border-color: #FD7F83;
                background-color: rgba(253, 127, 131, .2);

                &:before {
                    color: #FD7F83;
                }
            }
            .state-icon-4 {
                border-color: #FFC98A;
                background-color: rgba(255, 201, 138, .15);

                &:before {
                    color: #FFC98A;
                }
            }
            .pager {
                // padding: 0 10px;
                // margin-top: 10px;
            }
        }
        .diglog-footer {
            text-align: center;
            padding: 10px 0 20px 0;
            .btn-box {
                .btn {
                    margin: 0 5px;
                }
            }
        }
    }
</style>
