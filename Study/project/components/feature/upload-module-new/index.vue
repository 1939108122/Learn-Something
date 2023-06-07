<template>
    <!-- 上传带进度-->
    <div class="_upload-contain-box-new">
        <ui-upload ref="update" custom :exname="limit.exname" :multiple="multiple"
            :filesize="limit.filesize" :filesizeUnit="'M'" :uploadedNum="attachments.length" :action="action" :total="limit.total"
            @uploadStart="uploadStart" @uploadProgress="uploadProgress" @uploadEnd="uploadContractEnd">
            <div class="_new-contract-upload-box" @click="testClick">
                <slot>
                    <div class="upload-box" @dragenter="dragenter" @dragleave="dragleave" :class="{enter: enterBox}">
                        <img src="@/assets/images/icon-upload.png" />
                        <div class="intro-box">
                            <p>请将文件拖拽到此处，或<span>点击上传</span></p>
                            <p>最多上传{{limit.total}}个文件，大小不超过{{limit.filesize}}M，支持{{(limit.exname || '').replace(/\./g, '/').substring(1)}}</p>
                        </div>
                    </div>
                </slot>
            </div>
        </ui-upload>
        <slot name="tips"></slot>
        <Preview :attachments="attachments" @deleteImg="deleteImg" :showDelete="true"></Preview>
    </div>
</template>

<script>
import Preview from './preview.vue';
export default {
    name: 'upload-module',
    components: {
        Preview
    },
    data () {
        return {
            attachments: [],
            enterBox: false
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: true
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
                    exname: '.pdf.jpg.png.xls.xlsx.doc.docx.pptx.jpeg.rar.zip'
                };
            }
        },
    },
    methods : {
        testClick() {
            this.$refs.update.mockClick();
        },
        uploadStart (res) {
            this.enterBox = false;
            this.$emit('uploadStart', res);
        },
        uploadProgress (res) {
            this.$emit('uploadProgress', res);
        },
        uploadContractEnd (res) {
            if (res.data.code == 1 && res.data.data) {
                if (Object.prototype.toString.call(this.attachments) === '[object Array]') {
                    this.attachments = this.attachments.concat(res.data.data);
                }
                this.emitChange();
            } else if (res.data.code != 1) {
                this.$toast({
                    type: 'error',
                    content: res.data.message
                });
            }
            this.$emit('uploadContractEnd', res);
        },
        deleteImg (index) {
            this.attachments.splice(index, 1);
            this.emitChange();
        },
        emitChange () {
            this.$emit('changeItem', this.attachments);
        },
        dragenter (res) {
            this.enterBox = true;
        },
        dragleave (res) {
            this.enterBox = false;
        },
    },
    watch: {
    }
};
</script>
<style lang="less">
._upload-contain-box-new{
    ._new-contract-upload-box{
        .upload-box{
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 600px;
            border: 1px dashed #D3DCE6;
            border-radius: 4px;
            padding: 20px 16px;
            background: #F7F8FB;
            cursor: pointer;
            >img,div{
                pointer-events: none;
            }
            &.enter{
                border-color: #00A6A7;
            }
            img{
                flex-shrink: 0;
                flex-grow: 0;
                width: 45px;
                height: 35px;
                margin-right: 12px;
            }
            .intro-box{
                line-height: 18px;
                color: #8493A6;
                font-size: 13px;

                p:nth-of-type(1){
                    margin-bottom: 6px;
                    span{
                        cursor: pointer;
                        color: #00A6A7;
                    }
                }
            }
        }
    }
}
</style>
