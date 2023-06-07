<template>
    <div class="quotations">
        <ui-dialog :value="show" :showFooter="false" :showClose="false" :wrapClass="'quotation-wrap'">
            <div slot="content">
                <div v-html="html"></div>
                <div class="quotation-wrap-footer">
                    <button type="button" class="btn btn-primary" @click.prevent="showDownload()">下载报价单</button>
                    <button type="button" class="btn btn-close" @click="hideDialog">关闭预览</button>
                </div>
            </div>
        </ui-dialog>
        <ui-dialog v-model="showConfirmDialog"
                   :showFooter="false"
                   :preventLayer="true"
                   @on-close="hideConfirmDialog"
                   wrapClass="export-confirm-dialog">
            <template slot="title">下载报价单</template>
            <template slot="content">
                <div class="form-item">
                    <div class="item-label item-label-asterisk">请选择报价方案需要展示的内容</div>
                    <div class="ui-checkbox-group-box">
                        <ui-checkbox-group v-model="showType">
                            <ui-checkbox :label="1">折扣</ui-checkbox>
                            <ui-checkbox :label="2">折后价</ui-checkbox>
                        </ui-checkbox-group>
                    </div>
                </div>
                <div class="footer">
                    <button type="button" class="btn btn-primary" @click.prevent="exportFile">下载</button>
                    <button type="button" class="btn" @click.prevent="hideConfirmDialog">取消</button>
                </div>
            </template>
        </ui-dialog>
    </div>
</template>

<script>
export default {
    name: 'quotation',
    data() {
        return {
            show: false,
            html: '',
            id: '',
            name: '',
            showConfirmDialog: false,
            showType: [1, 2]
        };
    },
    props: {
        rootData: {
            type: Object,
            default: () => {},
        },
        formData: {
            type: Object,
            default: () => {},
        },
        upDateShow: {
            type: Boolean,
            default: false
        },
        quotationType: {
            type: [Number, String],
            default: 0
        }
    },
    mounted() {
        if(this.rootData){
            this.show = true;
            if (this.rootData.type == 1) {
                if (this.rootData.root.type == 0) {
                    this.html = this.rootData.root.html;
                    this.id = this.rootData.root.calculatorId;
                    this.name = this.rootData.root.customerName;
                } else {
                    this.formData.show = false;
                    this.$emit('tipsQuotation', this.rootData.root);
                }
                this.formData = {...this.rootData};
            } else {
                this.html = this.rootData.root.html;
                this.id = this.rootData.root.id;
                this.name = this.rootData.root.name;
            }

        }else{
            this.getData();
        }

    },
    methods: {
        showDownload () {
            // 判断类型 quotationType == 2 阶梯折扣
            // 直接调用 exportFile
            if (this.quotationType == 2) {
                this.exportFile();
            } else {
                this.showConfirmDialog = true;
            }
        },
        hideConfirmDialog() {
            this.showType = [1, 2];
            this.showConfirmDialog = false;
        },
        hasDataContent(){

        },
        exportFile() {
            // 判断类型 quotationType
            // 不做 showType 校验
            if (!this.showType.length && this.quotationType != 2) {
                this.$toast({
                    type: 'error',
                    content: '请选择保价方案需要展示的内容'
                });
                return;
            }
            let _a = document.createElement('a');
            _a.hidden = 'hidden';
            _a.href = `/calculator/priceCalculator/download?calculatorId=${this.id}&customerName=${this.name}&showType=${this.showType.join(',')}`;
            document.body.appendChild(_a);
            _a.click();
            document.body.removeChild(_a);
            this.hideConfirmDialog();
        },
        getData() {
            this.$ajax({
                url: this.formData.url,
                method: 'GET',
                params: this.formData.form,
                transformRequest: [function (data) {
                    let ret = '';
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                    }
                    return ret;
                }],
            }).then(({success, root, message}) => {

                if (success && root) {
                    this.show = true;
                    if (this.formData.type == 1) {
                        if (root.type == 0) {
                            this.html = root.html;
                            this.id = root.calculatorId;
                            this.name = root.customerName;
                        } else {
                            this.formData.show = false;
                            this.$emit('tipsQuotation', root);
                        }
                    } else {
                        this.html = root;
                        this.id = this.formData.id;
                        this.name = this.formData.name;
                    }

                } else {
                    this.$toast({
                        content: message,
                        type: 'error'
                    });
                }

            });
        },
        hideDialog() {
            this.$emit('hideQuotation');
        }
    }
};
</script>

<style lang="less">
    .quotation-wrap {
        * {
            box-sizing: content-box;
        }
        .dialog-container {
            padding: 0;
            bottom: 40px;
            position: absolute;
            top: 0;
            .dialog-body {
                overflow-x: hidden;
                overflow-y: scroll;
                height: calc(~"100vh - 60px");
                max-height: calc(~"100vh + 60px");
                &::-webkit-scrollbar {
                    width: 0;
                }
            }
        }
    }

    .quotation {
        padding: 0;
        width: 800px;
        box-shadow: 5px 0px 5px #888888;
        .quotation-container {
            height: calc(~"100vh - 390px");
            min-height: 900px;
        }
        .quotation-footer {
            .disclaimer {
                padding-left: 0;
            }
            position: relative;
            padding-left: 30px;
        }
    }

    .quotation-wrap-footer {
        position: fixed;
        height: 60px;
        left: 0;
        background: #fff;
        bottom: 0;
        width: 100%;
        z-index: 9999;
        text-align: center;
        line-height: 60px;
        box-shadow: 0 -2px 4px 0 rgba(140, 203, 239, 0.20);
        .btn-close {
            border-color: #eee;
            background-color: #fff;
            color: #414a60;
            box-shadow: 0 1px 10px 0 rgba(0, 0, 0, .1);
        }
    }

    .export-confirm-dialog {
        .item-label-asterisk {
            &:before {
                content: '*';
                display: inline-block;
                margin-right: 4px;
                font-size: 12px;
                color: #ed3f14;
            }
        }
        .ui-checkbox-group-box {
            user-select: none;
            text-indent: 5px;
        }
        .footer {
            text-align: center;
        }
    }
</style>
