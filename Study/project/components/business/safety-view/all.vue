<template>
    <div v-if="list.length" class="attachment-preview-all">
        <viewImage :list="image" :size="size" :isExternalResources="isExternalResources"></viewImage>

        <template v-for="item in otherFiles">
            <a class="other-type" :href="(item.fileUrl || '').replace('http:', 'https:')" target="_blank" v-if="isTypeFile(item.fileName, 'pdf')" :style="`width:${size}px;height:${size}px;`">
                <i :style="{background: 'url(' + pdf + ')'}"></i>
            </a>

            <a class="other-type" :href="(item.fileUrl || '').replace('http:', 'https:')" target="_blank" v-else-if="isTypeFile(item.fileName, 'doc') || isTypeFile(item.fileName, 'docx')" :style="`width:${size}px;height:${size}px;`">
                <i :style="{background: 'url(' + word + ')'}"></i>
            </a>

            <a class="other-type" :href="(item.fileUrl || '').replace('http:', 'https:')" target="_blank" v-else-if="isTypeFile(item.fileName, 'xls') || isTypeFile(item.fileName, 'xlsx')" :style="`width:${size}px;height:${size}px;`">
                <i :style="{background: 'url(' + excel + ')'}"></i>
            </a>
        </template>
    </div>
</template>
<script>
/**
 * @params list
 * 1 、 [{fileUrl:'xxxxx', fileType: 'png', fileName: ''}]  fileType 必须是图片类型
 */

import viewImage from './index.vue';
export default {
    data () {
        return {
            pdf: require('@/assets/images/new-pdf.png'),
            word: require('@/assets/images/word.png'),
            excel: require('@/assets/images/excel.png'),
            image: [],
            otherFiles: []
        };
    },
    props: {
        list: {
            type: Array,
            default: () => []
        },
        size: { // 宽高
            type: [Number, String],
            default: 94
        },
        /* 
        ** 是否是外部资源
        ** 外部资源 不需要 在点击图片打开新页面时，src加上前缀 /zoom/pic/img?src=
        */
        isExternalResources: {
            type: Boolean,
            default: false
        }
    },
    components: {viewImage},
    watch: {
        list: {
            handler (val) {
                if (val) {
                    let image = [],
                        otherFiles = [];
                    (val || []).forEach(item => {
                        if (['png', 'jpg', 'jpeg', 'bmp', 'gif'].includes((item.fileType || '').toLowerCase())) {
                            item.url = item.fileUrl;
                            image.push(item);
                        } else {
                            otherFiles.push(item);
                        }
                    });
                    this.image = image;
                    this.otherFiles = otherFiles;
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        isTypeFile (fileName, type) {
            let fileNameList = (fileName || '').split('.');
            return fileNameList[fileNameList.length - 1].toLowerCase().indexOf(type) > -1;
        }
    },
};
</script>
<style lang="less">
.attachment-preview-all{
    .other-type{
        display: inline-block;
        margin-right: 10px;
        i{
            display: block;
            height: 100%;
            background-size: cover !important;
        }
    }
}
</style>