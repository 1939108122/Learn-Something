<template>
    <div class="draggable-asr-pos" v-drag="'.draggable-asr-pos'">
        <audio
            ref="audio"
            :src="audio_url"
            controls
            hidden
            @canplay="onCanplay"
            @timeupdate="onTimeUpdate"
            @play="onPlay()"
            @ended="onEnded()"
        ></audio>
        <template v-if="!isLoading">
            <template>
                <div class="dialogue-header __asr-drag-handle">
                    <h3 class="title">录音详情</h3>
                    <div class="header-close">
                        <i
                            class="custom-btn icrm-icon-close"
                            @click.stop="onClose"
                            v-logParams="{ wc_interface: '录音详情', ele_name: 'audio-detail-close', ...setParams }"
                        />
                    </div>
                </div>
                <div class="__asr-main">
                    <div class="__asr-main-gpt" v-if="showGpt">
                        <div class="gpt-title">
                            <img class="gpt-logo" :src="require('./images/gpt-logo.png')" width="24" />
                            <h3>智能提炼</h3>
                        </div>
                        <gpt-typing
                            v-if="gptInfoList && Array.isArray(gptInfoList) && gptInfoList.length"
                            :list="gptInfoList"
                        />
                        <!-- 包括提炼中和没有提炼出来 -->
                        <div v-else class="__gpt-blank">
                            <img :src="require('./images/gpt-blank.png')" alt="" v-if="!noExtractData" />
                            <p class="gpt-blank-text">{{ noExtractData ? '未提取到有效信息' : '信息加紧提炼中' }}</p>
                        </div>
                    </div>
                    <div class="__asr-main-asr">
                        <div class="asr-header" :class="{ 'header-shadow': showHeaderShadow }">
                            <div class="company-info">
                                <div class="add-time">{{ computedAddTime }}</div>
                                <div class="company">{{ computedCustomerName }}</div>
                            </div>
                            <div
                                class="asr-tags"
                                :class="{ expanded: showMoreTags }"
                                v-if="asrKeyWord && Array.isArray(asrKeyWord) && asrKeyWord.length > 0"
                            >
                                <div class="asr-tags-list" ref="asrTagList">
                                    <CustomerTag
                                        v-for="(item, index) in asrKeyWord"
                                        :key="index"
                                        :tags="item"
                                        @jump="jumpSpecificChat"
                                    ></CustomerTag>
                                </div>
                                <span class="tags-fold" v-if="showTagsFold"
                                    ><i class="icrm-a-down" @click.prevent="toggleFoldTag"></i
                                ></span>
                            </div>
                        </div>
                        <div v-if="isAudio" class="__asr-blank">
                            <img :src="require('./images/asr-blank.png')" width="150" alt="" />
                            <p class="asr-blank-text">{{ hasAsr ? '暂未转写完成，请稍等' : '本通录音无转写结果' }}</p>
                        </div>
                        <div
                            v-else
                            class="dialogue-view"
                            id="__asr_view"
                            ref="asrView"
                            @mousewheel="onMousewheel"
                            @scroll="onScroll"
                            @mousedown="onMouseClick($event, 'down')"
                            @mouseup="onMouseClick($event, 'up')"
                        >
                            <ul ref="asrViewInner" class="dialogue-view-inner">
                                <!-- <li class="dialogue asr-percent">
                                    时间占比：<i class="percent-item">客户 {{ percentClient }}</i><i class="percent-item">顾问 {{ percentCounselor }}</i>
                                </li> -->
                                <li
                                    class="dialogue dialogue-floor"
                                    :class="{
                                        __active_asr:
                                            isPlay && asr.beginTime <= currentTime && currentTime <= asr.endTime,
                                        agent: asr.side == 'Agent'
                                    }"
                                    v-for="(asr, index) in asrList"
                                    :key="index"
                                >
                                    <!-- <div class="absolute-floor"><i class="icrm-arrows-right"></i></div> -->
                                    <div class="asr-title">
                                        <img class="img-avatar" :src="titleMap[asr.side]" alt="头像" />{{
                                            titleNameMap[asr.side]
                                        }}
                                    </div>
                                    <div class="asr-text" @click="setCurrentTime(asr)">
                                        <span
                                            class="asr-text-inner"
                                            v-html="asr.text"
                                            v-logParams="{
                                                wc_interface: '录音详情',
                                                ele_name: 'audio-detail-item-jump',
                                                ...setParams
                                            }"
                                        ></span>
                                    </div>
                                    <div class="time-line"></div>
                                    <div class="asr-begin-time">{{ formatMs(asr.beginTime) }}</div>
                                </li>
                            </ul>
                        </div>
                        <div class="controls-container">
                            <div class="asr-play">
                                <i
                                    v-if="isPlaying"
                                    class="asr-player pause"
                                    @click="doPause"
                                    :key="isPlaying"
                                    v-logParams="{
                                        wc_interface: '录音详情',
                                        ele_name: 'audio-detail-play-stop',
                                        ...setParams
                                    }"
                                ></i>
                                <i
                                    v-else
                                    class="asr-player play"
                                    @click="doPlay"
                                    :key="isPlaying"
                                    v-logParams="{
                                        wc_interface: '录音详情',
                                        ele_name: 'audio-detail-play-start',
                                        ...setParams
                                    }"
                                ></i>
                            </div>
                            <div class="ui-slider-pos">
                                <asr-slider
                                    v-model="currentTime"
                                    :duration="bridgeDuration * 1000"
                                    :end="bridgeDuration * 1000"
                                    :setParams="setParams"
                                    :isDragging.sync="isDragging"
                                    :palyPercent="value"
                                    @on-change="sliderChange"
                                />
                            </div>
                            <div class="asr-select-pos">
                                <asr-select v-model="speed" @on-change="onSpeedChange" :setParams="setParams" />
                            </div>
                            <!-- <div class="controls-btn-box">
                                <div class="controls-body">
                                    <ul class="controls-position">
                                        <li class="controls-btns controls-btns-speed">
                                            <i class="change-speed-btn asr-retreat" @click="doSpeed(-15)" v-logParams="{ wc_interface: '录音详情', ele_name: 'audio-detail-speed-down', ...setParams }"></i>
                                            <i v-if="isPlaying" class="icrm icrm-audio-pause"  @click="doPause" :key="isPlaying" v-logParams="{ wc_interface: '录音详情', ele_name: 'audio-detail-play-stop', ...setParams }" ></i>
                                            <i v-else class="icrm icrm-audio-play" @click="doPlay" :key="isPlaying" v-logParams="{ wc_interface: '录音详情', ele_name: 'audio-detail-play-start', ...setParams }"></i>
                                            <i class="change-speed-btn asr-advance" @click="doSpeed(15)"v-logParams="{ wc_interface: '录音详情', ele_name: 'audio-detail-speed-up', ...setParams }"></i>
                                        </li>
                                    </ul>
                                </div>
                                <div class="asr-select-pos">
                                    <asr-select v-model="speed" @on-change="onSpeedChange" :setParams="setParams"/>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>
<script>
import mixins from './mixins.js';
import { isNotEmpty } from '@/utils/tools/tools.js';
import { formatDate, highlighter } from '@/utils/tools/utils.js';

export default {
    name: 'AsrDraggable',
    mixins: [mixins],
    props: {
        url: {
            type: String,
            default: ''
        },
        autoplay: {
            // 默认自动播放
            type: Boolean,
            default: true
        },
        contentRiskMatchKeywords: {
            type: Array,
            default: () => []
        },
        audioInfo: {
            type: Object,
            default: () => ({
                customerName: '',
                addTime: ''
            })
        },
        x: {
            type: [Number, String],
            default: 0
        },
        y: {
            type: [Number, String],
            default: 0
        },
        // gpt文字提炼模块
        showGpt: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // mock: require('./test.json'),
            isLoading: true,
            asrList: [],
            audio_url: '',
            // audio_url: require('./test.wav'),
            audio: null,
            ASRView: null,
            currentTime: 0, // 当前语音播放时间，单位毫秒
            isPlay: false, // 是否在播放过程中(开始播放，只要未播完都算)，播放时才高亮文案
            isPlaying: false, // 正在播放，正在响
            slider_width: 0, // 进度条长度
            value: 0, // slide的实际值(百分比)
            bridgeDuration: 0, // 通话时长，单位：秒
            percentClient: '', // 客户占比
            percentCounselor: '', // 客服占比
            addTime: '',
            customerName: '',
            _isUserScroll: false,
            _isMousewheel: false,
            encryptId: null,
            scrollMaxRange: 0, // 滚动条滚动最大距离
            scrollType: 2, //滚动方式：1-点击滚动条滚动，2-滑动触控板/鼠标滚轮滚动

            audioCanPlay: false, // 音频正确加载，可以播放
            isDragging: false, // 是否正在拖拽

            gptInfoList: null, // gpt文字提炼模块数据 []没提炼出来 null提炼中

            hasAsr: undefined, // true or false 是否有asr结果 配合 asrInfos来判断是否转写完成
            asrKeyWord: null, // asr关键词，没有就是null，有值为[{}]
            showHeaderShadow: false,
            showMoreTags: false,
            showTagsFold: false
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        formatDate,
        init() {
            this.audio = this.$refs.audio;
            // 处理v-drag
            this.$forceUpdate();
        },
        getAsrList() {
            this.doPause();
            this.isPlaying = false;

            this.$ajax({
                url: this.url,
                method: 'GET'
            })
                .then(({ success, root }) => {
                    if (success) {
                        let {
                            bridgeDurationTime,
                            recordFile,
                            asrInfos,
                            customerName,
                            addTime,
                            encryptId,
                            extractInfo,
                            hasAsr,
                            asrKeyWord
                        } = root || {};
                        // let { bridgeDurationTime, recordFile, asrInfos, customerName, addTime, encryptId, extractInfo=[] } = this.mock.root || {};
                        if (this.showGpt) {
                            // extractInfo=null 加紧提炼中
                            // extractInfo=[] 提炼为空
                            this.gptInfoList = extractInfo;
                        }
                        this.hasAsr = hasAsr;
                        this.audio_url = recordFile || '';
                        this.bridgeDuration = bridgeDurationTime || 0;
                        this.asrList = this.doFilterList(asrInfos || []);
                        this.encryptId = encryptId;

                        this.customerName = customerName;
                        this.addTime = addTime;
                        this.asrKeyWord = asrKeyWord; // null or []

                        // 计算通话占比
                        this.toCalculate();
                    }
                })
                .always(() => {
                    this.isLoading = false;
                    this.asrKeyWord && this.judgeTagFold();
                });
        },
        doFilterList(asrList) {
            if (!Array.isArray(asrList) || !Array.isArray(this.contentRiskMatchKeywords)) return asrList;
            return asrList.map(asr => {
                if (asr.text) {
                    this.contentRiskMatchKeywords.forEach(keyword => {
                        asr.text = highlighter(asr.text, keyword, 'h');
                    });
                }
                return asr;
            });
        },
        // 设置当前播放进度
        setCurrentTime(item) {
            this.audio.currentTime = item.beginTime / 1000;
        },
        onTimeUpdate(e) {
            // 拖拽时自动不更新进度条，手动更新位置
            if (!this.isDragging && this.bridgeDuration > 0) {
                this.value = e.target.currentTime / this.bridgeDuration;
            }
            this.currentTime = e.target.currentTime * 1000;

            // 当前歌词滚动到可视区域
            if (!this._isUserScroll && !this._isMousewheel) {
                this.scrollToTop();
            }
        },
        onMouseClick(e, type) {
            if (e?.layerX >= 588 && type === 'down' && !this.scrollMaxRange) {
                this.scrollType = 1;
                return;
            }
            if (this.scrollType === 1) this.scrollType = this.scrollMaxRange ? 1 : 2;
        },
        onScroll(e) {
            const scrollTop = e?.target?.scrollTop || 0;
            if (scrollTop >= this.scrollMaxRange) this.scrollMaxRange = scrollTop;
            if (this._isMousewheel) {
                // （简单判断）由滚轮触发的滚动时，禁止自动滚动
                this._isUserScroll = true;
            }

            this.showHeaderShadow = scrollTop > 0 ? true : false;
        },
        onMousewheel() {
            this._isMousewheel = true;
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
        onPlay() {
            // 开始播放
            this.isPlay = true;
        },
        onEnded() {
            // 播放结束，不包括暂停
            this.isPlay = false;
            this.isPlaying = false;

            this.value = 0;
            this.currentTime = 0;
        },
        onCanplay() {
            // audio 主动获取录音时长
            if (this.audio) {
                this.bridgeDuration = this.audio.duration !== Infinity ? this.audio.duration : this.bridgeDuration;
            }
            this.audioCanPlay = true;
            this.autoplay && this.doPlay();
        },
        doPlay() {
            try {
                if (!isNotEmpty(this.audio_url) || !this.audioCanPlay) {
                    // this.$toast({
                    //     content: '音频加载失败，请稍后重试',
                    //     type: 'error'
                    // });
                    return;
                }
                // 播放
                this.$nextTick(() => {
                    this.audio.play();
                    // 开始监听
                    this.isPlaying = true;
                });
            } catch (e) {
                //
            }
        },
        doPause() {
            try {
                // 暂停
                if (this.audio) this.audio.pause();
                this.isPlaying = false;
            } catch (e) {
                //
            }
        },
        doSpeed(n) {
            // 快进、快退
            // 单位：秒
            if (!this.audioCanPlay) return;

            try {
                let current = this.audio.currentTime + n;

                if (current < 0) {
                    current = 0;
                } else if (current > this.bridgeDuration) {
                    current = this.bridgeDuration;
                }

                this.audio.currentTime = current;
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
        sliderChange(v) {
            try {
                this.audio.currentTime = parseInt(v * this.bridgeDuration);
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

            asrList.forEach(asr => {
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
            try {
                const isExistScroll = this.$refs?.asrView?.offsetHeight < this.$refs?.asrViewInner?.offsetHeight;
                this.$BossAnalytics.track('audio-detail-scroll', {
                    p2: isExistScroll ? 1 : 0, // 是否有滚动条：1-是，0-否
                    p3: isExistScroll ? this.scrollType : '', // 滚动方式：1-滚动条滚动，2-滑动触控板/鼠标滚轮滚动
                    p4: this.scrollMaxRange, // 滚动距离：上报从点开详情到关闭之间的最大距离，单位：px
                    wc_interface: '录音详情',
                    ...this.setParams
                });
            } catch (e) {
                this.$toast({ type: 'error', content: '上报埋点出错' });
            }

            this.$emit('on-close');
        },
        toggleFoldTag() {
            this.showMoreTags = !this.showMoreTags;
        },
        judgeTagFold() {
            this.$nextTick(() => {
                this.showTagsFold = this.$refs.asrTagList && this.$refs.asrTagList.scrollHeight > 24; // 24 单行高度
            });
        },
        jumpSpecificChat(text) {
            let rank = this.asrList.findIndex(item => item.text.indexOf(text) > -1);
            if (rank > -1) {
                const beginTime = this.asrList[rank].beginTime;
                this.audio.currentTime = beginTime / 1000;
            } else {
                this.$toast({
                    type: 'error',
                    content: '没有匹配的会话'
                });
            }
        }
    },
    computed: {
        noExtractData() {
            return this.gptInfoList && Array.isArray(this.gptInfoList) && this.gptInfoList.length === 0;
        },
        computedCustomerName() {
            return this.customerName || this.audioInfo.customerName;
        },
        computedAddTime() {
            return this.addTime || this.audioInfo.addTime;
        },
        // 仅仅播放录音模式，没有asr
        isAudio() {
            // return !Array.isArray(this.asrList) || !this.asrList.length;
            return !(Array.isArray(this.asrList) && this.asrList.length);
        },
        getTitle() {
            return side => {
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
        setParams() {
            return {
                wc_obj_type: 'call_r',
                wc_obj_id: this.encryptId
            };
        }
    },
    watch: {
        url: {
            handler(uurl) {
                if (uurl) this.getAsrList();
            },
            immediate: true,
            deep: true
        }
    }
};
</script>
<style lang="less" scoped>
@import 'css-scoped';
</style>

<style lang="less">
.h {
    color: #ed4359;
}
</style>
