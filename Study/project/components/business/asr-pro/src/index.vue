<template>
    <div class="asr-pos" :class="{ 'is-audio': isAudio }" :style="{ left: left + 'px' }">
        <audio ref="audio" :src="audio_url" controls hidden @canplay="onCanplay" @play="onPlay()" @ended="onEnded()"></audio>
        <template v-if="isAudio">
            <div v-show="showHeader" class="dialogue-header">
                <h3 class="title">
                    {{ title }}
                    <i class="audio-time">{{ startTime ? formatDate(new Date(startTime), 'yyyy/MM/dd HH:mm:ss') : '' }}</i>
                </h3>
                <div class="absolute-btn-box" v-if="checkCustomerDetail || showClose">
                    <a
                        href="javascript:;"
                        class="custom-btn check-cust-detail"
                        v-if="params.customerViewAuthType == 1 || params.customerViewAuthType == 2"
                        @click.prevent="goCustomerDetail()"
                    >
                        <i class="icrm-appeal-detail"></i>查看客户信息
                    </a>
                    <i class="custom-btn icrm-close" v-if="showClose" @click.stop="onClose"></i>
                </div>
            </div>
            <div class="controls-container">
                <div class="slider-pos">
                    <div class="ui-slider-pos">
                        <asr-slider v-model="currentTime" :duration="bridgeDuration * 1000" :end="bridgeDuration * 1000" @on-change="sliderChange"></asr-slider>
                    </div>
                </div>
                <div class="controls-btn-box">
                    <div class="controls-body">
                        <ul class="controls-position">
                            <li class="controls-btns controls-btns-speed">
                                <i class="change-speed-btn asr-retreat" @click="doSpeed(-15)">15</i>
                                <i class="icrm icrm-audio-pause" v-if="isPlaying" @click="doPause"></i>
                                <i class="icrm icrm-audio-play" v-else @click="doPlay"></i>
                                <i class="change-speed-btn asr-advance" @click="doSpeed(15)">15</i>
                            </li>
                        </ul>
                    </div>
                    <div class="asr-select-pos">
                        <asr-select v-model="speed" @on-change="onSpeedChange"></asr-select>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div v-show="showHeader" class="dialogue-header">
                <h3 class="title">
                    {{ title }}
                    <i class="audio-time">{{ startTime ? formatDate(new Date(startTime), 'yyyy/MM/dd HH:mm:ss') : '' }}</i>
                </h3>
                <div class="absolute-btn-box" v-if="checkCustomerDetail || showClose">
                    <a
                        href="javascript:;"
                        class="custom-btn check-cust-detail"
                        v-if="params.customerViewAuthType == 1 || params.customerViewAuthType == 2"
                        @click.prevent="goCustomerDetail()"
                    >
                        <i class="icrm-appeal-detail"></i>查看客户信息
                    </a>
                    <i class="custom-btn icrm-close" v-if="showClose" @click.stop="onClose"></i>
                </div>
            </div>

            <div class="dialogue-view" :class="{ 'no-scroll': markInfoPopperVisible }" id="__asr_view" @mousewheel="onMousewheel" @scroll="onScroll">
                <ul class="dialogue-view-inner" v-if="!isLoading">
                    <template v-if="Array.isArray(asrList) && asrList.length">
                        <li class="dialogue asr-percent">
                            时间占比：<i class="percent-item">客户 {{ percentClient }}</i
                            ><i class="percent-item">顾问 {{ percentCounselor }}</i>
                        </li>
                        <li
                            class="dialogue dialogue-floor"
                            :class="{
                                __active_asr: isPlay && asr.beginTime <= currentTime && currentTime <= asr.endTime,
                                agent: asr.side == 'Agent',
                            }"
                            v-for="(asr, asrIndex) in asrList"
                            :key="asrIndex">
                            <i class="icrm-arrows-right"></i>
                            <div class="asr-title">
                                <img class="img-avatar" :src="titleMap[asr.side]" alt="头像" />
                            </div>
                            <div class="asr-text" :class="{ 'has-mark': showMark }" @click="setCurrentTime(asr)">
                                <span class="asr-text-inner" v-html="asr.text"></span>
                            </div>

                            <ui-popover
                                ref="markInfoRef"
                                placement="bottom"
                                trigger="click"
                                @show="onMarkInfoPopperShow(asr)"
                                @hide="onMarkInfoPopperHide(asr)"
                                popper-class="asr-mark-popover"
                                :visible-arrow="false"
                            >
                                <template #reference>
                                    <template v-if="isMarkReadonly">
                                        <OpIcon v-if="asr.markText !== null" type="mark" />
                                    </template>
                                    <template v-else>
                                        <!-- 显示标注 -->
                                        <template v-if="showMark">
                                            <ui-tooltip2 placement="top" :content="asr.markText !== null ? '已标注，点击修改' : '复制内容并标注'">
                                                <OpIcon :type="asr.markText !== null ? 'mark' : 'edit'" />
                                            </ui-tooltip2>
                                        </template>
                                    </template>
                                </template>

                                <div class="container">
                                    <ui-input v-model.trim="currentClickMarkItem.textCopy" type="textarea" :rows="8" />
                                </div>

                                <div class="btn-part" v-if="canModifyMarkInfo">
                                    <button class="btn btn-small" @click="onMarkInfoCancel(asr, asrIndex)">取消</button
                                    ><!----><button class="btn btn-primary btn-small" @click="onMarkInfoConfirm(asr, asrIndex)">确定</button>
                                </div>
                            </ui-popover>

                            <div class="time-line"></div>
                            <div class="asr-begin-time">{{ formatMs(asr.beginTime) }}</div>
                        </li>
                    </template>
                    <div v-else class="__asr-blank">
                        <img :src="require('./asr-blank.png')" width="150" alt="">
                        <p class="asr-blank-text">{{ hasAsr ? '暂未转写完成，请稍等' : '本通录音无转写结果' }}</p>
                    </div>
                </ul>
            </div>

            <div class="controls-container">
                <div class="slider-pos">
                    <div class="ui-slider-pos">
                        <asr-slider v-model="currentTime" :duration="bridgeDuration * 1000" :end="bridgeDuration * 1000" @on-change="sliderChange"></asr-slider>
                    </div>
                </div>
                <div class="controls-btn-box">
                    <div class="controls-body">
                        <ul class="controls-position">
                            <li class="controls-btns controls-btns-speed">
                                <i class="change-speed-btn asr-retreat" @click="doSpeed(-15)">15</i>
                                <i class="icrm icrm-audio-pause" v-if="isPlaying" @click="doPause"></i>
                                <i class="icrm icrm-audio-play" v-else @click="doPlay"></i>
                                <i class="change-speed-btn asr-advance" @click="doSpeed(15)">15</i>
                            </li>
                        </ul>
                    </div>
                    <div class="asr-select-pos">
                        <asr-select v-model="speed" @on-change="onSpeedChange"></asr-select>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import mixins from './mixins.js';
import { isNotEmpty } from '@/utils/tools/tools.js';
import { formatDate, highlighter } from '@/utils/tools/utils.js';
import OpIcon from './op-icon.vue';

export default {
    name: 'asr-draggable',
    mixins: [mixins],
    components: { OpIcon },
    props: {
        // 方式一：传参数 params
        params: {
            type: Object,
            default: () => ({
                id: '', // 通话记录id
            }),
        },
        url: {
            type: String,
            default: '/callcenter/record/qc/asr/detail.json',
        },
        autoplay: {
            // 默认自动播放
            type: Boolean,
            default: true,
        },
        contentRiskMatchKeywords: {
            type: Array,
            default: () => [],
        },
        audioInfo: {
            // audio需要将公司名称和时间传入
            type: Object,
            default: () => ({
                customerName: '',
                addTime: '',
            }),
        },
        title: {
            type: [String, Number],
            default: '通话录音信息',
        },
        showHeader: Boolean,
        checkCustomerDetail: {
            // 是否展示查看客户信息按钮
            type: Boolean,
            default: false,
        },
        showClose: {
            // 是否显示关闭按钮
            type: Boolean,
            default: false,
        },
        // 是否显示标注功能
        showMark: {
            type: Boolean,
            default: false,
        },
        // 标注功能是否只读
        isMarkReadonly: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isLoading: true,
            asrList: [],
            audio_url: '',
            audio: null,
            ASRView: null,
            currentTime: 0, // 当前语音播放时间，单位毫秒
            isPlay: false, // 是否在播放过程中(开始播放，只要未播完都算)，播放时才高亮文案
            isPlaying: false, // 正在播放，正在响
            timer: null, // 手动滚动时间间隔
            timerInter: null, // 进度条实时监听
            slider_width: 0, // 进度条长度
            value: 0, // slide的实际值
            bridgeDuration: 0, // 通话时长，单位：秒
            percentClient: '', // 客户占比
            percentCounselor: '', // 客服占比
            startTime: '', // 通话开始时间
            addTime: '',
            customerName: '',
            left: 0,
            _isUserScroll: false,
            _isMousewheel: false,
            // ---------------------标注信息逻辑-----------------------
            markInfoPopperVisible: false, // 用于动态控制容器是否可以滚动
            // 标记信息 3.55.01
            hasAlreadyMarked: false, // 是否已经被标记过
            markInfo: {
                uniqueId: '', //通话标识
                callRecordId: '', //通话记录ID
                markList: [
                    // {
                    //     beginTime: 1680,
                    //     endTime: 3440,
                    //     side: 'Customer',
                    //     text: '这个录音很奇怪',
                    // }, //标注信息
                ],
            },
            // 当前点击的标记项
            currentClickMarkItem: {
                // beginTime: 0,
                // beginTimeStr: '00:00:00',
                // endTime: 200,
                // endTimeStr: '00:00:00',
                // markText: null,
                // textCopy: '您。',  // 原始的文本数据[手工添加的字段]
                // side: 'Agent',
                // sideInt: 1,
                // text: '您。',
                // isModify: true // 用来标记数据是否改变了
            },
            // ---------------------标注信息逻辑-----------------------
            hasAsr: undefined
        };
    },
    computed: {
        isAudio() {
            return false; // !Array.isArray(this.asrList) || !this.asrList.length;
        },
        sliderValue: {
            // sliderValue的代理值
            get() {
                return this.value;
            },
            set(v) {
                this.value = v;
            },
        },
        getTitle() {
            return (side) => {
                let title = '';
                switch (side) {
                    case 'Agent':
                        title = '顾问';
                        break;
                    case 'Customer':
                        title = '客户';
                        break;
                }
                return title;
            };
        },
        // 是否可以标记信息
        canModifyMarkInfo() {
            return !this.hasAlreadyMarked && !this.isMarkReadonly;
        },
    },
    watch: {
        params: {
            handler() {
                this.getAsrList();
            },
            immediate: true,
            deep: true,
        },
        // 标注数据变化了
        markInfo: {
            handler(newVal) {
                // 更新数据
                this.$store.commit('auxiliary/updateMarkInfo', JSON.parse(JSON.stringify(newVal)));
            },
            deep: true,
        },
    },
    methods: {
        formatDate,

        // ---------------------标注信息逻辑----------------------- //
        // 更新标注信息
        updateMarkInfo(asr) {
            const { beginTime, endTime, side, textCopy } = this.currentClickMarkItem;
            const markInfoItem = {
                beginTime,
                endTime,
                side,
                text: textCopy,
            };
            // 先判断当前数据是否已经被标记过
            const targetIndex = this.markInfo.markList.findIndex((item) => item.beginTime === beginTime);
            // 没有被标记过
            if (targetIndex === -1) {
                this.markInfo.markList.push(markInfoItem);
            } else {
                // 替换掉被标记的数据
                this.markInfo.markList.splice(targetIndex, 1, markInfoItem);
            }

            // 更新模版数据中的标记字段
            asr.markText = textCopy;
            // 更新备份字段
            asr.textCopy = textCopy;
        },
        // 修改标注信息-[显示]
        onMarkInfoPopperShow(asr) {
            // 更新 popper 显隐状态
            this.markInfoPopperVisible = true;
            // 更新当前标记信息
            this.currentClickMarkItem = {
                ...asr,
                isModify: true,
            };
            // 停止播放
            if (this.isPlaying) {
                this.doPause();
            }
        },
        // 修改标注信息-[隐藏]
        onMarkInfoPopperHide(asr) {
            // 更新 popper 显隐状态
            this.markInfoPopperVisible = false;
            // 数据标注了 && 标注功能不是只读 => 更新标注数据
            if (this.currentClickMarkItem.isModify && this.canModifyMarkInfo) {
                this.updateMarkInfo(asr);
            }
        },
        // [更新]-标注信息
        onMarkInfoConfirm(asr, asrIndex) {
            // 关闭 popper
            this.$refs['markInfoRef'][asrIndex]?.doClose();
        },
        // [取消]-标注信息
        onMarkInfoCancel(asr, asrIndex) {
            this.currentClickMarkItem.isModify = false;
            // 关闭 popper
            this.$refs['markInfoRef'][asrIndex]?.doClose();
        },
        // ---------------------标注信息逻辑----------------------- //

        getAsrList() {
            if (!isNotEmpty(this.params?.id)) return;
            this.doPause();
            this.isPlaying = false;

            this.$ajax({
                url: this.url,
                method: 'GET',
                params: this.params,
            })
                .then(({ success, code, data, root, message }) => {
                    if (success || code == 1) {
                        let { bridgeDurationTime, recordFile, asrInfos, customerName, addTime, startTime, id, uniqueId, hasAsr } = root || data || {};
                        this.hasAsr = hasAsr;
                        this.audio_url = recordFile || '';
                        this.bridgeDuration = bridgeDurationTime || 0;
                        this.asrList = this.doFilterList(asrInfos || []);
                        this.customerName = customerName;
                        this.startTime = startTime;
                        this.addTime = addTime;

                        // 通话标识ID
                        this.markInfo.uniqueId = uniqueId;
                        // 通话记录ID
                        this.markInfo.callRecordId = id;
                        // 判定数据是否已经被标记过
                        this.hasAlreadyMarked = this.asrList.some((item) => item.markText !== null);

                        // 计算通话占比
                        this.toCalculate();
                        this.autoplay && this.doPlay();
                    } else {
                        this.$toast({
                            type: 'error',
                            content: message,
                        });
                    }
                })
                .always(() => {
                    this.isLoading = false;
                });
        },
        doFilterList(asrList) {
            if (!Array.isArray(asrList) || !Array.isArray(this.contentRiskMatchKeywords)) return asrList;
            return asrList.map((asr) => {
                // 增加原始文本数据备份字段-标注用
                // 如果已经有标记过的数据，使用标记过的数据，否则使用原始数据
                asr.textCopy = asr.markText || asr.text;

                if (asr.text) {
                    this.contentRiskMatchKeywords.forEach((keyword) => {
                        asr.text = highlighter(asr.text, keyword, 'h');
                    });
                }
                return asr;
            });
        },
        setCurrentTime(item) {
            // 设置当前播放进度
            this.audio.currentTime = item.beginTime / 1000;
            /*this._isUserScroll = false;
            this._isMousewheel = false;*/
        },
        setEventListener() {
            this.$nextTick(() => {
                this.audio = this.$refs.audio; // 用ref取，保持唯一性

                this.audio.addEventListener('timeupdate', () => {
                    this.currentTime = this.audio.currentTime * 1000;

                    // 设置slider的位置
                    this.setSliderWidth();

                    if (!this._isUserScroll && !this._isMousewheel) {
                        // 当前歌词滚动到可视区域
                        this.scrollToTop();
                    }
                });
            });
        },
        onScroll() {
            if (this._isMousewheel) {
                // （简单判断）由滚轮触发的滚动时，禁止自动滚动
                this._isUserScroll = true;
            }
            // this.onScrollEnd();
        },
        onMousewheel() {
            this._isMousewheel = true;
            // this.onScrollEnd();
        },
        scrollToTop() {
            // 滚动到正在播放的段落
            this.$nextTick(() => {
                this.ASRView = document.querySelector('#__asr_view');
                let active_asr = document.querySelector('.__active_asr');

                if (this.ASRView && active_asr && !this._isUserScroll) {
                    try {
                        this.ASRView.scrollTo(0, active_asr.offsetTop - 206);
                    } catch (e) {
                        //
                    }
                }
            });
        },
        // 重置滚动距离
        resetScrollTop() {
            this.$nextTick(() => {
                this.ASRView = document.getElementById('__asr_view');

                if (this.ASRView) {
                    try {
                        this.ASRView.scrollTo(0, 0);
                    } catch (e) {
                        //
                    }
                }
            });
        },
        setInter() {
            if (this.timerInter) {
                clearInterval(this.timerInter);
            }
            this.timerInter = setInterval(() => {
                // 设置slider进度
                this.setSliderWidth();
            }, 500);
        },
        onPlay() {
            // 开始播放
            this.isPlay = true;
        },
        onEnded() {
            // 播放结束，不包括暂停
            this.isPlay = false;
            this.isPlaying = false;
            // 停止监听
            if (this.timerInter) {
                clearInterval(this.timerInter);
            }
        },
        onCanplay() {
            // audio 主动获取录音时长
            if (this.audio) this.bridgeDuration = this.audio.duration;
            this.autoplay && this.doPlay();
        },
        doPlay() {
            try {
                if (!isNotEmpty(this.audio_url)) return;
                // 播放
                this.$nextTick(() => {
                    this.audio.play();
                });
                // 开始监听
                this.isPlaying = true;
                this.setInter();
            } catch (e) {
                this.isPlaying = false;
            }
        },
        doPause() {
            try {
                // 暂停
                if (this.audio) this.audio.pause();
                this.isPlaying = false;
                // 停止监听
                if (this.timerInter) {
                    clearInterval(this.timerInter);
                }
            } catch (e) {
                //
            }
        },
        doStop() {
            // 停止播放
            try {
                this.doPause();
                this.audio.currentTime = 0;
            } catch (e) {
                //
            }
        },
        doSpeed(n) {
            // 快进、快退
            // 单位：秒
            try {
                this.audio.currentTime += n;
            } catch (e) {
                //
            }
        },
        formatMs(sec) {
            // 把毫秒转化为：mm:ss
            let second = parseInt(sec),
                timeStr = '00:00';

            if (isNotEmpty(second)) {
                let s = (second / 1000).toFixed();
                let ss = s % 60,
                    MM = parseInt(s / 60);

                timeStr = (MM > 9 ? MM : '0' + MM) + ':' + (ss > 9 ? ss : '0' + ss);
            }
            return timeStr;
        },
        setSliderWidth() {
            // 设置slider进度
            try {
                this.value = (this.audio.currentTime / this.bridgeDuration) * 100;
            } catch (e) {
                //
            }
        },
        sliderChange(v) {
            try {
                this.audio.currentTime = parseInt((v / 100) * this.bridgeDuration);
            } catch (e) {
                //
            }
        },
        toCalculate() {
            let asrList = this.asrList,
                counselor = 0, // 顾问总时间
                client = 0, // 客户总时间
                perClient = '', // 客户百分数
                perCounselor = ''; // 顾问百分数

            if (!Array.isArray(asrList) || !asrList.length) return;

            asrList.forEach((asr) => {
                let { beginTime, endTime, sideInt } = asr,
                    duriation = endTime - beginTime;

                if (sideInt == 1) {
                    counselor += duriation;
                } else {
                    client += duriation;
                }
            });

            perClient = ((client / (client + counselor)) * 100).toFixed(2);
            perCounselor = ((10000 - perClient * 100) / 100).toFixed(2);

            this.percentClient = perClient + '%'; // 客户百分数
            this.percentCounselor = perCounselor + '%'; // 顾问百分数
        },
        onClose() {
            this.$emit('on-close');
        },
        setInitLeft() {
            let left = document.documentElement.clientWidth - 700;
            this.left = left ? left : 0;
        },
        goCustomerDetail() {
            let { customerId, customerViewAuthType } = this.params,
                menuPrefix = '';
            // customerViewAuthType - 当前用户客户的查看权限类型 0 无权限查看 ，1 私海客户，2 公海客户
            if (customerViewAuthType == 1) {
                menuPrefix = 'my';
            } else if (customerViewAuthType == 2) {
                menuPrefix = 'team';
            }
            this.$seeCustomer({
                menuPrefix,
                customerId: customerId,
            });
        },
    },
    mounted() {
        this.setEventListener();
        this.setInitLeft();
        // 处理v-drag
        this.$forceUpdate();
    },
    beforeDestroy() {
        // 清空数据
        this.$store.commit('auxiliary/resetMarkInfo');
    },
};
</script>
<style lang="less" scoped>
@import 'css-scoped';
</style>

<style lang="less">
.asr-mark-popover {
    width: 350px;
    padding: 16px;
    border-radius: 8px;

    .container {
        // padding: 16px;

        .input-wrap-textarea {
            width: 100%;
            min-width: unset;
            textarea {
                resize: none;
                border-radius: 4px;
                border-color: #cdd0d6;
            }
        }
    }

    .btn-part {
        text-align: right;
        margin-top: 16px;
        .btn {
            min-width: 48px;
            &:first-child {
                margin-right: 8px;
            }
        }
    }
}
</style>
