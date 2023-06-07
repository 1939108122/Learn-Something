<template>
    <div class="file-upload">
        <ui-dialog
            v-model="show"
            :wrapClass="`dialog-file-upload ${diyClass}`"
            :width="width"
            :showClose="false"
            :cancelText="progress == 'importing' ? false : '取消'"
            preventConfirm
            preventCancel
            preventLayer
            lock
            @on-confirm="confirm"
            @on-cancel="cancel"
        >
            <template slot="title">{{ title }}</template>
            <template slot="content">
                <div class="files" v-if="progress == 'unUploaded' || progress == 'uploaded' || progress == 'importing'">
                    <slot name="tip"></slot>
                    <ui-upload ref="upload" custom :action="uploadUrl" @uploadStart="uploadStart" @uploadProgress="uploadProgress" @uploadEnd="uploadEnd" :exname="exname">
                        <div class="main">
                            <!-- <i class="icon-file-upload"></i> -->
                            <template v-if="progress == 'unUploaded'">
                                <div class="upload" @click="mockClick">
                                    <img class="img-file-upload" src="@/assets/images/icon-upload.png" alt="" />
                                    <p class="guid">请将文件拖拽到此处，或<span style="color: #00a6a7">点击上传</span></p>
                                    <p class="supplement">支持扩展名 {{ exname }}</p>
                                </div>
                            </template>
                            <!-- 上传完成可执行重新上传&&&执行导入-->
                            <template v-if="progress == 'uploaded'">
                                <div class="loaded">
                                    <i class="icon-file-done"></i>
                                    <p class="guid">{{ fileName }}</p>
                                    <p class="supplement">
                                        <a href="javascript:;" @click.prevent="mockClick">重新选择</a>
                                    </p>
                                </div>
                            </template>
                            <!-- 正在导入 -->
                            <template v-if="progress == 'importing'">
                                <div class="loading">
                                    <p class="guid">
                                        正在{{ operateName }}<span>{{ importProcess }}</span>
                                    </p>
                                    <div class="container">
                                        <p class="process" :style="{ width: importProcess }"></p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </ui-upload>
                </div>
                <div class="consequence" v-if="progress == 'ending'">
                    <i class="icon-file-success"></i>
                    <p class="guid">{{ successText }}</p>
                    <div class="end-tip">
                        成功{{ operateName }} <span>{{ importResult.success }}</span> 条，失败 <span>{{ importResult.error }}</span> 条
                        <!-- 活动导入临时参会人 -->
                        <template v-if="api === 'activityBoss'"
                            >，客户名称匹配成功 <span>{{ importResult.match }}</span> 条，匹配失败 <span>{{ importResult.notMatch }}</span> 条；</template
                        >
                        <a v-if="importResult.error > 0" :href="downloadUrl" @click="downloadFailDocument">下载失败内容</a>
                    </div>
                </div>
            </template>
        </ui-dialog>
    </div>
</template>
<script>
export default {
    name: 'file-upload',
    data() {
        return {
            isUploading: false, //是否正在上传
            progress: 'unUploaded', //unUploaded 未上传， uploaded 上传完成， importing 正在导入 ending 导入完成
            fileName: '', //上传的文件名称
            currentKey: '',
            importProcess: '0%', //导入的进度
            importResult: {
                success: 0,
                error: 0,
            }, //导入结果
            hasDownloadFileDocument: false, // 是否下载了【操作失败的文件】
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        exname: {
            type: String,
            default: '.xls',
        },
        api: {
            type: String,
            default: '',
        },
        operateName: {
            type: String,
            default: '导入',
        },
        title: {
            type: String,
            default: '批量导入',
        },
        successText: {
            type: String,
            default: '批量导入完成',
        },
        importExtraParams: {
            type: Object,
            default: () => ({}),
        },
        agency: {
            type: String,
            default: '',
        },
        hasConfirmLimit: {
            type: Boolean,
            default: true,
        },
        diyClass: {
            type: String,
            default: '',
        },
        // 是否强制下载操作失败的文件后才能关闭弹窗
        forceDownloadFailDocument: {
            type: Boolean,
            default: false,
        },
        // 未下载操作失败的文件后关闭弹窗时的提示文案  注: forceDownloadFailDocument=true的时候用
        forceDownloadToastText: {
            type: String,
            default: '',
        },
        // 弹框宽度
        width: {
            type: [String, Number],
            default: 420
        }
    },
    watch: {
        show(newValue, oldValue) {
            if (!newValue) {
                this.reset();
            }
        },
    },
    computed: {
        uploadUrl() {
            return `${this.agency}/importer/excel/upload/` + this.api;
        },
        importUrl() {
            return `/importer/excel/upload.json/` + this.api + '/' + this.currentKey + this.getSerializeParams(this.importExtraParams);
        },
        importPercentUrl() {
            return `/importer/excel/download/result/` + this.currentKey;
        },
        downloadUrl() {
            return `${this.agency}/importer/excel/download/result/` + this.api + '/' + this.currentKey;
        },
        // 是否可以关闭弹窗
        canCloseDialog() {
            // 不需要强制下载操作失败的文件 || 当前没有上传操作完成
            if (!this.forceDownloadFailDocument || this.progress !== 'ending') {
                return true;
            }
            /** 需要强制下载操作失败的文件 && 操作完成 **/
            // 没有失败内容
            if (this.importResult.error === 0) {
                return true;
            }
            // 有操作失败内容 && 下载了操作失败的文件后
            if (this.importResult.error > 0 && this.hasDownloadFileDocument) {
                return true;
            }
            return false;
        },
    },
    components: {},
    methods: {
        // 点击下载操作失败的文件
        downloadFailDocument() {
            this.hasDownloadFileDocument = true;
        },
        getSerializeParams(obj) {
            let extraParams = '';
            Object.keys(obj).forEach((item, index) => {
                let separator = index == 0 ? '?' : '&';
                extraParams += separator + item + '=' + obj[item];
            });
            return extraParams;
        },
        cancel() {
            if (this.canCloseDialog) {
                this.$emit('update:show', false);
                return;
            }
            // 需要强制下载操作失败的文件 && 有操作失败内容 && 没有下载操作失败的文件
            if (this.forceDownloadFailDocument && this.importResult.error > 0 && !this.hasDownloadFileDocument) {
                this.$toast({ type: 'warning', content: this.forceDownloadToastText });
            }
        },
        mockClick: function () {
            if (!this.isUploading) {
                this.$refs.upload.mockClick();
            }
        },
        uploadStart(file) {
            this.fileName = file.name;
            this.currentKey = '';
            this.isUploading = true;
        },
        uploadProgress() {},
        uploadEnd(res) {
            let data = res.data || {};
            if (data.success) {
                this.currentKey = data.root;
                this.progress = 'uploaded';
            } else {
                this.$toast({
                    content: data.message,
                    type: 'error',
                });
            }
            this.isUploading = false;
        },
        confirm() {
            if (!this.hasConfirmLimit) {
                this.$toast({
                    content: '您无权限进行此操作！',
                    type: 'error',
                });
                return;
            }
            if (this.progress == 'uploaded' && this.currentKey) {
                this.progress = 'importing';
                this.importProcess = '0%';
                this.$ajax({
                    url: this.importUrl,
                    method: 'POST',
                }).then((res) => {
                    if (res.success) {
                        this.rotateProcess();
                    } else {
                        this.progress = 'uploaded';
                    }
                });
            }
            if (this.progress == 'ending') {
                this.cancel();
            }
        },
        rotateProcess() {
            if (!this.currentKey) {
                return;
            }
            this.$ajax({
                url: this.importPercentUrl,
                method: 'GET',
            }).then((res) => {
                if (res.success) {
                    let processStatuus = res.root.status;
                    //导入完成0 导入中1 导入失败2
                    if (processStatuus == 0 || processStatuus == 1) {
                        this.importProcess = res.root.percent;
                        if (processStatuus == 0) {
                            //显示结果弹窗
                            this.progress = 'ending';
                            this.importResult = res.root;
                            if (res.root.success > 0) {
                                this.$emit('upload-end', res.root);
                            }
                        } else {
                            setTimeout(() => {
                                this.rotateProcess();
                            });
                        }
                    } else if (processStatuus == 2) {
                        this.showImportError(res.root.message);
                    }
                } else {
                    this.showImportError(res.message);
                }
            });
        },
        showImportError(msg) {
            this.progress = 'uploaded';
            this.$toast({
                content: msg,
                type: 'error',
            });
        },
        reset() {
            this.isUploading = false;
            this.progress = 'unUploaded';
            this.fileName = '';
            this.currentKey = '';
            this.importProcess = '0%';
            this.hasDownloadFileDocument = false;
        },
    },
};
</script>

<style lang="less">
.dialog-file-upload {
    .dialog-container {
        padding: 0;
        .dialog-header {
            margin-bottom: 0;
            .title {
                padding: 24px;
                line-height: 20px;
                font-size: 16px;
                font-weight: bold;
                color: #1e2433;
                // border-bottom: 1px solid #f1f1f1;
            }
        }
        .dialog-body {
            .icon-file-done,
            .icon-file-success,
            .icon-file-upload {
                display: block;
                width: 45px;
                height: 40px;
                margin: 0 auto;
                background: url(../../../assets/images/icons-file.png) no-repeat;
            }
            .img-file-upload {
                width: 63px;
                height: 49px;
            }
            .icon-file-done {
                margin-bottom: 8px;
                background-position: 0 -50px;
            }
            .icon-file-success {
                margin-bottom: 14px;
                background-position: 0 -100px;
            }
            .icon-file-upload {
                background-position: 0 4px;
            }
            .consequence {
                padding-top: 42px;
                padding-bottom: 42px;
                text-align: center;
                .guid {
                    line-height: 24px;
                    color: #333;
                }
                .end-tip {
                    margin-top: 5px;
                    font-size: 12px;
                    color: #bcbcbc;
                    span {
                        color: #1da0dd;
                    }
                    a {
                        color: #008af5;
                        &:hover {
                            color: #1361f1;
                        }
                    }
                }
            }
            .files {
                padding: 0 20px;
                .txt {
                    // padding: 15px 0;
                    margin-bottom: 16px;
                    font-weight: 400;
                    color: #363f55;
                    line-height: 20px;
                    a {
                        color: #01a09c;
                        &:hover {
                            color: fade(#01a09c, 70);
                        }
                    }
                }
                .main {
                    position: relative;
                    min-height: 130px;
                    // background: #f5f5f5;
                    background: #f7f8fb;
                    text-align: center;
                    // border: 1px dotted #bfbfbf;

                    border: 1px dotted #d3dce6;
                    border-radius: 5px;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .upload {
                        position: relative;
                        // padding-top: 15px;
                        cursor: pointer;
                        .guid {
                            line-height: 18px;
                            color: #8493a6;
                            font-size: 13px;
                        }
                        .supplement {
                            line-height: 18px;
                            font-size: 13px;
                            color: #8493a6;
                            margin-top: 5px;
                        }
                    }
                    .loaded {
                        position: relative;
                        // padding-top: 29px;
                        a {
                            font-size: 12px;
                            color: #008af5;
                            &:hover {
                                color: #1361f1;
                            }
                        }
                    }
                    .loading {
                        // position: absolute;
                        // top: 55px;
                        // left: 130px;
                        .container {
                            position: relative;
                            width: 181px;
                            height: 3px;
                            margin: 14px auto 0;
                            border: 1px solid #bfbfbf;
                            border-radius: 5px;
                            .process {
                                position: absolute;
                                width: 10%;
                                height: 5px;
                                top: -1px;
                                background: #1da0dd;
                                border: 5px;
                            }
                        }
                    }
                    .guid {
                        display: -webkit-box;
                        overflow: hidden;
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 2;
                    }
                }
            }
        }
        .dialog-footer {
            padding: 24px;
            margin-top: 0;
            .btns {
                text-align: right;
                .btn {
                    padding: 2px 22px;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
