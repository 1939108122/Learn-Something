<template>
    <!-- 上传带进度-->
    <div class="_upload-contain-box">
        <ui-upload ref="attachments" custom :exname="limit.exname" :multiple="multiple" :oneByOne="oneByOne" v-viewer :uploadFieled="uploadFieled"
            :filesize="limit.filesize" :filesizeUnit="'M'" :uploadedNum="attachments.length" :action="action" :total="limit.total"
            @uploadStart="uploadStart" @uploadProgress="uploadProgress" @uploadEnd="uploadContractEnd">
            <div class="_new-contract-upd-box">
                <div class="img-item-box" v-for="(item, idx) in attachments" :key="idx + item.fileName">
                    <i class="ui-icon-circle-close" @click="deleteFile(idx)" v-if="uploadEndStatus[item.progressIndex]"></i>
                    <a class="other-type" @click="downLoad(item)" v-if="isTypeFile(item.fileName, 'pdf')">
                        <i :style="{background: 'url(' + pdf + ')'}"></i>
                    </a>
                    <a class="other-type" @click="downLoad(item)" v-else-if="isTypeFile(item.fileName, 'doc') || isTypeFile(item.fileName, 'docx')">
                        <i :style="{background: 'url(' + word + ')'}"></i>
                    </a>
                    <a class="other-type" @click="downLoad(item)" v-else-if="isTypeFile(item.fileName, 'xls') || isTypeFile(item.fileName, 'xlsx')">
                        <i :style="{background: 'url(' + excel + ')'}"></i>
                    </a>
                    <a class="other-type" @click="downLoad(item)" v-else-if="isTypeFile(item.fileName, 'rar')">
                        <i :style="{background: 'url(' + rar + ')'}"></i>
                    </a>
                    <a class="other-type" @click="downLoad(item)" v-else-if="isTypeFile(item.fileName, 'zip')">
                        <i :style="{background: 'url(' + zip + ')'}"></i>
                    </a>
                    <a class="other-type" @click="downLoad(item)" v-else-if="isTypeFile(item.fileName, 'pptx')">
                        <i :style="{background: 'url(' + pptx + ')'}"></i>
                    </a>
                    <a class="other-type" @click="downLoad(item)" v-else-if="isTypeFile(item.fileName, 'msg') || isTypeFile(item.fileName, 'eml')">
                        <i class="icrm-email"></i>
                    </a>
                    <a class="other-type" @click="downLoad(item)" v-else-if="isTypeFile(item.fileName, 'avi') || isTypeFile(item.fileName, 'rmvb') || isTypeFile(item.fileName, 'mp4') || isTypeFile(item.fileName, 'mov') || isTypeFile(item.fileName, 'flv')">
                        <i :style="{background: 'url(' + videoImg + ')'}"></i>
                    </a>
                    <img :src="item.fileUrl" v-else/>
                    <div class="shadow" v-if="!uploadEndStatus[item.progressIndex]">
                        <!-- 上传shadow -->
                        <div class="progress">
                            <div :style="{width: progress[item.progressIndex] + '%'}" class="progress-bar progress-bar-info">
                            </div>
                        </div>
                    </div>
                </div><!-- 注释用于消除空白字符
                --><span :class="['upload-btn', {'active': enterUploadBox}]" ref="uploadBtn" v-if="limit.total ? attachments.length < limit.total : true" @click="$refs.attachments.mockClick()"></span>
            </div>
        </ui-upload>
        <p class="tip">{{ autoTipText || uploadTips }}</p>
    </div>
</template>

<script>
/**
 * formatUrl (res, progressIndex) {
 *      let arr = [];
 *      res.foreach(item => {
 *          arr.push({
 *              fileName: item.url.substr(item.url.lastIndexOf('.')),
 *              fileUrl: item.url,
 *              progressIndex
 *          });
 *      })
 *      return arr;
 * }
 */
import { exportFile } from '@/utils/tools/tools.js';
export default {
    name: 'upload-module',
    data () {
        return {
            pdf: require('@/assets/images/new-pdf.png'),
            word: require('@/assets/images/word.png'),
            excel: require('@/assets/images/excel.png'),
            rar: require('@/assets/images/icon-rar.png'),
            zip: require('@/assets/images/icon-zip.png'),
            pptx: require('@/assets/images/icon-pptx.png'),
            videoImg: require('@/assets/images/file-default/video.png'),
            attachments: [],
            progress: {},
            uploadEndStatus: {},
            count: 0,
            resultAttachment: [],
            currentLen: 0,
            enterUploadBox: false,
        };
    },
    props: {
        urls: {
            type: Array,
            default: () => ([])
        },
        action: {
            type: String,
            default: '/file/upload.json?biz=MISSION'
        },
        limit: {
            type: Object,
            default: () => {
                return {
                    filesize: 10,
                    total: 10,
                    exname: '.pdf.jpg.jpeg.png.bmp'
                };
            }
        },
        uploadTips: {
            type: String,
            default: '支持上传10M以内，PDF/JPEG/JPG/PNG/BMP格式，数量最多上传10个；'
        },
        uploadFieled: {
            type: Object,
            default: () => ({})
        },
        oneByOne: { // 一次只能上传一个的接口
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: true
        },
        crmHost: {
            // 兼容老接口，没有返回上传文件的host的情况
            type: Boolean,
            default: false
        },
        formatUrl: { // 用于格式化反显数据，
            type: [Function, undefined],
            default: undefined
        },
        needInitChange: {
            type: Boolean, // 是否需要初始化就出发一次change
            default: false
        },

        autoTip: { // 是否自动生成 tips
            type: Boolean,
            default: false
        }
    },
    computed: {
        autoTipText() {
            if (!this.autoTip) return '';
            const exname = this.limit.exname.toUpperCase().replace(/\./g, '/').substring(1);
            return [
                `支持上传${this.limit.filesize}M以内`,
                exname ? `${exname}格式` : null,
                `数量最多上传${this.limit.total}个`
            ].filter(i => i).join('，');
        }
    },
    methods : {
        downLoad (item) {
            let url = item.fileUrl;
            if (url.indexOf('blob:') === 0) {
                return;
            } else {
                if(this.crmHost) {
                    url = `${this.crmHost ? '/config/download?url=' + url : url}`;
                }
                exportFile(url);
            }
        },
        deleteFile (idx) {
            this.attachments.splice(idx, 1);
            this.resultAttachment.splice(idx, 1);

            this.$emit('updateAttachments', this.resultAttachment);
        },
        uploadContractEnd (res) {
            if (res.data && (res.data.code == 1 || res.data.success)) {
                if (!this.oneByOne) {
                    if (this.formatUrl) {
                        this.resultAttachment = this.resultAttachment.concat(this.formatUrl(res.data, this.resultAttachment.length));
                    } else {
                        this.resultAttachment = this.resultAttachment.concat(res.data);
                    }
                } else {
                    if (this.formatUrl) {
                        this.resultAttachment = this.resultAttachment.concat(this.formatUrl(res.data, this.resultAttachment.length));
                    } else {
                        this.resultAttachment = this.resultAttachment.concat([res.data]);
                    }
                }

                // updateAttachments 不维护，尽量不用
                this.attachments = JSON.parse(JSON.stringify((this.resultAttachment || []).map((item, index) => {
                    this.progress[index] = 100;
                    this.uploadEndStatus[index] = true;
                    return {
                        ...item,
                        progressIndex: index
                    };
                })));
                this.progress = JSON.parse(JSON.stringify(this.progress));
                this.$emit('updateAttachments', this.resultAttachment);
                this.uploadEndStatus = JSON.parse(JSON.stringify(this.uploadEndStatus));
                this.count = this.attachments.length;
            } else {
                // 兼容 this.count - this.currentLen 负数
                // vue 改写了splice，不符合原生方法预期
                this.attachments.splice(Math.max(this.count - this.currentLen, 0), this.currentLen);
                this.$toast({
                    type: 'error',
                    content: '上传失败'
                });
            }

        },
        uploadProgress (res) {
            this.progress[this.count-1] = res;
        },
        uploadStart (res) {
            this.enterUploadBox = false;
            const windowURL = window.URL || window.webkitURL;
            let attachments = [];
            this.progress[this.count] = 0;
            this.progress = JSON.parse(JSON.stringify(this.progress));
            this.uploadEndStatus[this.count] = false;
            this.uploadEndStatus = JSON.parse(JSON.stringify(this.uploadEndStatus));

            let starArr = [];

            if (this.oneByOne) {
                starArr = [res];
            } else {
                starArr = res;
            }
            if (starArr.length) {
                for(var i = 0; i < starArr.length; i++) {
                    let dataURl = '';
                    let name = starArr[i].name.split('.');
                    let exname = (this.limit.exname || '').split('.').filter(item=>item);
                    if (exname.includes((name[name.length - 1] || '').toLowerCase())) {
                        dataURl = windowURL.createObjectURL(starArr[i]);
                    }
                    attachments.push({
                        fileName: starArr[i].name,
                        fileUrl: dataURl,
                        progressIndex: this.count
                    });
                }
                this.currentLen = starArr.length;

                this.attachments = this.attachments.concat(attachments);
                this.count++ ;
            }
        },
        isTypeFile (fileName = '', type) {
            let fileNameList = fileName.split('.');
            return fileNameList[fileNameList.length - 1].toLowerCase().indexOf(type) > -1;
        }
    },
    watch: {
        urls: {
            handler(arr, old) {
                if (JSON.stringify(arr) == JSON.stringify(old)){
                    return;
                }
                let attachments = (arr || []).map((url, index) => {
                    this.uploadEndStatus[index] = true;
                    if (typeof url === 'object') {
                        return {
                            fileName: url?.fileName || '',
                            fileUrl: url?.fileUrl || '',
                            progressIndex: index
                        };
                    }
                    return {
                        fileName: url.substr(url.lastIndexOf('.')),
                        fileUrl: url,
                        progressIndex: index
                    };
                });
                this.attachments = JSON.parse(JSON.stringify(attachments));
                this.resultAttachment = JSON.parse(JSON.stringify(attachments));
                this.count = arr.length;

                if (this.needInitChange) {
                    this.$emit('updateAttachments', this.resultAttachment);
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        if(this.$refs.uploadBtn) {
            this.$refs.uploadBtn.addEventListener('dragenter', () => {
                this.enterUploadBox = true;
            });

            this.$refs.uploadBtn.addEventListener('dragleave', () => {
                this.enterUploadBox = false;
            });
        }
    }
};
</script>
<style lang="less">
._new-contract-upd-box{
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-column-gap: 12px;
    grid-row-gap: 12px;
    .upload-btn{
        position: relative;
        display: inline-block;
        width: 100px;
        height: 100px;
        line-height: 100px;
        margin-right: 20px;
        border-radius:8px;
        border: 1px dashed #CDD0D6;
        vertical-align: top;
        background: #F7F8FB;
        text-align: center;
        cursor: pointer;
        &:after{
            position: absolute;
            content: '';
            width: 24px;
            height: 2px;
            background: #939CBC;
            border-radius: 1px;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%) rotateZ(90deg);
        }
        &:before{
            position: absolute;
            content: '';
            width: 24px;
            height: 2px;
            background: #939CBC;
            border-radius: 1px;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
        &:hover{
            background: #E4E8F0;
        }
        &.active{
            background: #E4E8F0;
        }
    }
    .icrm-email{
        display: inline-block;
        vertical-align: middle;
        width: 100px;
        height: 100px;
        line-height: 100px;
        font-size: 46px;
        color: #B8B8B8;
        cursor: pointer;
        text-align: center;
    }
    .img-item-box{
        display: inline-block;
        vertical-align: middle;
        // margin-right: 12px;
        // margin-bottom: 12px;
        position: relative;
        width: 100px;
        height: 100px;
        .ui-icon-circle-close{
            display: none;
            position: absolute;
            right: -5px;
            top: -5px;
            height: 22px;
            width: 22px;
            border-radius: 50%;
            background: #fff;
            font-size: 20px;
            color: #5D7D80;
            cursor: pointer;
            &:hover{
                color: #9Fa6B5;
            }
            &:before{
                top: 1px;
                left: 0.5px;
                position: absolute;
            }
            &:after{
                content: '';
                display: block;
                position: absolute;
                left: -3px;
                top: -3px;
                height: 28px;
                width: 28px;
                background:transparent;
                opacity: .2;
            }
        }
        img{
            width: 100px;
            height: 100px;
            border-radius: 8px;
        }
        .shadow{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 15;
            top: 0;
            right: 0;
            background: rgba(37, 40, 48, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            .progress{
                height: 8px;
                margin-bottom: 0;
                overflow: hidden;
                background-color: #f5f5f5;
                border-radius: 4px;
                width: 90%;
            }
        }
        .other-type{
            display: block;
            height: 100%;
            border-radius: 8px;
            i{
                display: block;
                height: 100%;
                background-size: cover !important;
            }
            .icrm-email {
                display: inline-block;
                vertical-align: middle;
                width: 100px;
                height: 100px;
                line-height: 100px;
                font-size: 46px;
                color: #b8b8b8;
                cursor: pointer;
                text-align: center;
            }
        }
        &:hover{
            .ui-icon-circle-close{
                display: block;
            }
        }
    }
}
._upload-contain-box{
    .tip{
        padding-top: 10px;
        color: #9FA6B5;
        font-size: 12px;
        line-height: 1.4;
    }
}
</style>