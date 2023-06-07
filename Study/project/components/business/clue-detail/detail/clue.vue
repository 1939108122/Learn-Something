<template>
    <div class="clue-detail-box-in-dialog">
        <p class="line-title">待处理线索 <span class="refresh-list" @click="getList(true)"><i class="icrm-update"></i>刷新列表</span></p>
        <ui-table>
            <thead slot="header">
                <tr>
                    <th width="200px">线索联系人</th>
                    <th width="100px">拨打状态</th>
                    <th width="110px">手机
                        <ui-tooltip width="420" :trigger="'hover'" :wrapClass="'new-pending-operate-box'" :placement="'top-right'" theme="dark">
                            <i class="table-header-tip-icon" slot="reference"></i>
                            <ul slot="content">
                                <li><span>回电号码：</span><span>用户要求回电的手机号码，请优先回电此号码；</span></li>
                                <li><span>来电/注册号码：</span><span>用户来电或注册的手机号码，作为备份联系使用；</span></li>
                                <li><span>备用号码：</span><span>用户来电备用联系号码，在回电号码或来电号码无法拨通时联系此号码。</span></li>
                            </ul>
                        </ui-tooltip>
                    </th>
                    <th width="80">线索来源</th>
                    <th width="90">线索类型</th>
                    <th width="120">线索发生时间</th>
                    <th width="90">备注</th>
                </tr>
            </thead>
            <tbody slot="body">
                <tr v-for="(item, index) in list" :key="index">
                    <td class="name">
                        <span>{{item.callinContactName}}</span><span v-if="item.callinTitle" class="position">{{item.callinTitle}}</span>
                    </td>
                    <td>{{['', '未拨打', '未接通', '已接通'][item.callStatus]}}</td>
                    <td class="phone">
                        <template v-for="(icon, _index) in item.mobileList">
                            <span class="txt-tip" :key="_index+1">{{['', '回', '来', '备'][icon.type]}}</span><span @click="makeCalls(item, icon)" class="icrm-round-phone" :class="'icon-'+getColor(icon.phoneRiskStatus)" :key="_index+Date.now()"></span>
                        </template>
                    </td>
                    <td>{{item.seaTypeName}}</td>
                    <td>{{item.clueTypeName}}</td>
                    <td>{{item.clueTime}}</td>
                    <td>
                        <dots :txt="item.remark" :line="1"></dots>
                        <dots :txt="item.callRemark" :line="1"></dots>
                    </td>
                </tr>
            </tbody>
        </ui-table>
        <ui-pager 
                v-if="!isLoading && list.length && totalCount" 
                :current="queryData.page" 
                :total="totalCount" 
                showTotal 
                :pageSize="queryData.pageSize"  
                @update:page="updatePage"></ui-pager>
        <data-blank 
            v-if="isLoading || list.length === 0 || showLoadError"
            :loading="isLoading" 
            :no-data="list.length === 0" 
            :has-error="showLoadError"
            >
                <div slot="no-data">
                    <div class="no-data-image"></div>
                    <p class="no-data-txt">
                        暂无待处理线索
                    </p>
                </div>
            </data-blank>
        <template v-if="!showMore">
            <p class="line-title" v-if="list.length">线索处理</p>
            <ui-form class="clue-form" :model="clueForm" ref="clueForm" :rules="rules" v-if="list.length">
                <form-item label="联系人" prop="contactId" :label-width="110" required>
                    <ui-select v-model="clueForm.contactId" placeholder="请选择" clearable filterable>
                        <ui-option 
                            v-for="(item,index) in contactList"
                            :value="item.key" 
                            :key="item.key + index">{{item.name}}</ui-option>
                    </ui-select> 
                </form-item>
                <form-item label="跟进内容" :label-width="110" prop="text" required>
                    <ui-input 
                        v-model.trim="clueForm.text"
                        counter
                        type="textarea" 
                        :rows="4"
                        placeholder="提交后不可修改和删除，请如实填写"></ui-input>
                </form-item>
                <form-item prop="signIntention" :label-width="110" class="sale-process" required>
                    <ui-select v-model="clueForm.signIntention" placeholder="请选择销售进程">
                        <span slot="labelPrefix" class="form-required">销售进程</span>
                        <ui-option 
                            v-for="item in signIntentionList"
                            :value="String(item.value)" 
                            :key="item.value">{{ item.label }}</ui-option>
                    </ui-select>
                    <ui-tooltip
                        trigger="hover"
                        theme="dark"
                        placement="top"
                        width="300"
                        appendToBody>
                        <i class="icrm-info" slot="reference"></i>
                        <template slot="content">
                            <p>首单：未签单回款时无法选择100%和已回款</p>
                            <p>非新签：上一笔订单到款后未发生新的签单回款时，无法选择100%和已回款</p>  
                        </template>
                    </ui-tooltip>
                </form-item>
                <template v-if="clueForm.signIntention">
                    <div class="info-container">关联商机<span class="info-text">{{infoText()}}</span></div>
                    <div v-if="!['0','1','5','6','7'].includes(clueForm.signIntention)" class="business-container">
                        <form-item prop="signMoney">
                            <ui-input 
                                v-model="clueForm.signMoney" 
                                :maxlength="10"
                                placeholder="请输入预计签约金额"
                                v-customTxt="{reg: '\d'}">
                                    <span slot="labelPrefix" class="form-required">预计签约金额</span>
                                    <i class="text-gray" slot="suffix">元</i>
                                </ui-input>
                        </form-item>
                        <form-item prop="signTime">
                            <ui-vendor-date-picker 
                                v-model="clueForm.signTime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :editable="false"
                                :clearable="false"
                                placeholder="请选择预计签约时间"
                                :picker-options="signTimePickerOptions"
                                @change="onChangeSignTime">
                                <span slot="labelPrefix" class="form-required">预计签约时间</span>
                            </ui-vendor-date-picker>
                        </form-item>
                        <form-item prop="returnTime">
                            <ui-vendor-date-picker 
                                v-model="clueForm.returnTime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :editable="false"
                                :clearable="false"
                                placeholder="请选择预计回款时间"
                                :picker-options="returnTimePickerOptions">
                                <span slot="labelPrefix" class="form-required">预计回款时间</span>
                            </ui-vendor-date-picker>
                        </form-item>
                        <form-item label="靠谱程度">
                            <ui-radio-group v-model="clueForm.signOption">
                                <ui-radio label="1">保底</ui-radio>
                                <ui-radio label="2">洪荒</ui-radio>
                            </ui-radio-group>
                        </form-item>
                    </div>
                </template>
            </ui-form>
            <p v-if="list.length">
                <!-- <button class="btn btn-primary btn-outline" @click="cancel">取消</button> -->
                <!-- <template v-if="!echoTestUser">
                    <button class="btn btn-primary" @click="save(5)" :disabled="isSubmiting">处理线索</button>
                </template>
                <template v-else> -->
                <template v-if="customerInfo.canMoveToBusi">
                    <button class="btn btn-primary" @click="save(12)" v-if="userId == customerInfo.userId" :disabled="isSubmiting">加入商机库</button>
                    <button class="btn btn-primary btn-outline" @click="save(5, true)" :disabled="isSubmiting">暂存拨打库</button> 
                </template>
                <template v-else>
                    <button class="btn btn-primary" @click="save(5)" :disabled="isSubmiting">处理线索</button>
                </template>
                <!-- </template> -->
            </p>
        </template>
    </div>
</template>
<script>
export default {
    name: 'clue',
    props: {
        contactList: {
            type: Array,
            default: () => {
                return [];
            }
        },
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
        showMore: {
            type: Boolean,
            default: false
        },
        pathType: {
            type: String,
            default: 'newpending'
        }
    },
    data () {
        return {
            queryData: {
                page: 1,
                pageSize: 10,
            },
            totalCount: 0,
            list: [],
            signIntentionList: [
                // {label: '0%-无意向', value: '0'},
                // {label: '20%-找到KP', value: '1'},
                // {label: '40%-意向客户', value: '2'},
                // {label: '60%-方案报价', value: '3'},
                // {label: '80%-合同流程', value: '4'},
                // {label: '100%-已签约', value: '5'},
                // {label: '已回款', value: '7'},
                // {label: '丢单', value: '6'},
            ],
            clueForm: {
                text: '',  //跟进内容
                contactId: '',  //联系人
                signIntention: '',  //销售进程
                signMoney: '',  //签单金额
                signTime: '', //签单时间
                returnTime: '',  //回款时间
                signOption: '', //靠谱程度

            },
            rules: {
                text: [
                    {required: true, type: 'string', message: '请填写跟进内容', trigger: 'blur'},
                    { min: 1, max: 500, message: '请输入1-500字之间的字符', trigger: 'change'}
                ],
                contactId: [
                    {required: true, type: 'string', message: '请选择联系人', trigger: 'change'}
                ],
                signIntention: [
                    {required: true, message: '请选择销售进程', trigger: 'change'},
                ],
                signTime: [
                    {required: true, message: '请选择预计签约时间', trigger: 'change'},
                ],
                returnTime: [
                    {required: true, message: '请选择预计回款时间', trigger: 'change'},
                ],
                signMoney: [
                    {required: true, message: '请输入预计签约金额', trigger: 'blur'},
                ],
            },
            isLoading: true,
            showLoadError: false,
            isSubmiting: false,
            echoTestUser: false, //是否是派单销售
            userId: '',
            // 禁用日期
            signTimePickerOptions: {
                disabledDate (params) {
                    const now = new Date(new Date().toLocaleDateString());
                    return params.getTime() < now.getTime();
                },
            },
            returnTimePickerOptions: {
                disabledDate (params) {
                    const start = new Date(new Date().toLocaleDateString());
                    return params.getTime() < start.getTime();
                },
            },
        };
    },
    watch: {
        '$store.state.user.userInfo': {
            handler (val) {
                this.echoTestUser = !!val.echoTestUser;
                this.userId = val.userId || '';
            },
            immediate: true,
            deep: true
        },
        customerInfo: {
            handler (val) {
                if (val && val.lastEncryptContactKeyId) {
                    this.clueForm.contactId = val.lastEncryptContactKeyId;
                }
            },
            immediate: true,
            deep: true
        }
    },
    components: {
    },
    created () {
        this.getList();
        this.getSaleProcessList();
    },
    methods: {
        //获取销售进程的列表
        getSaleProcessList() {
            this.$ajax({
                url: '/customer/follow/signIntentions',
                // url: 'https://api.weizhipin.com/mock/175/customer/follow/signIntentions',
                params: {
                    customerId: this.customerId
                }
            }).then(({code, data}) => {
                if(code == 1) {
                    this.signIntentionList = data.signIntentions || [];
                };
            });
        },
        getColor (type) {
            let classList = ['2', '1', '3', '3'];

            return classList[type] || 2;
        },
        makeCalls (item, icon) {
            let vm = this;
            try {
                let params = {
                    name: item.callinContactName,
                    phone: icon.realMobile,
                    phoneShow: icon.showMobile,
                    customerId: item.encryptCustomerId,  // TODO 暂时没有，需要添加
                    clueId: item.clueId,
                    contactId: item.bossId || '0',
                    riskVersion: icon.riskVersion,
                };

                if (icon.riskVersion == 2) {
                    params.faceParams = {
                        mobileRiskStatus: icon.mobileRiskStatus,
                        callSuppliers: icon.callSuppliers,
                        callTips: icon.callTips,
                    };
                };

                //渲染弹窗
                vm.$previewOutcall(params);

                vm.$trackEvent({
                    action: 'crm-clueToHandle-dial',
                    p1: vm.customerInfo.customerId,
                    p2: item.clueId,
                    p3: 5,
                    p4: this.totalCount,
                    p5: item.seaTypeName, 
                    p6: item.clueType,
                    p7: this.$store.getters['message/currentSupplierName'],
                    p8: this.$store.getters['message/currentSupplierName'],
                    p9: '',
                    p10: 1, // TODO 是否有新线索
                    p12: this.pathType == 'newpending' ? 1 : 2
                });
            } catch (error) {
                console.log(error);
            };
        },
        getList (refresh) {
            this.totalCount = 0;
            this.list = [];
            this.isLoading = true;
            this.showLoadError = false;
            if (refresh) {
                this.queryData.page = 1;
            }
            this.$ajax({
                method: 'GET',
                url:'/clue/customer/detail/clue/list',
                // url: 'http://api.kanzhun-inc.com/mock/175/clue/customer/detail/clue/list',
                params: {
                    customerId: this.customerId,
                    queryType: 1,
                    page: this.queryData.page,
                    pageSize: this.queryData.pageSize
                }
            }).then(({code, data}) => {
                this.isLoading = false;
                this.showLoadError = code != 1;
                if (code == 1) {
                    this.totalCount = data.totalCount;
                    this.list = data.items || [];
                };
            }, () => {
            });
        },
        updatePage (res) {
            this.queryData.page = res;
            this.getList();
        },
        save (clueHandle, type5) {
            let vm = this;
            this.$refs.clueForm.validate((valid) => {
                if (!valid) {
                    return;
                }
                vm.isSubmiting = true;
                let isShowAttr = !['0', '1', '5', '6', '7'].includes(this.clueForm.signIntention); //true 展示 false 不展示
                if (!isShowAttr) { //不展示销售进程对应的字段删除
                    delete this.clueForm.signMoney;
                    delete this.clueForm.signTime;
                    delete this.clueForm.returnTime;
                    delete this.clueForm.signOption;
                }
                this.$ajax({
                    url: '/customer/clue/handled/save.json',
                    // url: 'http://api.weizhipin.com/mock/175/customer/clue/handled/save.json',
                    params: {
                        clueId: (this.list[0] || {}).encryptClueId || '',
                        clueHandle,
                        dataSource: 13,
                        ...this.clueForm,
                        returnMoney: isShowAttr ? this.clueForm.signMoney : '' //后端要求传
                    }
                }).then( ({success, data, message}) => {
                    if(success) {
                        this.$emit('closeDialog', {update: true, clueHandle, text: this.clueForm.text});
                    }
                    vm.$toast({
                        content: success? '操作成功' :message,
                        type: success? 'success' : 'error'
                    });
                    vm.isSubmiting = false;
                });
            });
            if (clueHandle == 12 || type5) {
                vm.$trackEvent({
                    action: 'crm-clue-join-business-call',
                    p2: vm.customerInfo.customerId,
                    p3: vm.customerInfo.firstClueId,
                    p4: vm.customerInfo.firstClueSeaTypeName == '公海' ? 1 : 2,
                    p5: vm.customerInfo.firstClueType || '',
                    p6: clueHandle == 12 ? 1: 2,
                    p12: this.pathType == 'newpending' ? 1 : 2
                });
            }

            if (clueHandle == 12) {
                this.$emit('updateCanMoveToBusi');
            }
        },
        //关联商机文案
        infoText() {
            let type = this.clueForm.signIntention;
            if (type == 0 || type == 1 || type == 5 || type == 6 || type == 7) {
                return '（本次提交将不会生成商机）';
            } else {
                return '（本次提交后，客户下将生成一个新的商机）';
            }
        },
        // 签单时间改变时， 回款时间禁用日期也得改变
        onChangeSignTime (val) {
            if(val) {
                this.clueForm.returnTime = val;
                this.returnTimePickerOptions.disabledDate = (params) => {
                    const start = new Date(new Date(val).toLocaleDateString());
                    return params.getTime() < start.getTime();
                };
            };
        },
    },
};
</script>

<style lang="less">
    .clue-detail-box-in-dialog{
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
        .clue-form {
            .sale-process {
                .ui-select-label-prefix {
                    width: 600px;
                }
                .icrm-info {
                    margin-left: 3px;
                    vertical-align: middle;
                    color: #c0c4cc;
                }
            }
            .info-container {
                margin-bottom: 10px;
                padding-left: 110px;
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                color: #414a60;
                .info-text {
                    color: #c8c9cc;
                    font-weight: 400;
                    font-size: 13px;
                }
            }
            .business-container {
                .input-wrap-label-prefix, .ui-select-label-prefix, .el-input--labelPrefix {
                    width: 400px;
                }
                width: 600px;
                margin: 0 0 20px 110px;
                padding: 16px;
                background-color: #f7f8fb;
                border-radius: 8px;
            }
            .form-required::before {
                content: '*';
                display: inline-block;
                font-size: 12px;
                color: #ed3f14;
                margin-right: 4px;
            }
        }
        .refresh-list{
            font-size: 12px;
            color: rgba(0, 176, 169, 1);
            cursor: pointer;
            i{
                margin: auto 5px auto 10px;
            }
        }
        .ui-table{
            margin-bottom: 20px;
        }
        .phone{
            .txt-tip{
                border-radius: 4px;
                padding: 0px 4px;
                background: rgba(218, 218, 218, 1);
                font-weight: bold;
                color: rgba(130, 138, 158, 1);
                margin-right: 1px;
                vertical-align: middle;
                margin-top: 1px;
                margin-bottom: 1px;
                display: inline-block;
                font-size: 12px;
            }
            .icrm-round-phone{
                display: inline-block;
                vertical-align: middle;
                margin-right: 12px;
                font-size: 20px;
                margin-top: 1px;
                margin-bottom: 1px;
                margin-left: 6px;
                cursor: pointer;
            }
            .icon-2{
                color: rgba(83, 216, 201, 1);
            }
            .icon-1{
                color: rgba(255, 197, 134, 1);
            }
            .icon-3{
                color: #C0C4CC;
            }
        }
        .name{
            span{
                display: inline-block;
                vertical-align: middle;
                padding: 0 5px;
            }
            .position{
                position: relative;
                &::after{
                    position: absolute;
                    content: ' ';
                    display: inline-block;
                    width: 1px;
                    height: 10px;
                    background: rgba(54, 63, 85, 1); 
                    left: 0;
                    top: 5px;
                }
            }
        }
        .ui-form{
            padding-top: 20px
        }
    }
</style>
