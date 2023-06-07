<template>
    <div class="task-detail-box-in-dialog">
        <p class="line-title">待处理任务</p>
        <div class="data-search">
            <ul class="form-row">
                <li>
                    <span class="t">任务截止时间</span>
                    <ui-vendor-date-picker 
                        type="daterange"
                        v-model="queryData.datePicker"
                        :editable="false"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="截止日期">
                    </ui-vendor-date-picker>
                </li>
                <li>
                    <span class="t">任务类型</span>
                    <ui-select v-model="queryData.missionTypeId" clearable>
                        <ui-option v-for="(item, index) in taskOptions" :value="(item.missionTypeId).toString()" :key="index">
                            {{item.missionTypeName}}
                        </ui-option>
                    </ui-select>
                </li>
                <li>
                    <button class="btn btn-primary" @click="getList(true)">查询</button>
                </li>
            </ul>
        </div>
        <ui-table>
            <thead slot="header">
                <tr>
                    <th width="200px">任务名称</th>
                    <th width="100px">BOSS/联系人</th>
                    <th width="110px">截止时间</th>
                    <th width="80">优先级</th>
                    <th width="90">任务类型</th>
                    <th width="90">任务描述</th>
                    <th width="70">操作</th>
                </tr>
            </thead>
            <tbody slot="body">
                <tr v-for="(item, index) in list" :key="index">
                    <td>
                        <dot :txt="item.missionName" width="200" linHeight="20" line="1" :key="item.encryptId" appendToBody placement="top-right" theme="dark"></dot>
                        <p class="gray">任务ID：{{item.missionId}}</p>
                    </td>
                    <td>
                        <div class="call-contact-box">
                            <span class="call-contact-name">
                                {{item.contactName || '--'}}
                            </span>
                            <template v-if="item.callInfo">
                                <a
                                    href="javascript:;"
                                    @click.prevent="makePhoneCall(item, 1)"
                                    :class="['dynamic-phone', {'dynamic-phone-primary': item.callInfo.callStatus == '0', 'dynamic-phone-warning': item.callInfo.callStatus == '1', 'dynamic-phone-disabled': item.callInfo.callStatus == '2'}]">
                                    <i class="icrm-round-phone"></i>
                                </a>
                            </template>
                        </div>
                        
                        <!-- 如果当前登录用户有权限拨打联系人电话，则联系人处显示电话icon，支持拨打； -->
                    </td>
                    <td>
                        <div style="width:75px;">{{item.deadLine | formatDeadLine}}</div>
                    </td>
                    <td>
                        <span :class="`priority-status ${getPriorityColor(item.priority)}`">{{getPriorityColorText(item.priority) }}</span>
                    </td>
                    <td>{{item.missionTypeName}}</td>
                    <td>
                        <dots :txt="item.description" :line="2" :key="item.missionId"></dots>
                    </td>
                    <td>
                        <!-- activeTab == 1 -->
                        <a class="a-primary" href="javascript:;" @click="handleDetail(item, index, 1)">处理</a>
                    </td>
                </tr>
            </tbody>
        </ui-table>
        <data-blank 
            v-if="isLoading || list.length === 0 || showLoadError"
            :loading="isLoading" 
            :no-data="list.length === 0" 
            :has-error="showLoadError"
            >
                <div slot="no-data">
                    <div class="no-data-image"></div>
                    <p class="no-data-txt">
                        暂无待办任务，快去<span @click="addTask">添加任务</span>吧
                    </p>
                </div>
            </data-blank>
        <ui-pager 
            v-if="!isLoading && list.length && totalCount" 
            :current="queryData.page" 
            :total="totalCount" 
            showTotal 
            :pageSize="queryData.pageSize"  
            @update:page="updatePage"></ui-pager>
        <ui-full-dialog v-if="detailVisible" @update:close="closeDetail" :second="true">
            <TaskDetail
                :missionIdArr="missionIdArr"
                :missionIdArrIdx="missionIdArrIdx"
                :dataId="missionId"
                @updateList="updateList"
                @update:close="closeDetail">
            </TaskDetail>
        </ui-full-dialog>
    </div>
</template>
<script>
import {formatDate} from '@/utils/tools/utils.js';
import TaskDetail from '@/views/dashboard/task/management/component/task-details/index.vue';
export default {
    name: 'task',
    props: {
        customerId: {
            type: [String, Number],
            default: ''
        },
        customerInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        pathType: {
            type: String,
            default: 'newpending'
        }
    },
    data () {
        return {
            taskOptions: [],
            queryData: {
                datePicker: [],
                missionTypeId: '',
                page: 1,
                pageSize: 20
            },
            totalCount: 0,
            list: [],
            missionIdArr: [],
            missionId: '',
            isLoading: false,
            showLoadError: false,
            detailVisible: false
        };
    },
    watch: {
    },
    components: {
        TaskDetail
    },
    created () {
        this.getTaskOption();
        this.getList();
    },
    filters: {
        formatDeadLine (value){
            let _this = this;
            if(!value){
                return '';
            }
            let today = new Date(formatDate(new Date(), 'yyyy-MM-dd')).getTime();
            let yesterday = new Date(formatDate(new Date(), 'yyyy-MM-dd')).getTime() - 24*60*60*1000;
            let tomorrow = new Date(formatDate(new Date(), 'yyyy-MM-dd')).getTime() + 24*60*60*1000;
            let time = new Date(formatDate(new Date(value), 'yyyy-MM-dd')).getTime();
            if(time == today){
                return '今天'+ value.substring(11, 17);
            } else if(time == yesterday){
                return '昨天'+ value.substring(11, 17);
            } else if(time == tomorrow){
                return '明天'+ value.substring(11, 17);
            } else {
                return value;
            }

        },
    },
    methods: {
        addTask () {
            let vm = this;
            this.$emit('addTask');
            vm.$trackEvent({
                action: 'crm-addTask',
                p1: 6,
                p2: vm.customerInfo.customerId,
                p12: this.pathType == 'newpending' ? 1 : 2
            });
        },
        getTaskOption() {
            this.$ajax({
                url: '/mission/type/options.json',
                method: 'GET'
            }).then(({data}) => {
                this.taskOptions = data || [];
            });
        },
        updateList () {
            this.getList();
            // 更新总数量
            this.$emit('updateInfo');
        },
        getList (needReset) {   
            this.isLoading = true;
            this.showLoadError = false;
            this.list = [];

            if (needReset) {
                this.queryData.page = 1;
            }
            
            this.$ajax({
                method: 'GET',
                url: '/clue/customer/detail/mission/list',
                // url: 'http://api.kanzhun-inc.com/mock/175/clue/customer/detail/mission/list',
                params: {
                    customerId: this.customerId,
                    deadLineStart: (this.queryData.datePicker || [])[0] || '',
                    deadLineEnd: (this.queryData.datePicker || [])[1] || '',
                    missionTypeIds: this.queryData.missionTypeId,
                    page: this.queryData.page,
                    pageSize: this.queryData.pageSize
                },
            }).then( (res) => {
                this.showLoadError = res.code != 1;
                this.isLoading = false;
                if(res.code == 1) {
                    let data = res.data;
                    this.list = data.items || [];
                    this.totalCount = data.totalCount;
                }
            });
        },
        handleDetail (item, index) {
            let vm = this;
            this.missionId = item.missionId;
            this.missionIdArr = [];
            this.missionIdArrIdx = index;

            let missionIdArr = [];
            this.list.forEach(element => {
                missionIdArr.push(element.missionId);
            });
            this.missionIdArr = missionIdArr;
            this.detailVisible = true;

            vm.$trackEvent({
                action: 'crm-taskDetail',
                p1: 6,
                p2: item.missionId,
                p3: item.missionStatus, // TODO  任务状态：0待处理/1已逾期/2无效/3已取消/4逾期完成/5已完成
                p4: item.missionTypeId || '',
                p5: item.executorId, // TODO  任务执行人ID
                p12: this.pathType == 'newpending' ? 1 : 2
            });
        },
        getPriorityColor (num) {
            switch (num) {
                case 10 :
                    return 'priority-status-1';
                    break;
                case 20:
                    return 'priority-status-2';
                    break;
                case 30:
                    return 'priority-status-3';
                    break;
                case 40:
                    return 'priority-status-4';
                    break;
                default:
                    break;
            }
        },
        getPriorityColorText (num) {
            switch (num) {
                case 10 :
                    return '非常紧急';
                    break;
                case 20:
                    return '紧急';
                    break;
                case 30:
                    return '普通';
                    break;
                case 40:
                    return '较低';
                    break;
                default:
                    break;
            }
        },
        makePhoneCall (item) {
            // 新版本的不走前置阻断
            if (item.callInfo.riskVersion != 2 && !item.callInfo.canCall) {
                this.$toast({
                    type: 'warning',
                    content: item.callInfo.noCallReason,
                });
                return false;
            };
            try {
                let params = {
                    name: item.callInfo.name,
                    phone: item.callInfo.callMobile,
                    phoneShow: item.callInfo.showMobile,
                    customerId: item.callInfo.customerId,
                    contactId: item.callInfo.contactId,
                    riskVersion: item.callInfo.riskVersion || 1,
                };
                if (item.callInfo && item.callInfo.riskVersion == 2) {
                    params.faceParams = {
                        mobileRiskStatus: item.callInfo.mobileRiskStatus,
                        callSuppliers: item.callInfo.callSuppliers,
                        callTips: item.callInfo.callTips,
                    };
                };
                //渲染弹窗
                this.$previewOutcall(params);
            } catch (error) {
                console.log(error);
            };
        },
        closeDetail (res) {
            if (res && res.upload) {
                this.getList();
            }
            this.detailVisible = false;
        },
        updatePage (res) {
            this.queryData.page = res;
            this.getList();
        }
    },
};
</script>

<style lang="less">
    .task-detail-box-in-dialog{
        .line-title{
            position: relative;
            padding-left: 10px;
            font-size: 16px;
            font-weight: 500;
            &::after{
                position: absolute;
                display: inline-table;
                content: " ";
                width: 3px;
                height: 14px;
                background: #0CC3BC; 
                left: 0;
                top: 6px;
            }
        }
        .priority-status {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 12px;

            &.priority-status-1 {
                color: #FF6A7D;
                background: #FFF1F1;
                border: 1px solid #FFCDCF;
            }
            &.priority-status-2 {
                color: #FEA932;
                background: #FFF8ED;
                border: 1px solid #FDDFB0;
            }
            &.priority-status-3 {
                color: #0CC3BC;
                background: #ECFCFB;
                border: 1px solid #B0E9E6;
            }
            &.priority-status-4 {
                color: #828A9E;
                background: #E2E2E2;
                border: 1px solid #E2E2E2;
            }
        }
        .dynamic-phone {
            display: inline-block;
            margin: 9px 5px;
            i {
                display: inline-block;
                // font-size: 32px;
                vertical-align: top;
            }
            &-primary {
                color: #53D8C9;
            }
            &-warning {
                color: #ffcb93;
            }
            &-disabled {
                color: #cdcdcd;
            }
        }
    }
    .el-date-range-picker{
        z-index: 8000 !important;
    }
</style>
