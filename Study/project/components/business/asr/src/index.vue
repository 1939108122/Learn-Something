<template>
    <div v-if="showDialog" :class="['component-asr-container', wrapClass]">
        <!--:src="url + '&type=audition'"-->
        <!--:src="require('./audio.mp3')"-->
        <audio
            ref="audio"
           :src="url"
           controls hidden
           @play="onPlay()"
           @ended="onEnded()">
        </audio>

        <div v-show="showHeader" class="dialogue-header">
            <h3 class="title">
                {{title}}
                <i class="audio-time">{{startTime ? formatDate(new Date(startTime), 'yyyy/MM/dd HH:mm:ss') : ''}}</i>
            </h3>
            <div class="absolute-btn-box" v-if="checkCustomerDetail || showClose">
                <a href="javascript:;" class="custom-btn check-cust-detail" v-if="params.customerViewAuthType == 1 || params.customerViewAuthType == 2" @click.prevent="goCustomerDetail()">
                    <i class="icrm-line-desc"></i>查看客户信息
                </a>
                <i class="custom-btn icrm-close" v-if="showClose" @click.stop="onClose"></i>
            </div>
        </div>

        <div class="dialogue-view">
            <ul class="dialogue-view-inner" @mousewheel="onMousewheel" @scroll="onScroll">
                <li class="dialogue"
                    :class="{'__active_asr': isPlay && asr.beginTime <= currentTime && currentTime <= asr.endTime, 'agent': asr.side == 'Agent'}"
                    v-for="(asr, index) in asrList" :key="index">
                    <div class="asr-title">{{ getTitle(asr.side) }}</div>
                    <div class="asr-text" @click="setCurrentTime(asr)">
                        <span class="asr-text-inner" v-html="asr.text" ></span>
                    </div>
                    <div class="asr-begin-time">{{ formatMs(asr.beginTime) }}</div>
                </li>
            </ul>
        </div>

        <div class="controls-container">
            <div class="controls-header" id="__slider">
                <div class="slider-pos">
                    <div class="controls-body">
                        <ul class="controls-position">
                            <li class="controls-btns" :class="{'controls-btns-speed': showChangeSpeed}">
                                <i class="icrm icrm-audio-reverse" v-if="showChangeSpeed" @click="doSpeed(-5)"></i>
                                <i class="icrm icrm-audio-pause" v-if="isPlaying" @click="doPause"></i>
                                <i class="icrm icrm-audio-play" v-else @click="doPlay"></i>
                                <i class="icrm icrm-audio-speed" v-if="showChangeSpeed" @click="doSpeed(5)"></i>
                            </li>
                        </ul>
                    </div>
                    <div class="ui-slider-pos">
                        <ui-slider v-model="sliderValue"
                                   showTip="always"
                                   :tip-format="() => {return formatMs(currentTime);}"
                                   class="ui-slider-tooltip"
                                   @on-change="sliderChange">
                        </ui-slider>
                        <ul class="duration-start-end">
                            <li>00:00</li>
                            <!--<li>{{ formatMs(currentTime) }}</li>-->
                            <li>{{ formatMs(bridgeDuration * 1000) }}</li>
                        </ul>
                    </div>
                </div>
                <div class="asr-info" v-if="showAsrInfo">
                    <!--<ul class="comm-percent">
                        <li>通过时间占比：</li>
                        <li>客户 {{ percentClient }}</li>
                        <li>客服 {{ percentCounselor }}</li>
                    </ul>
                    <div class="bottom-info">
                        <span class="info-item">广州和富咨询管理有限公司</span>
                        <span class="info-item">2021-11-19 18:41</span>
                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// todo 开发用
import asrList from './asr_list';
import { isNotEmpty } from '@/utils/tools/tools.js';
import { formatDate } from '@/utils/tools/utils.js';
// uniqueId - sip-12-1568598561.24478 通话维一标识
// callType - 呼出、呼入

export default {
    name: 'index',
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        autoplay: Boolean,
        showHeader: Boolean,
        draggable: Boolean,
        wrapClass: String,
        // 方式一：传参数 params
        params: {
            type: Object,
            default: () => ({
                id: '', // 通话记录id
            })
        },
        // 方式二：传值 asrInfo + asrItems
        /*asrInfo: {
            type: Object,
            default: () => ({
                url: '', // 音频url
                startTime: '', // 开始时间
                bridgeDuration: '' // 音频时长
            })
        },
        asrItems: {
            // 对话文案
            type: Array,
            default: () => ([])
        }*/
        checkCustomerDetail: {
            // 是否展示查看客户信息按钮
            type: Boolean,
            default: false
        },
        title: {
            type: [String, Number],
            default: '通话录音信息'
        },
        showClose: {
            // 是否显示关闭按钮
            type: Boolean,
            default: false
        },
        showChangeSpeed: {
            // 是否显示快进、快退按钮
            type: Boolean,
            default: false
        },
        showAsrInfo: {
            // 是否显示asr的详细信息
            type: Boolean,
            default: false
        },
        audioAuto: {
            // true 根据asr列表，自动展示asr
            // false 始终展示asr
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // showDialog: true,
            asrList: [],
            url: '',
            audio: null,
            activeAsr: null, // 当前高亮的文案dom
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
            // callType=2时, in: 客服, out: 客户
            // callType=1时, in: 客户, out: 客服
            callType: '',
            startTime: '', // 通话开始时间
            loading: false,
        };
    },
    mounted() {
        this.setEventListener();
        this.getSliderWidth();

        this.$watch('showDialog', (show) => {
            !show && this.$destroy(true);
        });
    },
    updated() {
        this.getSliderWidth();
    },
    methods: {
        formatDate,
        getAsrList() {
            this.doPause();
            this.isPlaying = false;

            if (isNotEmpty(this.params.id)) {
                this.$ajax({
                    url: '/callcenter/record/qc/asr/detail.json',
                    method: 'GET',
                    params: {
                        ...this.params
                        /*uniqueId: this.uniqueId,
                        callType: this.callType*/
                    }
                }).then(({code, message, data}) => {
                    if (code == 1) {
                        let {bridgeDurationTime, asrInfos, startTime, recordFile, callType} = data || {};
                        this.url = recordFile || '';
                        // this.callType = callType;
                        this.bridgeDuration = bridgeDurationTime || 0;
                        this.asrList = asrInfos || [];
                        this.startTime = startTime;
                        // 计算通话占比
                        // this.toCalculate();
                        this.autoplay && this.doPlay();
                    } else {
                        this.$toast({
                            type: 'error',
                            content: message
                        });
                    }
                }).always(() => {
                    this.loading = true;
                });
            }
        },
        setCurrentTime(item) { // 设置当前播放进度
            this.audio.currentTime = item.beginTime / 1000;
            this._isUserScroll = false;
            this._isMousewheel = false;
        },
        setEventListener() {
            this.$nextTick(() => {
                this.audio = this.$refs.audio; // 用ref取，保持唯一性

                this.audio.addEventListener('timeupdate', () => {
                    this.currentTime = this.audio.currentTime * 1000;
                    // 设置slider的位置
                    this.setSliderWidth();

                    if (!this._isUserScroll) {
                        // 当前歌词滚动到可视区域
                        this.scrollToTop();
                    }
                });
            });
        },
        onScroll() {
            if (this._isMousewheel) { // （简单判断）由滚轮触发的滚动时，禁止自动滚动
                this._isUserScroll = true;
            }
        },
        onMousewheel() {
            this._isMousewheel = true;
        },
        scrollToTop() { // 滚动到正在播放的段落
            this.$nextTick(() => {
                this.activeAsr = document.querySelector('.__active_asr');

                if (this.activeAsr) {
                    this.activeAsr.scrollIntoView({behavior: 'smooth'});
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
        doPlay() {
            try {
                if (!isNotEmpty(this.url)) return;
                // 播放
                this.$nextTick(() => {
                    this.audio.play();
                });
                // 开始监听
                this.isPlaying = true;
                this.setInter();
            } catch (e) {
                //
            }
        },
        doPause() {
            try {
                // 暂停
                if(this.audio) this.audio.pause();
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
        getSliderWidth() {
            // 获取slider的总长度
            this.$nextTick(() => {
                if (document.getElementById('__slider')) {
                    this.slider_width = document.getElementById('__slider').getBoundingClientRect().width;
                }
            });
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
                this.audio.currentTime = parseInt(v / 100 * this.bridgeDuration);
            } catch (e) {
                //
            }
            this._isUserScroll = false;
            this._isMousewheel = false;
        },
        toCalculate() {
            // callType=1时, in: 客户, out: 客服
            // callType=2时, in: 客服, out: 客户

            let callType = this.callType,
                asrList = this.asrList,
                counselor = 0, // 顾问总时间
                client = 0, // 客户总时间
                perClient = '', // 客户百分数
                perCounselor = ''; // 顾问百分数

            if (!Array.isArray(asrList) || !asrList.length) return;

            asrList.forEach((asr) => {
                let {beginTime, endTime} = asr,
                    duriation = endTime - beginTime;

                if (callType == 1) {
                    // 呼入
                    if (asr.side === 'in') {
                        // 客户
                        client += duriation;
                    } else if (asr.side === 'out') {
                        // 客服
                        counselor += duriation;
                    }
                } else if (callType == 2) {
                    // 外呼
                    if (asr.side === 'out') {
                        // 客户
                        client += duriation;
                    } else if (asr.side === 'in') {
                        // 客服
                        counselor += duriation;
                    }
                }
            });

            perClient = ((client / (client + counselor)) * 100).toFixed(2);
            perCounselor = ((10000 - perClient * 100) / 100).toFixed(2);

            this.percentClient = perClient + '%'; // 客户百分数
            this.percentCounselor = perCounselor + '%'; // 顾问百分数
        },
        goCustomerDetail () {
            let { customerId, customerViewAuthType } = this.params,
                menuPrefix = '';
            // customerViewAuthType - 当前用户客户的查看权限类型 0 无权限查看 ，1 私海客户，2 公海客户
            if(customerViewAuthType == 1) {
                menuPrefix = 'my';
            } else if(customerViewAuthType == 2) {
                menuPrefix = 'team';
            }
            this.$seeCustomer({
                menuPrefix,
                customerId: customerId,
            });
        },
        onClose() {
            this.$emit('on-close');
        }
    },
    computed: {
        sliderValue: {
            // sliderValue的代理值
            get() {
                return this.value;
            },
            set(v) {
                this.value = v;
            }
        },
        getTitle() {
            return (side) => {
                let title = '';
                switch (side) {
                    case 'Agent':
                        title = '销售';
                        break;
                    case 'Customer':
                        title = '客户';
                        break;
                }
                return title;
            };
        }
    },
    watch: {
        params: {
            handler() {
                this.getAsrList();
            },
            immediate: true,
            deep: true
        },
    }
};
</script>
<style lang="less">
.component-asr-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    position: relative;
    font-size: 12px;
    position: relative;
    display: flex;
    flex-direction: column;

    .dialogue-header {
        flex: none;
        position: relative;

        .title {
            padding: 0 20px;
            font-size: 14px;
            line-height: 58px;
            border-bottom: 1px solid #dadada;
            text-indent: 12px;
            position: relative;

            &:before {
                content: "";
                display: block;
                width: 4px;
                height: 14px;
                background: #00BEBD;
                border-radius: 2px;
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
            .audio-time {
                padding-left: 5px;
                font-weight: initial;
                font-size: 14px;
                color: #9FA6B5;
            }
        }
        .absolute-btn-box {
            position: absolute;
            // padding: 2px 5px;
            right: 20px;
            top: 21px;
            line-height: 1;

            .custom-btn {
                & + .custom-btn {
                    margin-left: 3px;
                }
            }
            .icrm-close {
                font-size: 14px;
                cursor: pointer;
            }
        }
        .check-cust-detail {
            color: #00A6A7;
            font-size: 14px;

            .icrm-line-desc {
                &:before {
                    font-weight: 500;
                }
            }
        }
        .icrm-close {
            osition: absolute;
            right: 20px;
            top: 21px;
            line-height: 1;
        }
    }

    .dialogue-view {
        flex: 1;
        position: relative;
        //height: 100%;
        padding: 15px 5px 10px 12px;
        overflow-y: auto;

        .dialogue-view-inner {
            position: relative;
            height: 100%;
        }
        .dialogue {
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &.__active_asr {
                font-weight: bold;
                background-color: #F7F8FB;
            }
            &.agent {
                .asr-title {
                    color: #00A6A7;
                    background-color: #E4F7F7;
                }
                .asr-text {
                    .asr-text-inner {
                        background-color: #E4F7F7;
                    }
                }
            }

            .asr-title {
                width: 40px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                border-radius: 4px;
                color: #363F55;
                background: #F1F2F5;
            }

            .asr-text {
                flex: 1;
                padding: 0 20px 0 0;
                line-height: 20px;
                color: #363F55;
                //cursor: pointer;
                font-size: 0;

                .asr-text-inner {
                    margin-left: 10px;
                    padding: 8px 10px;
                    display: inline-block;
                    border-radius: 4px;
                    font-size: 13px;
                }
            }
            .h {
                color: #ED4359;
            }
            .asr-begin-time {
                width: 28px;
                height: 17px;
                line-height: 17px;
                white-space: nowrap;
                color: #8790A2;
            }
        }
    }

    .controls-container {
        flex: none;

        .controls-header {
            position: relative;
            padding: 20px 20px 14px;
            border-top: 1px solid #DBDFE6;

            .slider-pos {
                display: flex;
                align-items: center;

                .ui-slider-pos {
                    flex: 1;
                }
                .ui-slider {
                    flex: 1;
                    align-items: center;
                }
            }
            .ui-slider {
                padding-left: 15px;

                .ui-slider-wrap {
                    .ui-slider-button-wrap {
                        .ui-slider-button {
                            background-color: #00BEBD;
                        }
                    }
                    .ui-slider-bar {
                        background-color: #00BEBD;
                    }
                }
            }
            .duration-start-end {
                display: flex;
                justify-content: space-between;
                padding-left: 5px;
                line-height: 1;
                color: #8790A2;
                position: relative;
                top: -6px;
            }
            .asr-info {
                color: #8790A2;
                line-height: 24px;

                .comm-percent {
                    display: flex;
                    align-items: center;
                    padding-top: 10px;
                    line-height: 18px;

                    > li {
                        height: 18px;

                        &:nth-of-type(2):after {
                            content: "";
                            display: inline-block;
                            width: 1px;
                            height: 10px;
                            margin: 4px 10px 0;
                            background-color: #ccc;
                        }
                    }
                }
                .bottom-info {
                    .info-item {
                        & + .info-item {
                            margin-left: 20px;
                        }
                    }
                }
            }
        }
        .controls-body {
            .controls-position {
                display: flex;
                justify-content: space-between;

                .controls-btns {
                    display: flex;
                    align-items: center;
                    color: #00BEBD;

                    & > .icrm {
                        cursor: pointer;
                    }
                    .icrm-audio-reverse {
                        font-size: 16px;
                        margin-right: 10px;
                    }
                    .icrm-audio-speed {
                        margin-left: 10px;
                    }
                    .icrm-audio-play,
                    .icrm-audio-pause {
                        font-size: 38px;
                        line-height: 38px;
                        //margin: 0 20px;
                    }
                }
            }
        }
    }
}
.ui-slider-tooltip {
    .popover-wrap {
        bottom: 15px !important;
        white-space: nowrap;
        border: none;
        box-shadow: none;
        background-color: transparent;

        &:before {
            display: none;
        }
        .popover-content {
            background-color: transparent;
        }
    }
}
</style>
