<template>
    <div v-if="showDialog">
        <ui-dialog
            v-model="showDialog"
            :wrapClass="'_page-task-management-add-dialog'"
            :showFooter="false"
            preventConfirm
            lock
            preventLayer
            @on-close="cancel">
            <!-- <div slot="title">
                <span v-if="batchId">{{batchId.length>1 ? '批量添加跟进任务':'添加任务跟进'}}</span>
                <span v-else>{{data?'编辑任务':'新建任务'}}</span>
            </div> -->
            <div slot="title">
                <ui-dropmenu v-if="!data" ref="changeDropmenu">
                    <span class="font-bold dropmenu-title">{{(tabs[tabNum] || {}).missionTypeName}}</span>
                    <ul slot="options">
                        <li v-for="(item, index) in tabs" :key="index" @click="changeTab(item, index)" :class="{active: tabNum == index}">
                            <p class="name">{{(item || {}).missionTypeName}}</p>
                            <p class="tip">{{item.description}}</p>
                        </li>
                    </ul>
                </ui-dropmenu>
            </div>
            <div slot="content">
                <div class="data-content-inner new-scrollBar-width-10">
                    <div class="task-contain">
                        <div class="left">
                            <ui-form ref="taskForm" :labelPosition="'top'" :model="formData" :rules="ruleData" class="form-data-box">
                                <p class="item-titel">任务描述</p>
                                <!-- 任务类型为TL协进任务时 需必填 -->
                                <div class="form-data mission-name-no-label" :class="{'required-red': descriptionIsRequired}">
                                    <form-item prop="description" class="task-name-item mission-name" label=" ">
                                        <ui-input v-model="formData.description" ref="textarea" type="textarea" :rows="4" :resize="'none'" :counter="true" :placeholder="missTypeIsTlTask ? '请输入任务描述（必填）': '请输入任务描述（非必填）'"></ui-input>
                                    </form-item>
                                    <div class="upload-operation-box">
                                        <!-- 请上传word/excel/ppt/pd -->
                                        <div class="operation-li" @click="focusinput">
                                            <ui-upload  ref="upload" multiple custom exname=".pdf.jpg.png.xls.xlsx.doc.docx.pptx.jpeg.rar.zip"
                                                :uploadedNum="formData.attachments.length"
                                                action="/file/upload.json?biz=MISSION"
                                                filesizeUnit="M"
                                                :filesize="10"
                                                :total="5"
                                                @uploadStart="uploadStart"
                                                @uploadProgress="uploadProgress"
                                                @uploadEnd="uploadEnd">
                                                <div class="album-upd-box">
                                                    <ui-tooltip2 effect="dark" placement="top-start" offset="10">
                                                        <span class="icrm-attachment" @click.stop="$refs.upload.mockClick()"></span>
                                                        <div class="supplement" slot="content">
                                                            附件上传，大小不超过10M
                                                        </div>
                                                    </ui-tooltip2>
                                                </div>
                                            </ui-upload>
                                        </div>
                                    </div>
                                </div>
                                <!-- 放附件 -->
                                <div class="upload-operation-list" v-if="(formData.attachments || []).length">
                                    <p class="item-title">上传附件<span class="file-upload-tip">格式支持：pdf、docx、xlsx、pptx、jpg、png、jpeg、rar、zip文件，最多可上传5个</span></p>
                                    <Preview :attachments="formData.attachments" :showDelete="true" @deleteImg="deletImg" :needPreview="false"></Preview>
                                </div>
                                <div class="inline-item-box">
                                    <form-item label="截止时间" prop="deadLine" class="inline-item">
                                        <ui-vendor-date-picker
                                            :clearable="false"
                                            :editable="false"
                                            :picker-options="pickerOptions"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            :value-format="'yyyy-MM-dd'"
                                            v-model="formData.deadLine"
                                            placeholder="选择日期">
                                        </ui-vendor-date-picker>
                                    </form-item>
                                    <form-item label=" " prop="deadLineTime" class="inline-item">
                                        <ui-vendor-time-select
                                            :clearable="false"
                                            :editable="false"
                                            v-model="formData.deadLineTime"
                                            :picker-options="{
                                                start: '00:00',
                                                step: '00:30',
                                                end: '23:30'
                                            }"
                                            placeholder="选择时间">
                                        </ui-vendor-time-select>
                                    </form-item>
                                    <form-item label="优先级" required class="inline-item">
                                        <ui-select2 v-model="formData.priority" :transfer="true" :transferClassName="'transfer-formData-priority'">
                                            <ui-option2 v-for="(item,index) in priorityList" :value="item.code"
                                                :key="item.code + index">{{item.name}}</ui-option2>
                                        </ui-select2>
                                    </form-item>
                                </div>
                                <div class="pannel-collapse">
                                    <dl :class="{expanded: expanded}">
                                        <dt @click="toggleAccordion"><span :class="{'font-bold': expanded}">更多信息</span><span class="fr">{{expanded? '收起' : '展开'}}</span></dt>
                                        <dd class="more-option">
                                            <div>
                                                <!-- 批量 我的客户/商机库 -->
                                                <template v-if="batchId && batchId.length">
                                                    <form-item label="关联客户" key="customerId" class="select-customer-company" v-if="batchId && batchId.length && batchId.length == 1">
                                                        <ui-select2 clearable v-model="formData.customerId" placeholder="请选择关联客户" @on-query-change="changeCustomerId"  :class="[{'disabled-pointer':true}]" :disabled="true" :transfer="true" :transferClassName="'transfer-associated-customer'" class="associated-customer">
                                                            <ui-option2 v-for="(item,index) in customerList" :value="item.customerId" :key="index">{{item.customerName}}</ui-option2>
                                                        </ui-select2>
                                                    </form-item>
                                                    <form-item label=" " prop="contactId" class="select-customer-company-contact" v-if="batchId && batchId.length && batchId.length == 1">
                                                        <ui-select2 filterable clearable :disabled="!formData.customerId" v-model="formData.contactId" placeholder="请选择联系人" @on-change="changeContactId" :transfer="true" :transferClassName="'transfer-remind-type'" class="remind-type">
                                                            <ui-option2 v-for="(item,index) in contactList" :value="item.contactId" :key="index" v-show="item.contactName">{{item.contactName}}</ui-option2>
                                                        </ui-select2>
                                                    </form-item>
                                                </template>
                                                <template v-else>
                                                    <template v-if="formData.missionTypeId == 2 || formData.missionTypeId == 3 || formData.missionTypeId == 4" >
                                                        <!-- 添加任务不是普通任务 -->
                                                        <form-item class="select-customer-company" label="关联客户" key="iscustomerId1" prop="customerId">
                                                            <ui-select2 class="associated-customer" filterable clearable v-model="formData.customerId" placeholder="请选择关联客户" @on-query-change="changeCustomerId"  key="customerIddada" :disabled="((!!data && formData.missionTypeId !==1) ? true:false) || disabledCustomerId" :transfer="true" :transferClassName="'transfer-associated-customer'">
                                                                <ui-option2 v-for="(item,index) in customerList" :value="item.customerId" :key="index">{{item.customerName}}</ui-option2>
                                                            </ui-select2>
                                                        </form-item>
                                                        <form-item label=" " prop="contactId" class="select-customer-company-contact">
                                                            <ui-select2 filterable clearable v-model="formData.contactId" placeholder="请选择联系人" @on-change="changeContactId"  key="contactIdhhaha" :transfer="true" :transferClassName="'transfer-remind-type'" class="remind-type">
                                                                <ui-option2 v-for="(item,index) in contactList" :value="item.contactId" :key="index">{{item.contactName}} </ui-option2>
                                                            </ui-select2>
                                                        </form-item>
                                                    </template>
                                                    <template v-else>
                                                        <!-- 添加任务是普通任务 -->
                                                        <form-item class="select-customer-company" label="关联客户" key="iscustomerId" prop="customerId">
                                                            <ui-select2 class="associated-customer" filterable clearable v-model="formData.customerId" placeholder="请选择关联客户" @on-query-change="changeCustomerId"  key="customerIddada111" :disabled="((!!data && formData.missionTypeId !==1) ? true:false) || disabledCustomerId" :transfer="true" :transferClassName="'transfer-associated-customer'">
                                                                <ui-option2 v-for="(item,index) in customerList" :value="item.customerId" :key="index">{{item.customerName}}</ui-option2>
                                                            </ui-select2>
                                                        </form-item>
                                                        <form-item label=" " prop="contactId" class="select-customer-company-contact">
                                                            <ui-select2  filterable clearable v-model="formData.contactId" placeholder="请选择联系人" @on-change="changeContactId"  key="contactIdhhaha" :transfer="true" :transferClassName="'transfer-remind-type'" class="remind-type">
                                                                <ui-option2 v-for="(item,index) in contactList" :value="item.contactId" :key="index">{{item.contactName}} </ui-option2>
                                                            </ui-select2>
                                                        </form-item>
                                                    </template>
                                                </template>
                                            </div>
                                            <div class="executorId-line">
                                                <form-item prop="executorId" label="执行人" :class="[{'disabled-pointer':isExecutorValid || !!data}]">
                                                    <ui-select2
                                                        v-if="!isLoading"
                                                        :disabled="isExecutorValid || (data? true:false)"
                                                        class="choose-executor"
                                                        filterable
                                                        v-model="formData.executorId"
                                                        placeholder="请选择执行人"
                                                        :transfer="true"
                                                        :transferClassName="'transfer-choose-executor'">
                                                        <ui-option2 v-for="item in executorList" :value="item.userId" :key="item.userId">{{item.userName}}</ui-option2>
                                                    </ui-select2>
                                                </form-item>
                                                <form-item label="任务提醒" prop="remindType">
                                                    <ui-select2 v-if="!isLoading" v-model="formData.remindType" placeholder="请选择任务提醒" :transfer="true" :transferClassName="'transfer-remind-type'" class="remind-type">
                                                        <ui-option2 v-for="item in remindList" :value="item.code" :key="item.code">{{item.name}}</ui-option2>
                                                    </ui-select2>
                                                </form-item>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                                <!-- 任务类型为 “tl协进任务” 不展示 -->
                                <form-item v-if="!missTypeIsTlTask" label=" " class="no-label">
                                    <span class="info">
                                        任务同步到跟进记录
                                        <ui-tooltip2>
                                            <i class="icrm-info-tooltip"></i>
                                            <p slot="content">启用后任务内容会同步显示到跟进记录，便于查看、检查任务</p>
                                        </ui-tooltip2>
                                    </span><ui-switch v-model="formData.followRecord" :disabled="cannotEdit"></ui-switch>
                                </form-item>
                                <form-item label=" " class="no-label">
                                    <span class="info">
                                        任务完成通知
                                        <ui-tooltip2>
                                            <i class="icrm-info-tooltip"></i>
                                            <p slot="content">任务完成后会收到系统通知，便于检查任务完成情况</p>
                                        </ui-tooltip2>
                                    </span><ui-switch v-model="formData.taskComplete"></ui-switch>
                                </form-item>
                            </ui-form>
                        </div>
                        <div class="right" v-if="batchId && batchId.length && batchId.length !== 1">
                            <p class="item-title">关联客户</p>
                            <p v-for="(item,index) in batchId" :key="index" class="my-customer-li">
                                <dots :txt="item.name"></dots>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="footer-box">
                    <button class="btn" @click="cancel">取消</button>
                    <button class="btn btn-primary" @click.prevent="save('taskForm')">提交</button>
                </div>
            </div>
        </ui-dialog>
    </div>


</template>

<script>

import {formatDate} from '@/utils/tools/utils.js';
import Preview from '@/components/feature/upload-module-new/preview.vue';
import {mapState} from 'vuex';

let formData = {
    scene: '0',
    priority: 30,
    remindType: 2,
    attachments: [],
    deadLine: formatDate(new Date(), 'YYYY-MM-DD'),
    deadLineTime: '20:00',
    executorId: '',
    customerId: '',
    contactId: '',
    description: '',
    contactType: '',
    followRecord: false,
    taskComplete: false,
    missionTypeId: ''
};
export default {
    name: 'page-task-management-add-dialog',
    data () {
        return {
            showDialog: true,
            formatDate: formatDate,
            more: false,
            tabNum: 0,
            // tabNum2: 0,
            executorList: [], // 执行人下拉
            contactList: [], //联系人下拉
            customerList: [], // 客户下拉
            priorityList: [], // 优先级下拉
            remindList: [], //提醒下拉
            formData: JSON.parse(JSON.stringify(formData)),
            ruleData: {
                // missionName: [
                //     {required: true, message: '任务名称不能为空', trigger: 'change'},
                //     {min: 1, max: 20, message: '任务名称最多不超过20字', trigger: 'change'}
                // ],
                deadLine:[
                    { required: true, message: '请选择'},
                    { validator: this.valideDeadLineTime, trigger: 'change'},
                ],
                deadLineTime:[
                    { required: true, message: '请选择时间'},
                    { validator: this.valideDeadLineTime, trigger: 'change'},
                ],
                priority: [{required: true, message: '请选择', trigger: 'change'}],
                remindType: [{required: true, type: 'number', message: '请选择', trigger: 'change'}],
                executorId: [{required: true, message: '请选择', trigger: 'change'}],
                description: [
                    { validator: this.valideDescription, trigger: 'change'},
                    { min: 0, max: 500, message: '请输入不大于500个字符', trigger: 'change'},
                ]
            },
            upload: {
                progress: 0,
                progressShow: false,
                uploadEndStatus: true
            },
            tabs: [],
            pickerOptions: {
                shortcuts: false,
                disabledDate(params) {
                    return params.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            },
            isExecutorValid: false,
            customerName: '',
            enterStamp: Date.now() || 0,
            isRepeatNameId: '',
            isLoading: false,
            expanded: false,
            cannotEdit: false,
            isSubmitting: false,
            descriptionIsRequired: false // 控制自定义div必填border样式
        };
    },
    components:{
        // imageList,
        Preview
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: null,
        },
        batchId: {
            type: Array,
            default: null,
        },
        defaultMissionName: { // 任务名称默认名字
            type: Object,
            default: ()=>{
                return {};
            }
        },
        defaultCustomerList: { //  关联客户默认列表
            type: Array,
            default: () => [],
        },
        disabledCustomerId: { // 是否可选择关联客户
            type: Boolean,
            default: false
        },
        defaultMissionType: { // 默认选中的任务类型， 非必传
            type: [String, Number],
            default: ''
        },
        submitParams: {
            type: Object,
            default: ()=>{
                return {};
            }
        },
        from: {
            type: [String, Number],
            default: ''
        },
        executorId: { // 默认执行人
            type: String,
            default: ''
        },
        defaultContact: {
            type: Object,
            default: () => {
                return {};
            }
        },
        expandMore: {
            type: Boolean, // 是否默认展开更多
            default: false
        }
    },
    computed: {
        ...mapState({
            tl:  state => state.user.userInfo.tl,
            zj:  state => state.user.userInfo.zj,
            cm:  state => state.user.userInfo.cm

        }),
        // 是否 TL、总监、城主 (两个总监 4个TL， 一个城主)， 是的话默认在tl协进任务
        isTl() {
            return this.tl == 1 || this.zj == 1 || this.cm == 1;
        },
        missTypeIsTlTask() { // 当前是否定位在tl协进任务
            return this.formData.missionTypeId == 120;
        }
    },
    watch: {
        value: {
            handler (val) {
                this.showDialog = val;
                this.expanded = this.expandMore;
                if (val) {
                    this.initForm();
                    this.init();
                    this.$set(this.formData);
                } else {
                    // 重置表单
                    this.resetDialog();
                }
            },
            immediate: true
        },
        'formData.customerId': {
            immediate: true,
            deep: true,
            handler (nv) {
                if(nv){
                    this.getContactList();
                }

            }
        },
        expandMore: {
            handler (val) {
                this.expanded = !!val;
            },
            immediate: true
        }
    },
    methods : {
        resetStatus () {
            this.formData.followRecord = true;
            this.formData.taskComplete = true;
        },
        resetData () {
            this.more = false;
            this.tabNum = 0 ;
            // tabNum2: 0
            this.formData = JSON.parse(JSON.stringify(formData));
            this.executorList = []; // 执行人下拉
            this.contactList = []; //联系人下拉
            this.customerList = []; // 客户下拉
            this.priorityList = []; // 优先级下拉
            this.remindList = []; //提醒下拉
            this.upload = {
                progress: 0,
                progressShow: false,
                uploadEndStatus: true
            };
            this.tabs = [];
            this.isExecutorValid = false;
            this.customerName = '';
            this.enterStamp = Date.now() || 0;
            this.isRepeatNameId = '';
            this.isLoading = false;
            this.expanded = false;
        },
        focusinput () {
            this.$refs.textarea.$el.querySelectorAll('.input')[0].focus();
        },
        resetDialog () {
            this.expanded = false;
            this.formData = JSON.parse(JSON.stringify(formData));
        },
        initForm () {
            this.formData.customerId =  this.data && this.data.customerId || '';
            this.formData.deadLine = this.formatDate(new Date(), 'yyyy-MM-dd');
            // this.formData.deadLineTime = this.formatDate(new Date(), 'hh:mm');

            if(this.data){
                setTimeout(()=>{
                    // 创建场景 0 任务页面创建  1 客户页面创建
                    this.formData.scene = '0';
                    this.formData.missionTypeId = this.data.missionTypeId;
                    this.formData.missionName = this.data.missionName;
                    this.formData.executorId = this.data.executorId;
                    this.formData.priority = this.data.priority;
                    let str = (this.data.deadLine || '').replace(/-/g, '/');
                    this.formData.deadLine = this.formatDate(new Date(str), 'yyyy-MM-dd');
                    this.formData.deadLineTime = this.formatDate(new Date(str), 'hh:mm');
                    this.formData.remindType = this.data.remindType;
                    this.formData.contactType = this.data.contactType;
                    this.formData.description = this.data.description;
                    this.formData.attachments = this.data.attachments || [];
                    this.formData.contactId = this.data.contactId;
                    this.formData.followRecord = !!this.data.toCustomerFollow;
                    this.formData.taskComplete = !!this.data.completeNotify;
                    this.cannotEdit = this.formData.followRecord ? true: false;
                });

            } else {
                if(this.batchId && this.batchId.length){
                    this.formData.scene = '1';
                    if(this.batchId.length == 1){
                        this.formData.customerId = this.batchId[0].id;
                        this.customerName = this.batchId[0].name;
                    }
                }
            }

        },
        toggleAccordion(e) {
            this.expanded = !this.expanded;
        },
        init (){
            this.getManualCreate(); //获取任务类型
            this.getExecutorList(); //获取执行人
            this.getCustomerList(this.data && this.data.customerName ? this.data.customerName:this.customerName); //获取关联客户
            this.getPriorityList(); // 任务优先级枚举
            this.getRemindList(); // 任务提醒列表
        },
        valideDeadLineTime(rule, value, callback) {
            if (new Date(this.formData.deadLine.replace(/-/g, '/') + ' '+ this.formData.deadLineTime).getTime() < Date.now()) {
                callback(new Error('截止时间必须晚于当前时间'));
            } else {
                callback();
            }
        },
        valideDescription(rule, value, callback) {
            if (this.missTypeIsTlTask && !value) {
                this.descriptionIsRequired = true;
                callback(new Error('请输入任务描述'));
            } else {
                this.descriptionIsRequired = false;
                callback();
            }
        },
        // 新建任务 类型权限： 普通任务/拨打任务/拜访任务/微信跟进任务 301
        getManualCreate () {
            this.$ajax({
                method: 'GET',
                url: '/mission/type/manualcreate/list.json',
                params: {
                    scene: this.formData.scene
                }
            }).then( (res) => {

                if(res.code == 1 && res.data) {
                    this.tabs = res.data || [];
                    this.formData.missionTypeId = res.data[0].missionTypeId; // 任务类型id
                    if(this.data){
                        this.tabs.forEach((item, idx)=>{
                            if(item.missionTypeId == this.data.missionTypeId){
                                this.formData.missionTypeId = item.missionTypeId;
                                this.tabNum = idx;
                                this.formData.missionName = item.missionTypeName;
                            }
                        });

                    }else {
                        let name = this.defaultMissionName[res.data[0].missionTypeId];
                        this.formData.missionName = name ? name : res.data[0].missionTypeName;

                        if(this.isTl) { // TL、总监、城主 默认TL协进任务 missionTypeId = 120

                            const tlItem = this.tabs.find(item => item.missionTypeId === 120) || {};
                            const tlIdx = this.tabs.findIndex(item => item.missionTypeId === 120) || 0;

                            this.formData.missionTypeId = tlItem.missionTypeId;
                            this.tabNum = tlIdx;
                            this.formData.missionName = tlItem.missionTypeName;
                            this.formData.priority = 20; // 优先级默认紧急
                            this.formData.followRecord = true; // 默认同步

                        } else { // 否则走之前逻辑
                            let _current = null;
                            this.tabs.forEach((item, idx)=>{
                                if(item.missionTypeId == this.defaultMissionType){
                                    _current = item;
                                    this.formData.missionTypeId = item.missionTypeId;
                                    this.tabNum = idx;
                                    this.formData.missionName = item.missionTypeName;
                                }
                            });

                            if (_current) {
                                this.changeTab(_current, this.tabNum, true);
                            }
                        }

                        

                    }
                }
                else {
                    this.tabs = [];
                }
            });
        },
        // 获取执行人
        getExecutorList () {
            this.$ajax({
                method: 'GET',
                url: '/mission/auth/user.json',
            }).then( (res) => {
                // setTimeout(()=>{
                //     this.isLoading = false;
                // }, 700);

                if(res.code == 1 && res.data) {
                    //判断执行人权限
                    if(res.data.length > 1) {
                        this.isExecutorValid = false;
                    }else {
                        this.isExecutorValid = true;
                    };
                    let arr = res.data || [];

                    let executorId = this.executorId || '';
                    if (this.data) {
                        executorId = this.data.executorId;
                    }

                    if (!executorId) {
                        this.formData.executorId = arr[0].userId;
                        this.executorList = [arr[0]];
                    } else {
                        for(let j=0; j<arr.length; j++) {
                            if(arr[j].userId == executorId) {
                                this.formData.executorId = arr[j].userId;
                                this.executorList = [arr[j]];
                                break;
                            };
                        };
                    }
                    if (!this.data) {
                        //  新增，判断执行人和联系人是否一致
                        if (this.$store.state.user.userInfo.encryptUserId != this.formData.executorId) {
                            this.resetStatus();
                        }
                    }
                    //全量赋值
                    setTimeout(() => {
                        this.executorList = arr;
                    }, 2000);
                }
                else {
                    this.executorList = [];
                }
            });
        },
        // 获取关联客户
        getCustomerList(value) {
            if (this.defaultCustomerList && this.defaultCustomerList.length) {
                this.customerList = this.defaultCustomerList;
                this.formData.customerId = this.defaultCustomerList[0].customerId;
                return;
            }
            this.$ajax({
                method: 'GET',
                url: '/customer/privatesea/auth/search.json',
                params: {
                    query: value,
                    limit: 30
                }
            }).then( (res) => {
                if(res.code == 1 && res.data) {

                    this.customerList = res.data || [];
                    if(!res.data){
                        this.contactList = [];
                        this.formData.contactId = '';
                    }
                    this.formData.customerId = this.formData.customerId;

                } else {
                    this.customerList = [];
                }
            });
        },
        // 获取联系人
        getContactList () {

            this.$ajax({
                method: 'GET',
                url: '/customer/bosscontact/valid.json',
                params: {
                    customerId: this.formData.customerId ? this.formData.customerId:''
                }
            }).then( (res) => {

                if(res.code == 1 && res.data) {
                    let queryList = res.data.filter((item) => {
                        if(item.contactName){
                            return item;
                        }
                    });
                    this.contactList = queryList || [];
                    if(this.data){
                        let iscontactId = false;
                        iscontactId=  this.contactList.some((item)=>{
                            if(item.contactId == this.data.contactId){
                                return true;
                            }
                        });
                        if(!iscontactId){
                            this.formData.contactId = '';
                        }
                    } else {
                        if (this.isTl && this.batchId.length == 1) { // 刚进来，默认tl协进tab时, 回显联系人优先级比下面的高
                            this.backFillLastCall();

                        } else if (Object.keys(this.defaultContact).length && this.batchId.length == 1) {
                            // 只有单独添加有联系人
                            this.formData.contactId = this.defaultContact.contactId || '';
                            this.formData.contactType = this.defaultContact.contactType || 0;
                        }
                    }

                    if(!this.contactList.length){
                        this.formData.contactId = '';
                    }
                }
                else {
                    this.contactList = [];
                }
            });
        },
        // 改变任务类型时根据类型改变对应的表单值
        changeFormValue() {
            if (this.missTypeIsTlTask) {
                this.formData.priority = 20; // 优先级紧急
                this.formData.followRecord = true; // 默认同步
                this.backFillLastCall();
                
            } else {
                this.$refs['taskForm'].validateField('description');
                this.formData.priority = 30; // 优先级普通
            }
        },
        // 获取此客户上一次通话记录的联系人
        backFillLastCall() {
            let lastCallItem = this.contactList.find(item => item.lastCallFlag === 1) || {};
            this.formData.contactId = lastCallItem.contactId || '';
            this.formData.contactType = lastCallItem.contactType;
        },
        // 任务优先级枚举
        getPriorityList () {
            // missionStatus
            this.$ajax({
                method: 'GET',
                url: '/dict/mission/priorities.json',
            }).then( (res) => {

                if(res.code == 1 && res.data) {
                    this.priorityList = res.data || [];
                }
                else {
                    this.priorityList = [];
                }
            });

        },
        // 任务提醒列表
        getRemindList () {
            // missionStatus
            this.$ajax({
                method: 'GET',
                url: '/mission/remind/type.json',
            }).then( (res) => {

                if(res.code == 1 && res.data) {
                    this.remindList  = res.data || [];
                }
                else {
                    this.remindList = [];
                }
            });

        },
        changeTab(item, index, noToggle) {
            if(this.data){
                return;
            }
            this.tabNum = index;
            this.formData.missionTypeId = item.missionTypeId; // 任务类型id

            let name = this.defaultMissionName[item.missionTypeId];
            this.formData.missionName = name ? name : item.missionTypeName;
            this.formData.contactId = '';
            if (this.formData.missionTypeId == 25 && this.formData.customerId && !this.data) {
                // 报单客户跟进任务
                // 并且不是编辑
                // 有默认联系人
                this.getConcat();
            }

            if (!noToggle) {
                this.changeFormValue();
                this.$refs.changeDropmenu?.toggleMenu();
            }
        },
        getConcat () {
            this.$ajax({
                method: 'GET',
                url: '/saleDeclare/contact',
                params: {
                    customerId: this.formData.customerId ? this.formData.customerId:''
                }
            }).then( (res) => {
                if(res.code == 1 && res.data) {
                    this.formData.contactId = res.data.contactId || '';
                    this.formData.contactType = typeof res.data.contactType == 'number' ? res.data.contactType : '';
                } else {
                    this.formData.contactId = '';
                    this.formData.contactType = '';
                }
            });
        },
        isTypeFile (fileName, type) {
            let fileNameList = (fileName || '').split('.');
            return fileNameList[fileNameList.length - 1].toLowerCase().indexOf(type) > -1;
        },
        uploadStart(files) {

            this.upload.progress = 0;
            this.upload.progressShow = true;
            this.upload.uploadEndStatus = false;
        },
        uploadProgress(progress) {
            this.upload.progress = progress;
            if (progress == 100) {
                this.upload.progressShow = false;
                this.upload.uploadEndStatus = true;
            }
        },
        uploadEnd(res) {
            if (res.data.code == 1 && res.data.data) {
                if (Object.prototype.toString.call(this.formData.attachments) === '[object Array]') {
                    this.formData.attachments = this.formData.attachments.concat(res.data.data);
                } else {
                    this.formData.attachments = res.data.data;
                }
            } else if (res.data.code != 1) {
                this.$toast({
                    type: 'error',
                    content: res.data.message
                });
            }
            this.upload.progressShow = false;
            this.upload.uploadEndStatus = true;
        },
        deletImg (idx) {
            this.formData.attachments.splice(idx, 1);

        },
        // changeRemind (item) {
        //     this.formData.remindType = item.code;
        //     this.formData = {...this.formData};
        //     this.remindTypeName = item.name;
        //     this.$refs.remindDropmenu.toggleMenu();
        // },
        changeCustomerId (val) {
            this.getCustomerList(val);
        },
        // 联系人
        changeContactId (val) {

            this.contactList.forEach((item)=>{
                if(item.contactId == this.formData.contactId){
                    this.formData.contactType = item.contactType;
                }
            });
        },
        // 执行人
        changeExecutorId (val) {
            // this.executorList.forEach((item)=>{
            //     if(item.userId == val){
            //         this.formData.executorId = item.userId;

            //     }
            // });
        },
        // 新建任务---任务手动创建
        save () {
            if (this.isSubmitting) {
                return;
            }
            this.$refs['taskForm'].validate((valid = true) => {
                if (!valid) return;
                let params = {};
                let attachments = [];
                this.formData.attachments.forEach(element => {
                    attachments.push(element.fileId);
                });
                params.missionTypeId = this.formData.missionTypeId;
                params.missionName = this.formData.missionName;
                params.executorId = this.formData.executorId;
                params.priority = this.formData.priority;
                params.deadLine = this.formData.deadLine + ' ' + this.formData.deadLineTime;
                params.remindType = this.formData.remindType;
                params.contactId = this.formData.contactId;
                params.contactType = this.formData.contactType;
                params.description = this.formData.description;
                params.attachments = attachments;
                //关联客户
                // 我的客户 添加跟进任务
                let url = '';
                if(this.batchId && this.batchId.length){
                    // 创建场景 0 任务页面创建  1 客户页面创建
                    this.formData.scene = '1';
                    params.scene = this.formData.scene;
                    if(this.batchId.length ==1){
                        params.customerId = this.batchId[0].id;
                        url = '/mission/create.json';
                    }else {
                        url = '/mission/create/bulk.json';
                        let customerInfos = [];
                        this.batchId.forEach((item)=>{
                            let obj = {};
                            obj.contactId = '';//不传报错
                            obj.contactType = ''; //不传报错
                            obj.customerId = item.id;
                            customerInfos.push(obj);

                        });
                        params.customerInfos = customerInfos;

                    }
                }else {
                    // 创建场景 0 任务页面创建  1 客户页面创建
                    params.scene = this.formData.scene;
                    url = this.data ? '/mission/update.json' : '/mission/create.json';
                    params.customerId = this.formData.customerId;
                }
                // 编辑
                if(this.data){
                    params.missionId = this.data.missionId;
                }

                params.toCustomerFollow = this.formData.followRecord ? 1 : 0;
                params.completeNotify = this.formData.taskComplete ? 1 : 0;
                params.addSource = +(this.data || {}).addSource || +this.from || 0;

                this.isSubmitting = true;
                this.$ajax({
                    url: url,
                    method: 'POST',
                    data: {
                        ...params,
                        ...this.submitParams,
                    }
                }).then(({code, message, data}) => {
                    this.$toast({
                        content: message,
                        type: code == 1 ? 'success' : 'error'
                    });
                    if (code == 1) {
                        try {
                            this.$trackEvent({
                                action: 'crm-addTask-confirm',
                                p2: params.missionId ? params.missionId : data, //任务id
                                p4: params.missionTypeId, //任务类型
                                p12: (Date.now() - this.enterStamp)/1000, //停留时长
                                target: params.customerId
                            });
                        } catch (error) {
                            //
                        };
                        this.$emit('updateList');
                        this.$emit('update');
                        this.$emit('close', true);
                    }

                }).always(() => {
                    this.isSubmitting = false;
                });
            });

        },
        cancel () {
            this.$emit('close');
            this.resetData();
        }
    },
};
</script>

<style lang="less">
    ._page-task-management-add-dialog {
        .ui-select-selection,.el-input__inner{
            border-radius: 4px;
        }
        .fr{
            float: right;
        }
        .dialog-header{
            margin-top: -10px;
            .ui-dropmenu-label{
                margin-left: -12px;
                border-radius: 4px;
                padding-left: 12px;
                &:hover{
                    background: #E4E8F0;
                    color: #414a60;
                    .ui-icon-arrow-down{
                        color: #414a60;
                    }
                }
            }
            .dropmenu-title{
                font-size: 16px;
            }
            .ui-dropmenu-visible{
                .ui-dropmenu-label{
                    background: #E4E8F0;
                    border-radius: 4px;
                    padding-left: 12px;
                    color: #414a60;
                }
                .ui-icon-arrow-down{
                    color: #414a60;
                }
            }
            .ui-dropmenu-label{
                height: 26px;
                line-height: 28px;
                font-weight: bold;
            }
            .ui-dropmenu-list{
                text-align: left;
                left: -12px;
                .name{
                    height: 20px;
                    font-size: 14px;
                    color: #363F55;
                    line-height: 20px;
                }
                .tip {
                    height: 16px;
                    font-size: 12px;
                    color: #9FA6B5;
                    line-height: 16px;
                }
            }
            .active{
                .name {
                    color: rgba(0, 166, 167, 1)
                }
            }
        }
        .dialog-container{
            padding: 24px 0 24px 24px;
            overflow: hidden;
        }
        .ui-dropmenu-list {
            text-align: center;
        }
        .disabled-pointer {
            pointer-events: none;
            input {
                cursor:not-allowed;
            }
            .ui-select-input {
                color: #828A9E;
            }
        }
        .contact-boss {
            padding: 2px 5px;
            background: #2EA598;
            border-radius: 2px;
            color: #fff;
        }
        .data-content-inner {
            padding-bottom: 60px;
        }
        .mod-tab {
            .data-tab {
                margin-bottom: 10px;
            }
            // .tab-tips {
            //     background: #FFF2DD;
            //     color: #5E667B;
            //     line-height: 18px;
            //     padding: 7px 14px;
            //     margin-bottom: 10px;
            //     max-width: 630px;

            // }
        }
        .form-data-box {
            .form-item-required{
                .item-label{
                    text-align: left;
                    &::before{
                        display: none;
                    }
                }
            }
            .form-item {
                .item-label {
                    width: 80px;
                }
            }
            .inline-item-box{
                display: flex;
                align-content: flex-start;
                justify-content: space-between;
            }
            .el-date-editor.el-input, .el-date-editor.el-input__inner{
                width: 176px;
                flex: 0;
            }
            .ui-select {
                width: 176px;
            }
            .choose-contacts {
                width: 150px;
            }
            .form-data {
                border: 1px solid #E2E2E2;
                border-radius: 3px;
                padding-bottom: 0px;
                width: 552px;
                margin-bottom: 16px;
                position: relative;
                .input-wrap{
                    width: 100%;
                    input ,textarea{
                        border: none;
                        &:focus {
                            border: none;
                            box-shadow: none;
                        }
                    }
                }
                .input-wrap-textarea{
                    min-width: 0;
                }
                .form-item {
                    margin-bottom:5px!important;
                }
                .task-name-item {
                    margin-bottom: 10px;
                }
                .mission-name {
                    .item-content{
                        position: static !important;
                    }
                    // &.form-item-error {
                    //     .form-error-tip {
                    //         display: none;
                    //     }
                    //     input,textarea {
                    //         border-bottom: 1px solid red;
                    //     }
                    // }
                    .input-wrap{
                        position: static !important;
                    }
                    .suffix-counter{
                        bottom: 1px;
                    }
                }
                &.required-red {
                    border-color: red;
                }
            }


        }

        .upload-operation-box {
            display: flex;
            .operation-li {
                flex:1;
                li.active {
                    color: #5DD5C8;
                }
                &:last-child {
                    text-align: right;
                }
            }
        }
        .footer-box{
            position: absolute;
            bottom: 0px;
            left: 0;
            padding: 24px;
            background: #fff;
            width: 100%;
            text-align: right;
            .btn{
                &:nth-of-type(1){
                    margin-right: 12px;
                }
            }
        }

        .album-upd-box{
            position: relative;
            box-sizing: border-box;
            padding: 0 10px;
            text-align: left;
            &::after{
                content: '';
                display: block;
                clear: both;
            }
            .icrm-attachment{
                color: #9fa5b5;
                &:hover{
                    color: #363F55;
                    background: #E4E8F0;
                    border-radius: 4px;
                    &::after {
                        content: '';
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background: #E4E8F0;
                        border-radius: 4px;
                        position: absolute;
                        left: 8px;
                        top: 2px;
                        z-index: -1;
                    }
                }
            }
            .supplement {
                text-align: left;
            }
            /*
            .icrm-camera {
                cursor: pointer;
            }
            .img-item-box{
                width:66px;
                height:66px;
                border-radius:3px;
                // overflow: hidden;
                cursor: pointer;
                position: relative;
                margin-right: 10px;
                margin-bottom: 10px;
                float: left;
                img {
                    width: 100%;
                    height: 100%;
                }
                .img-model{
                    width: 100%;
                    height: 100%;
                    background:rgba(0,0,0,.4);
                    left: 0;
                    top: 0;
                    position: absolute;
                    z-index: 1;
                    display: none;
                }
                .ui-icon-circle-close{
                    font-size:18px;
                    right: -9px;
                    top: -9px;
                    position: absolute;
                    z-index: 2;
                    color: #D7D7D7;
                    background: #fff;
                    border-radius: 200px;
                    display: none;
                }
                &:hover {
                    .img-model, .ui-icon-circle-close {
                        display: block;
                    }
                }
            }
            .upload-btn{
                width:66px;
                height:66px;
                text-align: center;
                line-height: 66px;
                background:rgba(83,202,195,.1);
                border-radius:2px;
                border:1px dashed #53CAC3;
                color: #53CAC3;
                cursor: pointer;
                position: relative;
                float: left;
                .ui-icon-plus{
                    font-size: 19px;
                }
                .progress-text-box{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    text-align: center;
                    line-height: 64px;
                    color: #fff;
                    background: rgba(0,0,0,0.3);
                    word-break: keep-all;
                    font-size: 12px;
                }
            }
            */
        }
        .my-customer-li {
            // margin-bottom: 8px;
            width: 220px;
            background: #F7F8FB;
            // border-radius: 4px;
            padding: 5px 12px;
        }
        .task-contain{
            display: flex;
            .left{
                max-height: calc(~'100vh - 200px');
                padding-right: 24px;
                overflow-y: auto;
                .item-title{
                    line-height: 20px;
                    margin-bottom: 10px;
                }
                .file-upload-tip{
                    margin-left: 8px;
                    font-size: 12px;
                    color: #9FA6B5;
                }
                form{
                    width: 552px;
                }
            }
            .right{
                max-height: 400px;
                padding: 0 24px 0 20px;
                overflow-y: auto;
                .item-title{
                    line-height: 20px;
                    margin-bottom: 10px;
                }
            }
        }
        .more-option{
            padding: 10px 16px 0 16px;
            >div{
                display: flex;
            }
            .executorId-line{
                .form-item{
                    &:nth-child(1){
                        flex-grow: 1;
                        padding-right: 12px;
                        .choose-executor{
                            width: 100%;
                        }
                    }
                    .remind-type{
                        width: 160px;
                    }
                }
            }
        }
        .pannel-collapse{
            border: none;
            dl, dd, dt{
                background: #F7F8FB;
                border: none;
            }
            dl{
                border-radius: 8px;
            }
            dt:after {
                left: auto;
                right: 8px;
            }
            dt{
                padding-left: 16px;
                padding-right: 24px;
            }
        }
        .select-customer-company{
            width: 100%;
            .item-content{
                display: flex;
            }
            .item-label{
                text-align: left;
            }
            .associated-customer{
                margin-right: 12px;
                flex-grow: 1;
                .choose-executor{
                    width: 100%;
                }
            }
            &-contact{
                .remind-type{
                    width: 160px;
                }
            }

        }
        .no-label{
            margin: 6px 0;

            .item-label{
                display: none;
            }
        }
        .info{
            display: inline-block;
            vertical-align: middle;
            width: 230px;
            .icrm-info-tooltip{
                color: #9FA6B5;
                position: relative;
                &:hover{
                    color: #365f55;
                    border-radius: 4px;
                    &::after {
                        content: '';
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background: #E4E8F0;
                        border-radius: 4px;
                        position: absolute;
                        left: -2px;
                        top: -2px;
                        // transform: translateX(-50%);
                        // transform: translateY(-50%);
                        z-index: -1;
                    }
                }
            }
        }
        .mission-name-no-label{
            margin: 6px 0;

            .item-label{
                display: none;
            }
        }
        .font-bold{
            font-weight: bold;
        }
    }
    .el-picker-panel.el-date-picker{
        z-index: 8000 !important;
    }
    .transfer-formData-priority{
        width: 176px;
    }
    .transfer-choose-executor{
        width: 344px;
    }
    .transfer-remind-type{
        width: 160px;
    }
    .transfer-associated-customer{
        width: 344px;
    }
</style>