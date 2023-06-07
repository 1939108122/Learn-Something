<template>
    <div v-if="formateList.length" class="attachment-preview">
        <!-- 自定义触发预览的slot -->
        <div v-if="$slots.default" @click.prevent="preview">
            <slot></slot>
        </div>
        <div v-else class="attachment-preview-default-panel" @click.prevent="preview" :style="`width:${size}px;height:${size}px`">
            <img :src="defaultUrl" alt="">
            <span class="count">{{ formateList.length }}</span>
        </div>
        <div v-show="false" v-viewer="{movable: false, show: onViewerShow, hide: onViewerHide}" ref="attcahPreview">
            <template v-if="show">
                <img
                    :src="itm"
                    :key="idx"
                    alt="" v-for="(itm, idx) in formateList" />
            </template>
        </div>
    </div>
</template>
<script>
/**
 * @params list
 * 1 、 [xxxxx.png]  后缀必须是图片
 * 2 、 [{url:'xxxxx', fileType: 'png'}]  fileType 必须是图片类型
 * 3 、 [{url: xxx.png}]  后缀必须是图片
 * 4 、 [{attUrl: xxx.png}]  后缀必须是图片
 */
import storage from '@/utils/tools/localstorage';
export default {
    data () {
        return {
            show: false,
            imgTypeRules: /(\.|\/)(bmp|png|jpg|jpeg|gif)$/i,
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
        defaultUrl: { // 缩略图
            type: String,
            default: require('@/assets/images/wxdefault.png')
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
    computed: {
        formateList () {
            if (!Array.isArray(this.list)) return [];
            let data = this.list;
            let imgArr = [];
            data.forEach(item => {
                let __item = '';
                let jdugeTyle = '';

                if (typeof item === 'object') {
                    if (item.fileType) {
                        __item = item.url;
                        jdugeTyle = '.' + item.fileType;
                    } else {
                        __item = item.attUrl || item.url;
                        jdugeTyle = __item;
                    }
                } else {
                    __item = item;
                    jdugeTyle = __item;
                }

                if(this.imgTypeRules.test(jdugeTyle)) {
                    imgArr.push(__item);
                };

            });
            return imgArr;
        },
    },
    methods: {
        preview () {
            this.show = true;
            this.$nextTick(() => {
                this.$refs.attcahPreview.$viewer.show();

                let previewImg = document.querySelectorAll('.viewer-container');
                if ((previewImg || []).length) {
                    previewImg.forEach(item => {
                        item.addEventListener('click', this.addListener);
                    });
                }
            });
        },
        onViewerShow() {
            this.$parent.$emit('viewer-show');
        },
        onViewerHide (res) {
            let previewImg = document.querySelectorAll('.viewer-container');
            if ((previewImg || []).length) {
                previewImg.forEach(item => {
                    item.removeEventListener('click', this.addListener);
                });
            } 
            this.$parent.$emit('viewer-hide');
        },
        addListener (res) {
            if (res.target.className == 'viewer-transition') {
                storage.set('crmImgSrc', res.target.getAttribute('src'), true);
                let url = this.isExternalResources ? '/web/zoom/pic?isExternalResources=1' : '/web/zoom/pic';
                window.open(url);
            }
        }
    }
};
</script>
<style lang="less">
.attachment-preview {
    display: inline-block;
    vertical-align: top;
    .attachment-preview-default-panel {
        position: relative;
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
        vertical-align: top;
        img {
            display: inline-block;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            vertical-align: middle;
        }
        .count {
            position: absolute;
            padding: 2px 2px;
            min-width: 16px;
            // height: 12px;
            top: -5px;
            right: -5px;
            border-radius: 12px;
            background: #53cac3;
            color: #fff;
            font-size: 10px;
            text-align: center;
            line-height: 12px;
        }
    }
}
</style>