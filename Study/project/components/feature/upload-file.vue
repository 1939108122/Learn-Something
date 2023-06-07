<!-- 不要用了 -->
<!--文件上传-->
<template>
    <div class="common-upload-container">
        <div class="file-list">
            <template v-if="$slots.fileList">
                <slot name="fileList"></slot>
            </template>
            <template v-else>
                <div v-for="(i, n) in fileList" :key="n" class="block-item" :style="`width:${size}px;height:${size}px;`">
                    <!-- pdf -->
                    <a v-if="/pdf/.test(i.type)" :href="i.url" target="_blank">
                        <img src="@/assets/images/new-pdf.png" alt="" class="file-type" />
                    </a>

                    <!-- doc -->
                    <a v-else-if="/doc/.test(i.type)" :href="i.url" target="_blank">
                        <img src="@/assets/images/word.png" alt="" class="file-type" />
                    </a>

                    <!-- xls -->
                    <a v-else-if="/xls/.test(i.type)" :href="i.url" target="_blank">
                        <img src="@/assets/images/excel.png" alt="" class="file-type" />
                    </a>
                    <!--  rar -->
                    <a v-else-if="/rar/.test(i.type)" :href="i.url" target="_blank">
                        <img src="@/assets/images/icon-rar.png" alt="" class="file-type" />
                    </a>
                    <!-- zip -->
                    <a v-else-if="/zip/.test(i.type)" :href="i.url" target="_blank">
                        <img src="@/assets/images/icon-zip.png" alt="" class="file-type" />
                    </a>
                    <!-- 图片 -->
                    <ui-image v-else fit="cover" :src="i.url" :preview-src-list="imgPreviewList" class="preview-img"></ui-image>

                    <i v-if="!isPreview" class="ui-icon-close delete-btn" @click="onDelete(n)"></i>
                </div>
            </template>

            <template v-if="!isPreview">
                <label class="block-item add-btn" v-if="fileList.length < limitCount">
                    <input type="file" :accept="accept" :multiple="multiple" @change="onFileChange" />
                    <template v-if="$slots.default">
                        <slot></slot>
                    </template>
                    <img v-else src="@/assets/images/pic-default.jpg" alt="" class="camera-img" />
                </label>

                <div v-if="showTip" class="upload-tip">
                    <slot name="tip">支持{{ limitSize }}M以内，JPG/PNG/BMP格式</slot>
                </div>
            </template>
        </div>
        <!-- <template v-if="!isPreview">
            <label class="block-item add-btn" v-if="fileList.length < limitCount">
                <input type="file" :accept="accept" :multiple="multiple" @change="onFileChange" />
                <template v-if="$slots.default">
                    <slot></slot>
                </template>
                <img v-else src="@/assets/images/pic-default.jpg" alt="" class="camera-img" />
            </label>

            <p v-if="showTip" class="upload-tip">
                <slot v-if="$scopedSlots.tip" name="tip"></slot>
                <template v-else>支持{{ limitSize }}M以内，JPG/PNG/BMP格式</template>
            </p>
        </template> -->
    </div>
</template>

<script>

// 不要用了 \ 不要用了 \ 不要用了，会被逐步替换掉
// 用 <UpLoad></UpLoad> 或者 upload-module-new/index.vue
// 用 <UpLoad></UpLoad> 或者 upload-module-new/index.vue
// 用 <UpLoad></UpLoad> 或者 upload-module-new/index.vue

export default {
    props: {
        value: Array, // url列表
        accept: String, // 可选择的文件类型

        params: {
            // 其他参数
            type: Object,
            default: () => ({})
        },

        // 是否可多选
        multiple: {
            type: Boolean,
            default: false
        },

        // 限制数量
        limitCount: {
            type: Number,
            default: 3
        },

        // 限制大小（单位M）
        limitSize: {
            type: Number,
            default: 2
        },

        // 上传api
        api: {
            type: String,
            default: '/config/upload.json'
        },

        showTip: {
            type: Boolean,
            default: true
        },

        solveMethod: {
            type: Function,
            default: (res) => {
                return res.root && res.root.urls || [];
            }
        },
        // formData对象提交携带拓展参数
        extends: {
            type: Object,
            default: () => ({}),
        },
        isPreview: Boolean, // 是否仅预览
        size: [Number, String], // 图片宽高
        needSeparate: Boolean // 是否需要拆分图片和其他类型
    },
    data() {
        return {
            fileList: [],
            imgPreviewList: [] // 图片预览列表
        };
    },
    watch: {
        value: {
            handler(list) {
                if (!list.length) return;
                if (this._emitValue && this._emitValue.join() == list.join()) return; // 避免重复触发

                this.fileList = list.map(i => {
                    return {
                        url: i,
                        type: this.getFileTypeByUrl(i)
                    };
                });

                if (this.needSeparate) {
                    this.fileList = this.separateFile(this.fileList); // 根据文件类型分组
                }
            },
            immediate: true
        },
        fileList(list) {
            this._emitValue = list.map(i => i.url);
            this.imgPreviewList = this._emitValue.filter(i => !/pdf|doc|xls|rar|zip/.test(this.getFileTypeByUrl(i))); // 过滤出图片类型url
            this.$emit('input', this._emitValue);
        }
    },
    methods: {
        separateFile(list) {
            let pdfList = [];
            let docList = [];
            let xlsList = [];
            let imgList = [];
            list.forEach(i => {
                if (i.type == 'pdf') {
                    pdfList.push(i);
                } else if (i.type == 'doc') {
                    docList.push(i);
                } else if (i.type == 'xls') {
                    xlsList.push(i);
                }  else {
                    imgList.push(i);
                }
            });
            return pdfList.concat(docList).concat(xlsList).concat(imgList);
        },

        getFileTypeByUrl(url) { // 根据url获取文件类型
            return url.substr(url.lastIndexOf('.') + 1);
        },

        onDelete(n) {
            this.fileList.splice(n, 1);
        },

        onFileChange(e) { // 选择文件后
            if (!e) return;
            let files = [].slice.call(e.target.files); // 转为数组
            e.target.value = '';
            let allowCount = this.limitCount - this.fileList.length; // 还可上传的个数
            files = files.slice(0, allowCount); // 自动截取有限个数，忽略超出数量部分

            let valid = true;
            for (let n = 0; n < files.length; n++) {
                if (files[n].size / 1024 / 1024 > this.limitSize) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                this.$toast({ type: 'error', content: `文件大小不能超过${this.limitSize}M` });
                return;
            }

            let formData = new FormData();
            files.forEach(file => {
                formData.append('file', file);
            });

            // 用法跟如下重复
            Object.keys(this.extends || {}).forEach(item => {
                formData.append(item, this.extends[item]);
            });

            let keys = Object.keys(this.params);
            if (keys.length) {
                keys.forEach(k => {
                    formData.append(k, this.params[k]);
                });
            }

            this.$ajax({
                url: this.api,
                method: 'POST',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {
                //const urls = res.root && res.root.urls || [];
                const urls = this.solveMethod(res) || [];

                urls.forEach(i => {
                    this.fileList.push({
                        url: i,
                        type: this.getFileTypeByUrl(i)
                    });
                });
            });
        }
    }
};
</script>
