<template>
    <div class="customer-follow-up-record">
        <div class="follow-title">
            <h2>添加跟进记录</h2>
        </div>
        <!-- 头部信息 -->
        <div class="info-container">
            <div class="info-item">
                <span>公司名称：</span><div class="customer-name"><dots :txt="customerName" :line="1" hoverColor="#414A60" customWrapClass="customer-name-popover"></dots>
                <i class="icon-slip-identification" v-if="customerModel.certification == 1"></i>
                </div>
            </div>
            <div class="info-item">
                <span>跟进时间：</span>
                <ui-vendor-date-picker
                    v-model="formData.followTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    :picker-options="followTimePickerOptions"
                    :editable="false"
                    :clearable="false"
                placeholder="请选择跟进时间"></ui-vendor-date-picker>
            </div>
            <div class="info-item">
                <span>跟进方式：</span>
                <ui-select v-model="formData.followType">
                    <ui-option
                        v-for="item in followMethodList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</ui-option>
                </ui-select>
            </div>
        </div>
        <!-- 跟进记录填写 -->
        <div class="follow-content">
            <!-- 左侧填写 -->
            <div class="content-left">
                <div class="sub-title">跟进信息</div>
                <div class="follow-add">
                    <ui-form ref="form" :model="formData" :rules="ruleData" @submit.native.prevent="">
                        <form-item prop="followNotes">
                            <ui-input
                                v-model="formData.followNotes"
                                counter
                                :rows="4"
                                resize="none"
                                type="textarea"
                                placeholder="请填写跟进内容">
                            </ui-input>
                        </form-item>
                        <form-item prop="contactId">
                            <ui-select v-model="formData.contactId">
                                <span slot="labelPrefix">联系人</span>
                                <ui-option
                                    v-for="item in contactList"
                                    :value="item.id"
                                    :key="item.id">{{ item.name }}</ui-option>
                            </ui-select>
                        </form-item>
                        <form-item label="标签" v-if="menuPrefix === 'my'">
                            <add-tag 
                                :userTags.sync="tags" 
                                :source="'follow'"
                                :customerId="id">
                            </add-tag>
                        </form-item>
                        <form-item prop="signIntention" :class="{'sale-select-container': hasPayNoIng}" class="pr-22">
                            <ui-select v-model="formData.signIntention" :disabled="hasPayNoIng && isAddBusiness">
                                <span slot="labelPrefix">销售进程</span>
                                <ui-option
                                    v-for="item in signIntentionList"
                                    :value="String(item.value)"
                                    :key="item.value">{{ item.label }}</ui-option>
                            </ui-select>
                            <!-- 新建按钮当 （有应收无进行商机 || 有未到期的合同审核通过的订单&&无进行中商机）&&最近一次到款小于等于7天 且 isAddBusiness 为true 才会显示 -->
                            <button v-if="hasPayNoIng && isAddBusiness" class="btn btn-common add-business" @click.prevent="addBusiness"><i class="icrm-icon-plus"></i>新建商机</button>
                            <!-- 撤销按钮当 (有应收无进行商机 || 有未到期的合同审核通过的订单&&无进行中商机) &&最近一次到款小于等于7天 且 isAddBusiness false 才会显示 -->
                            <button v-if="hasPayNoIng && !isAddBusiness" class="btn btn-common revoke-add" @click.prevent="addBusiness"><i class="icrm-refresh"></i>撤销新建</button>
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

                        <div class="add-business-info" v-if="hasPayNoIng && isAddBusiness">本次提交不会关联商机，若需要创建商机，请点击【新建商机】即可。</div>
                        <div class="sub-title" v-else>关联商机<span class="info-text">{{infoText()}}</span></div>
                        <template v-if="!(hasPayNoIng && isAddBusiness) && notShowSale()">

                            <!-- 商机填写项 -->
                            <div class="business-container">
                                <form-item :key="formData.signIntention" prop="signTime">
                                    <ui-vendor-date-picker
                                        v-model="formData.signTime"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="signTimePickerOptions"
                                        :editable="false"
                                        :clearable="false"
                                        placeholder="请选择预计签单时间"
                                        @change="onChangeSignTime">
                                        <span slot="labelPrefix">预计签单时间</span>
                                    </ui-vendor-date-picker>
                                </form-item>
                                <form-item :key="formData.signIntention + 'signMoney'" prop="signMoney">
                                    <ui-input
                                        v-model="formData.signMoney"
                                        placeholder="请输入预计签单金额"
                                        :maxlength="9"
                                        v-customTxt="{reg: '\d'}"
                                        @on-change="recordPoint">
                                            <span slot="labelPrefix">预计签单金额</span>
                                            <i class="text-gray" slot="suffix">元</i>
                                        </ui-input>
                                        <div v-if="signMoneyIsLessThanEstimateValue" class="strong-tips">
                                            <i class="icrm-warn"></i>
                                            <span>金额低于该客户的预估价值（{{pullingCustAmount | numToTenThousand}}w）</span>
                                        </div>
                                </form-item>
                                <!-- 报单灰度范围内 -->
                                <template v-if="isInSalesOrderGrey">
                                    <form-item :key="formData.signIntention + 'returnTime'" prop="returnTime">
                                        <ui-vendor-date-picker
                                            v-model="formData.returnTime"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="returnTimePickerOptions"
                                            :editable="false"
                                            :clearable="false"
                                            placeholder="请选择预计回款时间">
                                            <span slot="labelPrefix">预计回款时间</span>
                                        </ui-vendor-date-picker>
                                    </form-item>
                                    <form-item label="靠谱程度" prop="signOption">
                                        <ui-radio-group v-model="formData.signOption">
                                            <ui-radio label="1">保底</ui-radio>
                                            <ui-radio label="2">洪荒</ui-radio>
                                        </ui-radio-group>
                                    </form-item>
                                </template>
                            </div>
                        </template>
                    </ui-form>
                </div>
            </div>
            <!-- 右侧商机记录 -->
            <div class="content-right">
                <p class="show-record" @click="showRecord">
                    <i :class="[ recordShow ? 'icrm-bossui-icon-right' : 'icrm-bossui-icon-left' ]"></i>
                    <span v-if="recordShow">收起</span>最近商机、任务和跟进记录
                </p>
                <RecentRecord v-model="recordShow" :followList="followModels" :saleList="saleDeclareInfos" :taskList="taskList" :hasUrgentTLTask="hasUrgentTLTask"></RecentRecord>
            </div>
        </div>
        <!-- footer -->
        <div class="follow-add-footer">
            <!-- backFillData.fromClue == 1 -->
            <button class="btn btn-primary" @click.prevent="post()">提交</button>
            <button class="btn btn-primary" @click.prevent="post();addTask()">提交并添加任务</button>
            <template v-if="customerModel.place == 1 && backFillData.followUserRole == 1">
                <button class="btn btn-outline" @click.prevent="addIntoBusiness">提交并加入商机库</button>
                <button class="btn btn-outline" @click.prevent="release">提交并释放客户</button>
            </template>
            <template v-if="customerModel.place == 2 && backFillData.hasHqBusi && backFillData.echoTestUser && backFillData.followUserRole == 1">
                <button class="btn btn-outline">提交并加入优质商机库</button>
                <button class="btn btn-outline">提交并释放客户</button>
            </template>
        </div>
    </div>
</template>
<script>

/** 跟进功能——填写跟进记录 */
import RecentRecord from './components/recent-record.vue';
import addTag from '@/components/business/tag-add/index.vue';
import { formatDate } from '@/utils/tools/utils.js';
import { mapActions, mapState } from 'vuex';
import { debounce } from '@/utils/tools/optimize.js';

export default {
    name: 'customer-follow-up',
    data () {
        return {
            formatDate,
            signIntentionList: [],
            followMethodList: [
                {label: '电话', value: '0'},
                {label: '面谈', value: '1'},
                {label: '微信/QQ等', value: '2'},
            ],
            recordShow: false,
            isSaving: false, // 重复提交
            formData: {
                followTime: '',
                followType: '0',
                contactId: '',
                followNotes: '',
                signIntention: '',
                signTime: '', // 默认设值为今天的T+13天,
                signMoney: '13800',
                returnTime: '', //预计回款时间 灰度  只能选“预计签约日期”及以后的日期，默认填入“预计签约日期”
                signOption: '', //靠谱程度 1 保底 2洪荒
                isAddPlan: '0',
                planFollowTime: '',
                planFollowType: '0',
                planContactId: '',
                planFollowNotes: '',
            },
            ruleData: {
                // followTime: [
                //     {required: true, message: '请选择跟进时间', trigger: 'change'},
                // ],
                contactId: [
                    {required: true, message: '请选择联系人', trigger: 'blur'},
                ],
                followNotes: [
                    {required: true, message: '请填写跟进内容', trigger: 'blur'},
                ],
                signIntention: [
                    {required: true, message: '请选择签单意向', trigger: 'change'},
                ],
                signTime: [
                    {required: true, message: '请选择预计签单时间', trigger: 'change'},
                ],
                returnTime: [
                    {required: true, message: '请选择预计回款时间', trigger: 'change'},
                ],
                signMoney: [
                    {required: true, message: '请输入预计签单金额', trigger: 'change'},
                ],
                followNotes: [
                    {required: true, message: '请填写跟进内容', trigger: 'change'},
                    {min: 1, max: 500, message: '请输入1-500字之间的字符', trigger: 'change'}
                ],
                planFollowNotes: [
                    {min: 0, max: 100, message: '请输入100字内的字符', trigger: 'change'}
                ],
                planFollowTime: [
                    {required: true, message: '请选择联系时间', trigger: 'change'},
                ]
            },
            isInSalesOrderGrey: false, //报单灰度
            pageTime: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            backFillData: {},
            tags: [], //当前客户的标签
            followModels: [],  // 最近跟进记录
            saleDeclareInfos: [],  //最近商机记录
            taskList: [], // 近三条协进任务
            customerModel: {},
            contactList: [], //联系人列表
            isHasPayDeclare: '', // true有应收商机 false 没有
            isHasIngDeclare: '', // true 有进行中商机 false 没有
            saleInfoNum: '', //应收商机数量
            isAddBusiness: true,  //是否新建商机
            tempSignIntention: '',  //销售进程暂时的值
            isHasOrderNotPass: '', //true 有未到期的合同审核通过的订单 false没有
            isLastestPayLE7Days: '', //距离该客户（及其子客户）最近一次到款是否小于等于7天 1代表是 0代表否

            followTimePickerOptions: {
                disabledDate (params) {
                    const now = new Date();
                    return params.getTime() > now.getTime();
                },
            },
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
            planFollowTimePickerOptions: {
                disabledDate (params) {
                    const now = new Date(new Date().toLocaleDateString());
                    return params.getTime() < now.getTime();
                },
            },
            executorIdNotEncrypt: '', // 客户非加密id
            hasUrgentTLTask: false, // 判断是否有紧急tl任务
            pullingCustAmount: 0, // 客户预估本年签约金额
            stayDuration: Date.now(),
        };
    },
    props: {
        menuPrefix: {
            type: String,
            default: '', 
        },
        id: {
            // 客户加密id：f8e0c9e015f39fa03nB82dm1
            tyep: String,
            default: '',
        },
        customerName: {
            // 客户名称：北京尚博信科技有限公司
            type: String,
            default: '',
        },
        contactId: {
            // 联系人加密id：209a6419f009aaad1nR53N21FVZUxw~~
            type: String,
            default: '',
        },
        contactName: {
            // 联系人姓名：张三
            type: String,
            default: '',
        },
        boss: {
            // 是boss还是联系人
            type: [String, Number],
            default: 0, //1为boss
        },
        source: {
            type: [String, Number],
            default: '',
        },
        dataSource: {
            type: [String, Number],
            default: '',
        },
        fromClue: {
            default: '',
        },
        followUserRole: {
            default: '',
        },
        // 自定义参数，
        customerParams: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    computed:{
        ...mapState({
            userGreyCodeList: state => state.user.userGreyCodeList
        }),
        // 0-20 / 丢单
        saleProcess20() {
            return this.formData.signIntention == 0 || this.formData.signIntention == 1 || this.formData.signIntention == 6;
        },
        // 40-80
        saleProcess80() {
            return this.formData.signIntention == 2 || this.formData.signIntention == 3 || this.formData.signIntention == 4;
        },
        // 100% / 已回款
        saleProcess100() {
            return this.formData.signIntention == 5 || this.formData.signIntention == 7;
        },
        // 有进行中商机且销售进程 0-20 / 丢单
        hasIngAnd20() {
            return this.isHasIngDeclare && this.saleProcess20;
        },
        // 有进行中商机且销售进程 40-80
        hasIngAnd80() {
            return this.isHasIngDeclare && this.saleProcess80;
        },
        // 有进行中商机且销售进程 100 / 已回款
        hasIngAnd100() {
            return this.isHasIngDeclare && this.saleProcess100;
        },
        // 应收和进行中商机都没有 且销售进程 0-20 / 丢单
        allNoAnd20() {
            return !this.isHasIngDeclare && !this.isHasPayDeclare && this.saleProcess20;
        },
        // 应收和进行中商机都没有 且销售进程 40-80
        allNoAnd80() {
            return !this.isHasIngDeclare && !this.isHasPayDeclare && this.saleProcess80;
        },
        // 应收和进行中商机都没有 且销售进程 100 / 已回款
        allNoAnd100() {
            return !this.isHasIngDeclare && !this.isHasPayDeclare && this.saleProcess100;
        },
        // 有应收没有进行商机 且销售进程 0-20 / 丢单
        noIngHasPayAndAdd20() {
            return !this.isHasIngDeclare && this.isHasPayDeclare && this.saleProcess20;
        },
        // 有应收没有进行商机 且销售进程 40-80
        noIngHasPayAndAdd80() {
            return !this.isHasIngDeclare && this.isHasPayDeclare && this.saleProcess80;
        },
        // 有应收没有进行商机 且销售进程 100 / 已回款
        noIngHasPayAndAdd100() {
            return !this.isHasIngDeclare && this.isHasPayDeclare && this.saleProcess100;
        },
        // (有应收&&无进行中商机 或者 有未到期的合同审核通过的订单&&无进行中商机) &&  最近一次到款小于等于7天
        hasPayNoIng() {
            return ((this.isHasPayDeclare && !this.isHasIngDeclare) || (this.isHasOrderNotPass && !this.isHasIngDeclare)) && this.isLastestPayLE7Days;
        },
        // 强控价管理灰度
        isPriceManageGrey() {
            return this.userGreyCodeList.includes('10050');
        },
        // 签单金额是否小于预估价值
        signMoneyIsLessThanEstimateValue() {
            return this.isPriceManageGrey && Number(this.formData.signMoney) > 0 && Number(this.formData.signMoney) < this.pullingCustAmount;
        }
    },
    components: {
        RecentRecord,
        addTag
    },
    created () {
        this.getSalesOrderGrey();
        this.getSaleProcessList();
        this.getInitData();
        //获取用户标签
        this.updateUserTagList();
        this.recordPoint = debounce(this.recordPoint, 500);
    },
    methods: {
        recordPoint() {
            // webclick 手动上报
            this.$BossAnalytics.track('WebClick', {
                wc_interface: '添加跟进记录',
                ele_name: '添加跟进记录-预计签单修改金额',
                ele_value: this.formData.signMoney || 0,
                wc_obj_type: 'customer',
                wc_obj_id: this.id,
                money_stay_duration: (Date.now() - this.stayDuration) / 1000
            });
            this.stayDuration = Date.now();
        },
        //获取销售进程的列表
        getSaleProcessList() {
            this.$ajax({
                url: '/customer/follow/signIntentions',
                // url: 'https://api.weizhipin.com/mock/175/customer/follow/signIntentions',
                params: {
                    customerId: this.id
                }
            }).then(({code, data}) => {
                if(code == 1) {
                    this.signIntentionList = data.signIntentions || [];
                };
            });
        },
        getTaskList() {
            this.$ajax({
                url: `/customer/${this.menuPrefix}/follow/mission/list.json`,
                // url: 'https://api.weizhipin.com/mock/175/customer/{menuPrefix}/follow/mission/list.json',
                params: {
                    customerId: this.id,
                    page: 1,
                    pageSize: 3
                }
            }).then(({code, data}) => {
                if(code == 1) {
                    this.taskList = (data?.list || []).map((item, index) => {
                        return {
                            ...item,
                            expand: index == 0 ? (this.hasUrgentTLTask ? true : false) : false
                        };
                    });
                };
            });
        },
        addTask () {
            // TODO  添加任务
            this.$addTask({
                batchId: [{id: this.id, name: this.customerName}],
                defaultMissionType: 3,
                from: 12,
                executorId: this.backFillData.encryptUserId || '',
                cb: ()=>{
                    console.error('关闭了');
                }}
            );
            this.$trackEvent({
                action: 'crm-addTask',
                p1: 8,
                p2: this.executorIdNotEncrypt, // 非加密客户id
                p12: this.customerParams.actionp12 || ''
            });
        },
        ...mapActions('common', ['updateUserTagList']),
        onChangeSignTime (val) {
            if(val) {
                this.formData.returnTime = val;
                this.returnTimePickerOptions.disabledDate = (params) => {
                    const start = new Date(new Date(val).toLocaleDateString());
                    return params.getTime() < start.getTime();
                };
            };
        },
        getSalesOrderGrey () {
            this.$ajax({
                method: 'GET',
                url: '/saleDeclare/864declare/isInGrey',
            }).then(({code, data}) => {
                if(code == 1 && data == true) {
                    this.isInSalesOrderGrey = true;
                };
            });
        },
        getInitData () {
            this.$ajax({
                url: '/customer/follow',
                method: 'GET',
                params: {
                    id: this.id,
                    customerName: this.customerName,
                    contactId: this.contactId,
                    contactName: this.contactName,
                    source: this.source,
                    dataSource: this.dataSource,
                    followUserRole: this.followUserRole,
                    fromClue: this.fromClue,
                    boss: this.boss,
                },
            }).then(({code, data}) => {
                if(code == 1) {
                    this.backFillData = data;
                    this.executorIdNotEncrypt = data.customerId;
                    this.followModels = (data.followModels || []).map(item => {  //最近跟进记录
                        return {
                            ...item,
                            expand: false
                        };
                    });
                    this.saleDeclareInfos = (data.saleDeclareInfos || []).map(item => {  //最近商机记录
                        return {
                            ...item,
                            expand: false
                        };
                    });
                    this.hasUrgentTLTask = data?.hasUrgentTLTask || false;
                    this.getTaskList();
                    this.customerModel = data.customerModel;
                    this.isHasPayDeclare = data.isHasPayDeclare == 1 ? true : false; //应收商机
                    this.isHasIngDeclare = data.isHasIngDeclare == 1 ? true : false;  //进行中商机
                    this.saleInfoNum = data.saleInfoNum || 0;  //应收商机
                    this.isHasOrderNotPass = data.isHasOrderNotPass == 1 ? true : false;  //未到期的合同审核通过的订单
                    this.isLastestPayLE7Days = data.isLastestPayLE7Days == 1 ? true : false;  // 距离该客户（及其子客户）最近一次到款是否小于等于7天 1代表是 0代表否

                    // 默认回填当前跟进的联系人
                    this.formData.contactId = data.contactId; //默认的contactId
                    let hasCurContactId = data.contactList.filter(item => item.id == data.contactId).length;
                    this.contactList = hasCurContactId ? data.contactList : [{name: data.contactName, id: data.contactId}].concat(data.contactList || []);

                    this.formData.followTime = data.followTime ? this.formatDate(new Date(data.followTime), 'yyyy-MM-dd HH:mm') : ''; //回写跟进时间

                    // 回填5大信息
                    this.formData.signIntention = typeof data.signIntention == 'number' && data.signIntention >= 0 ? '' + data.signIntention : '';
                    this.tempSignIntention = this.formData.signIntention;  //暂存销售进程
                    // this.formData.signTime = data.signTime > 0 ? this.formatDate(new Date(data.signTime), 'yyyy-MM-DD') : this.formatDate(new Date(new Date().setDate(new Date().getDate() + 13)), 'yyyy-MM-DD');
                    // this.formData.signMoney = data.signMoney ? String(data.signMoney).replace(/\..*/g, '') : '13800';
                    // this.formData.returnTime = data.returnTime > 0 ? this.formatDate(new Date(data.returnTime), 'yyyy-MM-DD') : this.formatDate(new Date(new Date().setDate(new Date().getDate() + 13)), 'yyyy-MM-DD');
                    this.formData.signOption = data.signOption == 1 || data.signOption == 2 ? String(data.signOption) : '';
                    this.formData.signTime = data.signTime > 0 ? this.formatDate(new Date(data.signTime), 'yyyy-MM-DD') : '';
                    this.formData.returnTime = data.returnTime > 0 ? this.formatDate(new Date(data.returnTime), 'yyyy-MM-DD') : '';
                    this.formData.signMoney = data.signMoney > 0 ? String(data.signMoney).replace(/\..*/g, '') : '';
                    // 设置日期
                    // this.setTime(data);
                    // 预计回款时间 灰度  只能选“预计签约日期”及以后的日期
                    if(data.signTime > 0) {
                        this.returnTimePickerOptions.disabledDate = (params) => {
                            const start = new Date(new Date(data.signTime).toLocaleDateString());
                            return params.getTime() < start.getTime();
                        };
                    };
                    this.tags = data.tags || [];
                    this.pullingCustAmount = Number(data?.pullingCustAmount || 0);
                }
            });
        },
        /**
         * 前置校验加埋点
         * p2埋点含义: 1. 客户详情；2.继续添加商机库 （原确定添加）3.联系客户 4.右上角叉号
         */
        beforeAddCheckBuriedPoint({ type, echoAllocateAllId, id, p2 }) {
            const actionNameMap = {
                0: 'crm-busiBlock', // crm-商机库低质拦截
                1: 'crm-busiBlock-confirm', // crm-商机库低质拦截-确认添加
            };
            const trackParams = {
                action: actionNameMap[type],
                p1: echoAllocateAllId, // actionp-派单id
                target: id, // 客户id
                uid: this.$store.state.user.userInfo.encryptUserId, // 销售id
                date_time: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'), // 点击时间
            };
            if (p2) {
                trackParams.p2 = p2;
            }
            this.$trackEvent(trackParams);
        },
        beforeAddCheck(id) {
            const vm = this;
            return new Promise((resolve, reject) => {
                vm.$ajax({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    url: '/customer/checkToBusi',
                    // url: 'https://api.weizhipin.com/mock/175/customer/checkToBusi',
                    params: {
                        id,
                        signIntention: vm.formData.signIntention, // 用户选择的销售进程
                        followNotes: vm.formData.followNotes, // 用户填写的跟进记录
                    }
                }).then(({ code, data }) => {
                    if (code === 1) {
                        // echoAllocateAllId 派单ID
                        const { message, warn, echoAllocateAllId, customerEncryptId, customerName, recommendType, qualityType } = data;
                        if (warn) {
                            // 触发时
                            vm.beforeAddCheckBuriedPoint({ type: 0, echoAllocateAllId, id });
                            // 不推荐-仍使用原来的弹窗
                            if (recommendType === 0) {
                                vm.$dialog({
                                    title: '温馨提示',
                                    content: message,
                                    type: 'warning',
                                    cancelText: '确认添加',
                                    confirmText: '我再想想',
                                    onConfirm() {
                                        reject();
                                    },
                                    onClose() {
                                        reject();
                                    },
                                    onCancel() {
                                        // 确认时
                                        vm.beforeAddCheckBuriedPoint({ type: 1, echoAllocateAllId, id });
                                        vm.post(1);
                                    },
                                });
                            } else {
                                // 使用新弹窗
                                vm.$lowCustomer({
                                    dialogInfo: {
                                        customerName, //客户名称
                                        recommendType, //0 不推荐 1 文案一 2 文案二
                                        qualityType, //1 高质 2 中质
                                    },
                                    // 查看客户详情
                                    onSeeCustomer: () => {
                                        // 提交跟进记录
                                        this.post(undefined, false);
                                        vm.$toast({ content: `${this.customerName}客户下填写的跟进记录已保存，请放心跟进当前客户。` });
                                        setTimeout(() => {
                                            vm.beforeAddCheckBuriedPoint({ type: 1, echoAllocateAllId, id, p2: 3 });
                                            // 新版本查看客户详情
                                            vm.$seeCustomer({
                                                menuPrefix: 'my',
                                                customerId: customerEncryptId,
                                            });
                                        }, 1500);
                                    },
                                    // 继续添加
                                    onContinue() {
                                        // 确认时
                                        vm.beforeAddCheckBuriedPoint({ type: 1, echoAllocateAllId, id, p2: 2 });
                                        vm.post(1);
                                    },
                                    // 关闭
                                    onClose() {
                                        reject();
                                        vm.beforeAddCheckBuriedPoint({ type: 1, echoAllocateAllId, id, p2: 4 });
                                    },
                                });
                            }
                        } else {
                            resolve();
                        }
                    } else {
                        reject();
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        },
        addIntoBusiness () {
            let vm = this;
            vm.beforeAddCheck(this.id).then(() => {
                vm.$dialog({
                    title: '温馨提示',
                    content: `是否将 <i class="text-primary">${ vm.customerName }</i> 加入商机库？`,
                    type: 'warning',
                    closeText: ' ',
                    userHtmlString: true,
                    onConfirm (wrap) {
                        vm.post(1);
                    },
                });
            }).catch(() => {});
        },
        release () {
            let vm = this;
            vm.$dialog({
                title: '温馨提示',
                content: `确定要释放 <i class="text-primary">${ vm.customerName }</i> 吗？`,
                type: 'warning',
                closeText: ' ',
                userHtmlString: true,
                onConfirm (wrap) {
                    vm.post(2);
                },
            });
        },
        addIntoGoodBusiness () {
            vm.post(3);
        },
        post (extOp, isShowToast = true) {
            this.$refs?.['form']?.validate((valid=true) => {
                console.log(this.formData);
                if(!valid) return false;
                if (!this.formData.followTime) {
                    this.$toast({
                        type: 'error',
                        content: '请选择跟进时间'
                    });
                    return false;
                }
                let params = JSON.parse(JSON.stringify(this.formData));

                // 不展示商机选项时去除多余的字段
                if(!(!(this.hasPayNoIng && this.isAddBusiness) && this.notShowSale())) {
                    delete params.signTime;
                    delete params.signMoney;
                    delete params.returnTime;
                    delete params.signOption;
                };
                //不在报单灰度内
                if(!this.isInSalesOrderGrey) {
                    delete params.returnTime;
                    delete params.signOption;
                };

                // 未添加联系计划
                if(params.isAddPlan == 0) {
                    delete params.planFollowTime;
                    delete params.planContactId;
                    delete params.planFollowType;
                    delete params.planFollowNotes;
                };

                let baseParams = {
                    customerId: this.backFillData.customerId,
                    source: this.backFillData.source,
                    dataSource: this.backFillData.dataSource,
                    followUserRole: this.backFillData.followUserRole,
                    pageTime: this.pageTime,
                    riskCustomer: this.backFillData.riskCustomer,
                    isAddDeclare: this.hasPayNoIng && this.isAddBusiness ? 1 : 0  //没点新建商机传1，其他情况传0
                };

                if(extOp) {
                    baseParams.extOp = extOp;
                };
                if(this.isSaving) {
                    return flase;
                };
                this.isSaving = true;


                this.$ajax({
                    url: '/customer/follow/save',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        ...params,
                        ...baseParams,
                    },
                }).then(({code, message}) => {
                    if(code == 1) {
                        if (isShowToast) {
                            this.$toast({
                                type: 'success',
                                content: message,
                            });
                        }
                        this.$emit('onCompleteFollowing');
                    } else {
                        this.isSaving = false;
                    };
                }, () => {
                    this.isSaving = false;
                });
            });
        },
        // 展示最近的记录弹窗
        showRecord() {
            this.recordShow = !this.recordShow;
        },
        // 显示隐藏商机
        addBusiness() {
            this.isAddBusiness = !this.isAddBusiness;
            this.formData.signIntention = this.isAddBusiness ? this.tempSignIntention : '2';
        },
        // 关联商机文案
        infoText() {
            if (this.hasIngAnd20) {
                return '（关联的进行中商机将在本次提交后关闭）';
            } else if (this.hasIngAnd80) {
                return '（关联的进行中商机将在本次提交后更新时间和金额）';
            } else if (this.allNoAnd20 || this.noIngHasPayAndAdd20 || this.allNoAnd100 || this.noIngHasPayAndAdd100) {
                return '（本次提交将不会生成商机）';
            } else if (this.allNoAnd80 || this.noIngHasPayAndAdd80) {
                return '（本次提交后，客户下将生成一个新的商机）';
            } else if (this.hasIngAnd100) {
                return '（本次提交将不影响商机信息）';
            }
            else {
                return '';
            }
        },
        // 不展示商机选填项
        notShowSale() {
            if( this.hasIngAnd20 || this.allNoAnd20 || this.noIngHasPayAndAdd20 || this.hasIngAnd100 || this.allNoAnd100 || this.noIngHasPayAndAdd100) {
                return false;
            } else {
                return true;
            }

        },
        // 若预计签单时间 或者 预计回款时间 ＜当前时间，则该时间设置为空
        setTime(data) {
            const dayAdd = this.formatDate(new Date(new Date().setDate(new Date().getDate() + 13)), 'yyyy-MM-DD');
            const now = new Date().getTime(); //当天时间戳
            if (data.signTime > 0) {
                this.formData.signTime = data.signTime < now ? '' : this.formatDate(new Date(data.signTime), 'yyyy-MM-DD');
            } else {
                this.formData.signTime = dayAdd;
            }
            if (data.returnTime > 0) {
                this.formData.returnTime = data.returnTime < now ? '' : this.formatDate(new Date(data.returnTime), 'yyyy-MM-DD');
            } else {
                this.formData.returnTime = dayAdd;
            }
        }
    }
};
</script>
<style lang="less">
.customer-follow-up-record {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    color: #414A60;
    overflow-y: auto;
    overflow-x: hidden;
    .el-input__inner, .ui-select-selection, textarea {
        // border: 1px solid #DBDFE6;
        border-radius: 4px;
    }

    .follow-title {
        padding: 18px 16px 13px 16px;
        h2 {
            font-size: 16px;
            line-height: 22px;
        }
    }
    .info-container {
        padding: 0 16px;
        line-height: 37px;
        .info-item {
            display: inline-block;
            &:not(:first-child) {
                margin-left: 24px;
                .ui-select {
                    width: auto;
                    min-width: 160px;
                }
                .el-date-editor {
                    width: 240px;
                }
            }
            .customer-name {
                display: inline-block;
                position: relative;
                padding-right: 30px;
                max-width: 478px;
                ._tooltip-box {
                    display: inline-block;
                    vertical-align: top;
                }
                .icon-slip-identification {
                    position: absolute;
                    right: 0;
                    top: 10px;
                    margin-left: 6px;
                }
            }
        }
    }
    .follow-content {
        display: flex;
        flex: 1;
        // height: calc(~"100vh - 146px");
        padding: 26px 0 0 16px;
        overflow-y: auto;
        .content-left {
            flex: 11;
            padding-right: 16px;
            .follow-add {
                padding-bottom: 20px;
                .input-wrap-textarea, .input-wrap {
                    min-width: auto;
                    width: 100%;
                }
                .ui-select, .el-date-editor  {
                    width: 100%;
                }
                .ui-switch {
                    width: 42px;
                    height: 22px;
                    background: #DBDFE6;
                    border: 1px solid #DBDFE6;
                    &::after {
                        width: 18px;
                        height: 18px;
                    }
                }
                .ui-switch-checked {
                    border-color: #0CC3BC;
                    background-color: #0CC3BC;
                }
                .plan-style {
                    display: inline-block;
                    margin-right: 10px;
                    vertical-align: text-top;
                }
                .pr-22 {
                    margin-bottom: 8px;
                    .item-content {
                        padding-right: 25px;
                        .popover {
                           position: absolute;
                            right: 0;
                            color: #c0c4cc;
                        }
                    }

                }
                .form-item-error {
                    margin-bottom: 24px;
                }

                .sale-select-container {
                    .item-content {
                        padding-right: 124px;
                        font-size: 0;
                        .btn-common {
                            position: absolute;
                            right: 25px;
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-size: 13px;
                        }
                        .add-business {
                            font-weight: 600;
                            border: 1px solid #00BEBD;
                            color: #00BEBD;
                            i {
                                margin-right: 3px;
                                font-weight: normal;
                                // font-size: 15px;
                            }
                        }
                        .revoke-add {
                            padding: 3px 8px;
                            font-weight: 400;
                            border: 1px solid #CDD0D6;
                            color: #414A60;
                            i {
                                transform: scale(0.9);
                                font-size: 12px;
                                margin-right: 6px;
                            }
                        }
                    }
                }
                .business-container {
                    margin-bottom: 24px;
                    padding: 16px;
                    background-color: #F7F8FB;
                    border-radius: 8px;
                    & .form-item:last-child {
                        margin-bottom: 0;
                    }
                    .strong-tips {
                        display: flex;
                        align-items: center;
                        height: 32px;
                        margin-top: 8px;
                        padding: 6px 12px;
                        background: #FFEFE0;
                        border-radius: 4px;
                        font-size: 12px;
                        .icrm-warn {
                            color: #F77233;
                            margin-right: 4px;
                        }
                    }
                }
                .add-business-info {
                    margin: 0 0 25px 0;
                    color: #C8C9CC;
                    font-weight: 400;
                }
                .follow-plan-container {
                    & >.form-item:first-child {
                        margin-bottom: 8px;
                    }
                    .follow-plan-item {
                        padding: 16px;
                        background: #F7F8FB;
                        border-radius: 8px;
                    }
                }
            }
        }
        .content-right {
            position: relative;
            flex: 9;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: 16px;
            .show-record {
                line-height: 16px;
                float: right;
                color: #00BEBD;
                cursor: pointer;
                i {
                    font-size: 14px;
                }
            }
        }
        .sub-title {
            position: relative;
            margin-bottom: 8px;
            padding-left: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #414A60;
            line-height: 20px;
            color: #414A60;
            &::before {
                content: "";
                position: absolute;
                width: 3px;
                height: 12px;
                top: 4px;
                bottom: 4px;
                left: 0;
                background-color: #0CC3BC;
                border-radius: 0px 100px 100px 0px;
            }
            .info-text {
                color: #C8C9CC;
                font-weight: 400;
                font-size: 13px;
            }
        }
    }
    .follow-add-footer {
        width: 100%;
        height: 56px;
        padding: 12px 0 12px 16px;
        border-top: 1px solid #EAECEF;
        background: #fff;
        z-index: 1;
        .btn {
            font-size: 14px;
            border-radius: 4px;
            line-height: 18px;
            margin-right: 8px;
        }
        .btn-primary {
            background-color: #00BEBD;
            padding: 6px 27px;
        }
        .btn-outline {
            padding: 6px 15px;
            color: #00BEBD;
            border: 1px solid #00BEBD;
        }
    }
}
</style>
