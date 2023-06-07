<template>
    <!-- 上传带进度-->
    <div class="_upload-operation-list" v-if="(attachments || []).length">
        <ul class="document-box">
            <li v-for="(item, idx) in attachments" :key="idx" :class="{'no-delete': !showDelete}" @click="preview(item, idx)">
                <i :class="['file-icon', iconClass(item)]"></i>
                <div class="file-name">{{ item.fileName }}</div>
                <ui-tooltip2 v-if="isImg(item)" effect="dark" placement="top" content="预览">
                    <ui-image
                        fit="cover"
                        class="preview-img"
                        :src="img"
                        :preview-src-list="[item.fileUrl]"
                        :ref="'image'+idx"
                        @click.stop
                        @show="show"
                        @hide="hide"
                    />
                </ui-tooltip2>
                <ui-tooltip2 v-else effect="dark" placement="top" content="下载">
                    <a :href="item.fileUrl" target="_blank" class="icrm-download-20220310 icon"></a>
                </ui-tooltip2>
                <ui-tooltip2 effect="dark" placement="top" content="删除">
                    <i v-if="showDelete" class="icrm-delete-item icon" @click.stop="deleteImg(idx)"></i>
                </ui-tooltip2>
            </li>
        </ul>
    </div>
</template>

<script>
const typeList = {
    xls: 'icrm-xls',
    xlsx: 'icrm-xls',
    doc: 'icrm-doc',
    docx: 'icrm-doc',
    msg: 'icrm-email',
    eml: 'icrm-email',
    pdf: 'icrm-pdf',
    zip: 'icrm-zip',
    rar: 'icrm-rar',
    jpg: 'icrm-img',
    png: 'icrm-img',
    jpeg: 'icrm-img',
    bmp: 'icrm-img',
};

let SET = new Set();
import storage from '@/utils/tools/localstorage';
import {fileDownlod} from '@/utils/tools/tools.js';
export default {
    name: 'upload-preview',
    data () {
        return {
            img: require('@/assets/images/image-preview.png'),
        };
    },
    props: {
        attachments: {
            type: Array,
            default: () => {
                return [];
            }
        },
        showDelete: {
            type: Boolean,
            default: false
        },
        needPreview: {
            type: Boolean, // 是否需要预览页打开
            default: false
        }
    },
    methods : {
        deleteImg (index) {
            // 删除
            this.$emit('deleteImg', index);
        },
        fileType (item) {
            return item.fileType || ((item.fileName || '').split('.').pop() || '').toLowerCase();
        },
        isImg (item) {
            return ['jpg', 'jpeg', 'png', 'bmp'].includes(this.fileType(item));
        },
        iconClass (item) {
            return typeList[this.fileType(item)];
        },
        preview(item, idx) {
            if (this.isImg(item)) {
                this.$refs['image'+idx][0].showViewer = true;
                return;
            }
            fileDownlod(item.fileUrl);
        },
        show () {
            if(this.needPreview) {
                this.$nextTick(()=>{
                    SET.add(document.querySelectorAll('.ui-image-viewer__wrapper img')[0]);

                    SET.forEach(item =>{
                        item.addEventListener('click', (e)=>{
                            storage.set('crmImgSrc', e.target.getAttribute('src'), true);
                            window.open('/web/zoom/pic');
                        });
                    });
                });
            }
        },
        hide () {
            SET.clear();
        }
    },
    watch: {
    }
};
</script>
<style lang="less">
._upload-operation-list {
    margin-top: 16px;
    .document-box{
        li {
            display: flex;
            max-width: 600px;
            margin-top: 8px;
            border-radius: 4px;
            border: 1px solid #F7F8FB;
            padding: 0 12px;
            line-height: 36px;
            background: #F7F8FB;
            &:hover{
                border: 1px solid #00bebd;
            }
            &:last-child {
                margin-bottom: 20px;
            }
            .file-name {
                width: calc(~'100% - 78px');
                margin-right: 10px;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
            .file-icon {
                margin-right: 8px;
            }
            .icrm-delete-item {
                margin-left: 12px;
            }
            .icon {
                position: relative;
                top: 10px;
                height: 16px;
                color: #00a6a7;
                line-height: 16px;
                &:hover{
                    cursor: pointer;
                    color: #00a6a7;
                    position: relative;
                    &::before{
                        position: relative;
                        z-index: 2;
                    }
                    &::after{
                        content: '';
                        display: block;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translateY(-50%) translateX(-50%);
                        border-radius: 4px;
                        width: 20px;
                        height: 20px;
                        background: #E4E8F0;
                        z-index: 1;
                    }
                }
            }
            .icrm-xls {
                color: #4cb94d;
            }
            .icrm-doc {
                color: #2b9bff;
            }
            .icrm-pdf {
                color: #ff697d;
            }
            .icrm-email {
                font-size: 12px;
            }
            .icrm-zip {
                display: inline-block;
                position: relative;
                top: 9.5px;
                width: 16px;
                height: 16px;
                background: url('~@/assets/images/icon-rar.png');
                background-size: cover;
            }
            .icrm-rar{
                display: inline-block;
                position: relative;
                top: 9.5px;
                width: 16px;
                height: 16px;
                background: url('~@/assets/images/icon-zip.png');
                background-size: cover;
            }
            .icrm-img{
                display: inline-block;
                position: relative;
                top: 9.5px;
                width: 16px;
                height: 16px;
                background: url('~@/assets/images/task/img.png');
                background-size: cover;
            }
            &.no-delete{
                .file-name {
                    width: calc(~'100% - 41px');
                }
            }
        }
        .ui-image{
            overflow: inherit;
        }
        .ui-image.preview-img {
            flex-shrink: 0;
            position: relative;
            top: 10px;
            height: 16px;
            width: 16px;
            &:hover{
                position: relative;
                &:after{
                    content: '';
                    display: block;
                    position: absolute;
                    top: -2px;
                    left: -2.5px;
                    border-radius: 4px;
                    width: 20px;
                    height: 20px;
                    background: #E4E8F0;
                    z-index: 1;
                }
                img{
                    position: relative;
                    z-index: 2;
                }
            }
        }
        .font-bold{
            font-weight: bold;
        }
    }
}
</style>
