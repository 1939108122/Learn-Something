<template>
    <div 
        :class="['asr-player', `asr-player-${theme}`]" 
        v-show="hasAsr || fileUrl && (hasPlay || hasDownload)">
        <span class="duration" v-if="showDuration">{{ duration }}</span>
        <!-- asr播放 -->
        <a
            v-if="hasAsr || fileUrl && hasPlay"
            href="javascript:;"
            @click.prevent="playAsr"
            v-logParams="{ ...setLogParams, ele_name: 'open-audio-detail' }"><i class="icrm-asr-play"></i></a>
        <!-- 录音下载 -->
        <a
            v-if="fileUrl && hasDownload"
            :href="fileUrl"
            target="_blank"
            v-logParams="{ ...setLogParams, ele_name: 'audio-detail-download'}"><i class="icrm-asr-download"></i></a>
        <!-- gpt -->
        <a 
            v-if="hasGptGray && (hasAsr || fileUrl && hasPlay)"
            href="javascript:;"
            @click.prevent="palyGpt"
            v-logParams="{ ...setLogParams, ele_name: 'audio-detail-gpt'}"><i class="icon-asr-gpt"></i></a>
    </div>
</template>
<script>
export default {
    name: 'AsrPlayer',
    props: {
        theme: {
            type: String,
            default: 'blue', //tiffany
        },
        showDuration: {
            type: Boolean,
            default: true
        },
        duration: {
            type: String,
            default: '00:00:00',
        },
        // has 权限控制
        hasPlay: {
            type: Boolean,
            default: true,
        },
        hasDownload: {
            type: Boolean,
            default: true,
        },
        hasAsr: {
            type: Boolean,
            default: true,
        },
        //下载地址
        fileUrl: {
            type: String,
            default: ''
        },
        //asrUrl
        asrUrl: {
            type: String,
            default: ''
        },
        audioInfo: {
            // audio需要将公司名称和时间传入
            type: Object,
            default: () => ({
                customerName: '',
                addTime: ''
            })
        },
        logParams: {// 上报埋点参数
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        setLogParams () {
            return {
                'wc_obj_type': 'call_r',
                ...this.logParams
            };
        },
        hasGptGray () {
            return this.$store.state.user.userGreyCodeList.includes('10052');
        },
    },
    methods: {
        playAsr () {
            this.$seeAsr(this.asrUrl, null, this.audioInfo);
        },
        palyGpt () {
            this.$seeAsr(this.asrUrl, null, this.audioInfo, {showGpt: true});
        }
    }
};
</script>
<style lang="less" scoped>
    @import '~@/styles/variable.less';
    .asr-player {
        display: flex;
        align-items: center;
        width: fit-content;
        flex-wrap: nowrap;
        padding: 2px 4px;
        line-height: 16px;
        border-radius: 4px;
        font-size: 0;
        background: @asr-bg-color;
        white-space: nowrap;

        .duration {
            font-size: 12px;
            color: #363F55;
        }
        & > a {
            display: block;
            width: 16px;
            height: 16px;
            color: @text-primary-color;
            margin-right: 0;
            &:hover {
                color: @text-primary-hover-color;
            }
            .icrm-asr-download,
            .icrm-asr-play {
                font-size: 16px;
            }
            &:nth-of-type(1) {
                margin-left: 4px;
            }
            &+a {
                margin-left: 2px;
            }
            .icon-asr-gpt {
                display: block;
                width: 18px;
                height: 18px;
                margin-top: -1px;
                // margin-left: -1px;
                background: url('./icon-gpt.png') no-repeat center center;
                background-size: 100% 100%;
            }
        }
        &.asr-player-tiffany {
            a {
                color: #12ADA9;
                &:hover {
                    color: #12ADA9;
                }
            }
        }
    }
</style>
