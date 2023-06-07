<template>
    <div v-if="showDialog">
        <ui-dialog
            v-model="showDialog"
            title="申请划转"
            wrapClass="_page-appeal-transfer-dialog"
            :showFooter="false"
            width="600"
            preventConfirm
            lock
            preventLayer
            @on-close="cancel">
            <template slot="content">
                <div class="appeal-info-container new-scrollBar-width-10">
                    <div class="appeal-info-roll">
                        <p v-if="sonCustomerLen">
                            <i class="icrm-new-caution"></i>
                            <span>申请划转合并客户主客户时，子客户会一并划转</span>
                        </p>
                        <div class="customer-info-container" :class="{'container-border': !sonCustomerLen}">
                            <div class="name">
                                <span>{{ appealInfo.name }}</span>
                                <customerIcon :customer="iconObj"></customerIcon>
                            </div>
                            <div class="sub-customer">
                                <span v-if="sonCustomerLen">子客户数：{{sonCustomerLen}}</span>
                                <span>当前所属：{{ appealInfo.userName }}</span>
                            </div>
                        </div>
                        <ui-form
                            class="appeal-transfer-form"
                            v-if="Object.keys(appealInfo).length"
                            ref="transferForm"
                            :labelPosition="'top'"
                            :model="formData"
                            :rules="ruleData">
                            <form-item label="意向材料" prop="attrUrls">
                                <Upload class="material-upload" :limit="limit" action="/openflow/file/limit10m/upload.json" @changeItem="changeItem"></Upload>
                            </form-item>
                            <form-item label="联系人姓名" prop="contactName">
                                <ui-input
                                    v-model.trim="formData.contactName"
                                    placeholder="输入联系人姓名"
                                    class="w100"
                                />
                            </form-item>
                            <form-item label="联系方式" prop="contactMobile">
                                <ui-input
                                    v-model.trim="formData.contactMobile"
                                    placeholder="输入手机号码"
                                    :maxlength="11"
                                    class="w100"
                                />
                            </form-item>
                            <form-item label="分配原因" prop="allocateReason">
                                <ui-radio-group
                                    v-if="appealInfo.allocateReason && appealInfo.allocateReason.length"
                                    v-model="formData.allocateReason">
                                    <ui-radio
                                        v-for="reason in appealInfo.allocateReason"
                                        :key="reason.code"
                                        :label="reason.code">{{ reason.name }}</ui-radio>
                                </ui-radio-group>
                            </form-item>
                            <form-item label="备注" prop="remark">
                                <ui-input
                                    v-model="formData.remark"
                                    :maxlength="200"
                                    resize="none"
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请详细描述客户的合作意向，有助于审批通过"
                                    counter>
                                </ui-input>
                            </form-item>
                        </ui-form>
                    </div>
                    <div class="submit-footer">
                        <button class="btn" @click="cancel">取消</button>
                        <button class="btn btn-primary" @click="submit">提交</button>
                    </div>
                </div>
            </template>
        </ui-dialog>
    </div>


</template>

<script>

import customerIcon from '@/components/business/customer-icon/index.vue';
import Upload from '@/components/feature/upload-module-new/index.vue';

export default {
    name: 'appealTransfer',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        customerId: { //客户加密id
            type: String,
            default: ''
        },
        iconObj: { //图标对象
            type: Object,
            default: () => ({})
        },
        appealInfo: { //客户信息
            type: Object,
            default: () => ({})
        },

    },
    components: { customerIcon, Upload },
    watch: {
        value: {
            handler (val) {
                this.showDialog = val;
            },
            immediate: true
        },
    },
    computed: {
        sonCustomerLen() {
            return this.appealInfo.subCustomers && this.appealInfo.subCustomers.length ? this.appealInfo.subCustomers.length : 0;
        }
    },
    data() {
        return {
            limit: {
                filesize: 10,
                total: 5,
                exname: '.pdf.docx.xlsx.jpg.png.jpeg'
            },
            showDialog: false,
            // appealInfo: {},
            formData:{
                attrUrls: [],
                allocateReason: '',
                remark: '',
                contactName: '', // 联系人姓名
                contactMobile: '' // 联系人手机号
            },
            ruleData: {
                attrUrls: [{required: true, type: 'array', message: '意向证明不能为空', trigger: 'change'}],
                allocateReason: [{required: true, type: 'number',  message: '分配原因不能为空', trigger: 'change'}],
                remark: [
                    { required: true, message: '备注不能为空', trigger: 'change' },
                    { min: 0, max: 200, message: '请输入1-200字之间的字符', trigger: 'change' }
                ],
                contactName: [
                    { required: true, message: '联系人姓名不能为空', trigger: 'change' }
                ],
                contactMobile: [
                    {
                        required: true,
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback('联系方式不能为空');
                            } else {
                                const validateStatus = /^(1[3456789]\d{9})$/.test(value);
                                validateStatus ? callback() : callback('手机号格式不正确');
                            }
                        }
                    },
                ],
            },
            isSubmitting: false, //防止重复提交
        };
    },
    methods: {
        changeItem (res) {
            this.formData.attrUrls = (res || []).map(item => item.fileUrl);
            this.$refs.transferForm.validateField('attrUrls');
        },
        // 提交
        submit() {
            this.$refs['transferForm'].validate(valid => {
                if (!valid || this.isSubmitting) return false;
                let params = {
                    ...this.formData,
                    customerId: this.customerId,
                    seaType: this.appealInfo.seaType
                };
                params.attrUrls = Array.isArray(params.attrUrls) && params.attrUrls.length ? params.attrUrls.join(',') : '';

                let data = new FormData();
                for(let key in params) {
                    data.append(key, params[key]);
                }
                this.isSubmitting = true;
                this.$ajax({
                    method: 'POST',
                    url: '/customer/allocate/apply.json',
                    data
                }).then(({code, message}) => {
                    if (code == 1) {
                        this.$toast({
                            type: 'success',
                            content: message
                        });
                        this.$emit('on-close', 'fresh');
                    }
                }).finally(() => {
                    this.isSubmitting = false;
                });
            });
        },
        cancel() {
            this.$emit('on-close', 'close');
        }
    }
};
</script>

<style lang="less" scoped>
._page-appeal-transfer-dialog {
    .w100 {
        width: 100%;
    }

    /deep/.dialog-container {
        padding: 24px 0 24px 24px;
    }
    .appeal-info-container {
        .appeal-info-roll {
            overflow: auto;
            max-height: calc(~'80vh - 136px');
            padding-right: 14px;
            >p {
                display: flex;
                align-content: center;
                height: 32px;
                line-height: 32px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                padding: 0 16px;
                background: linear-gradient(135deg, #F2F2FF 0%, #F0FBFC 100%);
                font-size: 14px;
                color: #4D4DCF;
                margin-bottom: 2px;
                i {
                    margin-right: 8px;
                    font-size: 16px;
                    color: #5554fb;
                }
            }
            .customer-info-container {
                padding: 16px;
                background: linear-gradient(135deg, #F2F2FF 0%, #F0FBFC 100%);
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                .name {
                    font-size: 0;
                    line-height: 22px;
                    >span {
                        vertical-align: middle;
                        font-size: 14px;
                        font-weight: 500;
                    }
                    /deep/ .inner_customer-icon-tootips-box {
                        vertical-align: middle;
                        margin-left: 8px;
                    }
                }
                .sub-customer {
                    display: flex;
                    line-height: 17px;
                    margin-top: 6px;
                    font-size: 12px;
                    color: #757D8C;
                    span+span {
                        position: relative;
                        padding-left: 25px;
                        &::after {
                            position: absolute;
                            content: '';
                            width: 1px;
                            height: 12px;
                            left: 12px;
                            top: 50%;
                            transform: translateY(-50%);
                            background: #DBDFE6;
                        }
                    }
                }
            }
            .container-border {
                border-radius: 4px;
            }
            .appeal-transfer-form {
                margin-top: 24px;
                .material-upload {
                    /deep/ ._upload-operation-list {
                        li {
                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                }
                /deep/.input-wrap-textarea {
                    min-width: auto;
                    width: 100%;
                }
                /deep/.radio-group {
                    .radio-item {
                        display: block;
                        line-height: 20px;
                        width: fit-content;
                    }
                    .radio-item +.radio-item {
                        margin-top: 8px;
                    }
                }
                /deep/.form-item {
                    margin-bottom: 20px;
                    .item-label {
                        line-height: 22px;
                        &::before {
                            line-height: 1;
                        }
                    }
                    .form-error-tip {
                        position: relative;
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .submit-footer {
            padding: 24px 24px 0 0;
            text-align: right;
            button +button {
                margin-left: 8px;
            }
        }
    }
}
</style>
