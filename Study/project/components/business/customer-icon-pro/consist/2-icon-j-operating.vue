<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('operating-state')">
            <span class="icon-customer-operating icon-customer-trigger" :class="className">
                <i class="icrm-bulb"></i>经营状态:{{ operatingState }}
            </span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">{{ operatingStateTxt || operatingState }}</p>
                </div>
            </template>
        </ui-tooltip2>
        <!-- 经营状态反馈操作 -->
        <template v-if="operatingState && !fromKefu">
            <ui-tooltip2
                placement="top"
                appendToBody
                effect="light"
                popperClass="popper-customer-icon-simple">
                <span class="icrm-fankui icon-customer-fankui icon-customer-trigger" @click.prevent="showFeedback"></span>
                <template slot="content">
                    <div class="customer-icon-content">
                        <p class="desc">经营状态反馈</p>
                    </div>
                </template>
            </ui-tooltip2>
        </template>
        <!-- 经营状态反馈弹窗 -->
        <ui-dialog v-model="show" preventConfirm preventLayer width="560" wrapClass="dialog-customer-operating-feedback" @on-confirm="confirm">
            <template slot="title">经营状态反馈</template>
            <template slot="content">
                <ui-form
                    v-if="show"
                    ref="form"
                    :model="formData"
                    :rules="ruleData"
                    :label-width="100" @submit.native.prevent="">
                    <div class="seaction-title">经营状态</div>
                    <form-item label="经营状态" prop="operatingStateCode">
                        <ui-radio-group v-model="formData.operatingStateCode">
                            <ui-radio
                                v-for="(item, index) in OperatingstatesList"
                                :key="index"
                                :label="item.code + ''">{{ item.name }}</ui-radio>
                        </ui-radio-group>
                    </form-item>
                    <form-item label="修改理由" prop="updateReason">
                        <ui-input
                            v-model="formData.updateReason"
                            counter
                            type="textarea"
                            :rows="4"
                            resize="none"
                            placeholder="请输入修改理由，并优先上传国家企业信用信息公示系统的截图证明（http://www.gsxt.gov.cn/index.html）"></ui-input>
                    </form-item>
                    <form-item label="相关图片" prop="imgList">
                        <ui-upload
                            ref="upload"
                            custom
                            action="/config/upload.json"
                            exname=".jpg.jpeg.png"
                            :uploadedNum="formData.imgList.length"
                            :total="maxCount"
                            @uploadStart="uploadStart"
                            @uploadEnd="uploadEnd">
                            <div class="feedback-gallary">
                                <div v-for="(fileUrl, fileIndex) in formData.imgList" :key="fileIndex" class="block-item">
                                    <ui-image
                                        fit="cover"
                                        :src="fileUrl | fmUrl"
                                        :preview-src-list="formData.imgList"
                                        class="preview-img"></ui-image>
                                    <i v-if="fileIndex > 0" class="ui-icon-close delete-btn" @click="deleteFile(fileIndex)"></i>
                                </div>
                                <div v-if="formData.imgList.length < maxCount" class="block-item add-btn" @click="$refs.upload.mockClick()">
                                    <img src="@/assets/images/pic-default.jpg" alt="" class="camera-img" />
                                </div>
                            </div>
                            <span class="statement">最大文件上传大小是10.00MB，最多上传6张图片</span>
                        </ui-upload>
                    </form-item>
                    <div class="seaction-title">反馈环境</div>
                    <div class="desc">
                        <p>{{ userInfo.deptName }}，{{userInfo.name}}，{{userInfo.email}}</p>
                        <p>{{ this.userAgent }}</p>
                    </div>
                </ui-form>
            </template>
        </ui-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { _configUploadBase64 } from '@/services/common';
import html2canvas from 'html2canvas';
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-j-operating',
    mixins: [trackEventMixins],
    data () {
        return {
            show: false,
            formData: {
                operatingStateCode: '', //回填
                updateReason: '',
                imgList: [],
            },
            userAgent: window.navigator.userAgent,
            ruleData: {
                operatingStateCode: [
                    {required: true, message: '请选择经营状态', trigger: 'change'},
                ],
                updateReason: [
                    {required: true, message: '请输入修改理由', trigger: 'change'},
                    {min: 1, max: 1000, userZH: false, message: '请输入1-1000个字', trigger: 'change'}
                ],
                imgList: [
                    { required: true, type: 'array', message: '请上传', trigger: 'change' }
                ]
            },
            OperatingstatesList: [],
            uploadedNum: 0, //已经上传的图片的数量
            maxCount: 6,
            screenUrl: '',
        };
    },
    props: {
        className: '',
        operatingState: '',
        operatingStateTxt: '',
        operatingStateCode: '',
        customerId: {
            type: String,
            default: '',
            required: true,
        },
        fromKefu: {  //客服系统打开客户详情页，禁用不显示反馈按钮
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('user', ['userInfo']),
    },
    created () {
        this.getOperatingstates();
    },
    filters: {
        fmUrl (url) {
            let __url = url;
            if(process.env.NODE_ENV == 'development') {
                __url = 'https://crm.weizhipin.com' + __url;
            };
            return __url;
        },
    },
    methods: {
        getOperatingstates () {
            this.$ajax({
                method: 'GET',
                url: '/dict/customer/operatingstates.json',
            }).then(({code, data}) => {
                if(code == 1) {
                    this.OperatingstatesList = data || [];
                };
            });
        },
        showFeedback () {
            this.formData = {
                operatingStateCode: this.operatingStateCode > 0 ? this.operatingStateCode + '' : '',
                updateReason: '',
                imgList: [],
            };
            this.show = true;
            setTimeout(() => {
                if(!this.screenUrl) {
                    this._printScreen();
                } else {
                    this.formData.imgList = [this.screenUrl];
                };
            }, 1);
        },
        uploadStart () {
            // console.log('start');
        },
        uploadEnd (res) {
            if (res.data && res.data.root && res.data.root.urls) {
                this.formData.imgList = this.formData.imgList.concat(res.data.root.urls);
                this.$refs.form.validateField('imgList');
            }
        },
        deleteFile(index) { // 删除文件
            this.formData.imgList.splice(index, 1);
        },
        _printScreen() { // 截屏
            html2canvas(document.body, {
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                imageTimeout: 0,
                useCORS: true,
                ignoreElements: (ele) => {
                    return ele && typeof ele.className == 'string' && ele.className.indexOf('dialog-customer-operating-feedback') != -1;
                }
            }).then(canvas => {
                var data = canvas.toDataURL('image/png', 0.3);

                _configUploadBase64(
                    referSplitting(data)
                ).then(res => {
                    if(res.root && res.root.urls && res.root.urls.length) {
                        this.screenUrl = res.root.urls[0];
                        this.formData.imgList.unshift(res.root.urls[0]);
                    };
                });
            });

            function referSplitting (str) {
                var step = 200000;
                var times = Math.ceil(str.length/step);
                var params = {};
                for(var j = 0; j<times; j++) {
                    params['file' + j] = str.substring(j*step, (j+1)*step);
                };
                return params;
            }
        },
        confirm () {
            let vm = this;

            vm.$refs['form'].validate((valid=true) => {
                if(!valid) return false;
            });

            if(vm.formData.operatingStateCode != 1 && vm.operatingStateCode != 1) {
                vm.$dialog({
                    title: '温馨提示',
                    content: '【吊销，未注销】、【注销】、【其他】均属于经营状态异常，反馈后仍会进入X客户',
                    userHtmlString: true,
                    type: 'warning',
                    onConfirm () {
                        vm.save();
                    },
                });
            } else {
                vm.save();
            };
        },

        save () {
            let data = {
                ...this.formData,
                userAgent: this.userAgent,
                customerId: this.customerId,
            };

            this.$ajax({
                method: 'POST',
                url: '/issue/operatingstate/feedback.json',
                data: data,
            }).then(({code, message}) => {
                if(code == 1) {
                    this.$toast({
                        type: 'success',
                        content: '反馈成功',
                    });
                    this.show = false;
                };
            });
        },
    }
};
</script>

