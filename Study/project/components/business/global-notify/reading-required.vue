<template>
    <!--这个div不能删，用来在外部销毁组件用-->
    <div>
        <ui-dialog
            :value="true"
            width="400"
            wrap-class="global-notify-reading-required-dialog"
            prevent-hide
            :show-close="false"
            :show-footer="false"
        >
            <template #title>
                <div class="icon">
                    <img :src="require('@/assets/images/icon-knowledge-required.png')" alt="" />
                </div>
                <div class="text">{{ title }}</div>
            </template>
            <template #content>
                <template v-if="dangerouslyUseHTMLString">
                    <div class="content-text" :class="customClass" v-html="content"></div>
                </template>
                <template v-else>
                    <div class="content-text normal" :class="customClass">{{ content }}</div>
                </template>

                <div class="content-footer">
                    <div class="time">{{ time }}</div>

                    <button class="btn btn-primary" @click="onView">查看</button>
                </div>

                <!--剩余消息提示-->
                <div class="rest-message-tip">
                    剩余 <span class="count">{{ restRequiredMessageCount }}</span> 条
                </div>
            </template>
        </ui-dialog>
    </div>
</template>

<script>
import { commonProps } from './common-props.js';
import { mapState } from 'vuex';

export default {
    name: 'GlobalNotifyReadingRequired',
    props: {
        ...commonProps
    },
    data() {
        return {
            // 【关闭提醒】
            close: () => {}
        };
    },
    computed: {
        ...mapState('globalMessage', ['requiredMessageList']),
        restRequiredMessageCount() {
            return this.requiredMessageList.length + 1;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // 关闭组件前执行的函数
            if (this.externalShow && typeof this.externalShow === 'function') {
                this.externalShow();
            }
        },
        // 点击了查看
        onView() {
            if (this.externalView && typeof this.externalView === 'function') {
                this.externalView();
            }
            // 销毁组件
            this.close();
        }
    }
};
</script>

<style lang="less">
.global-notify-reading-required-dialog {
    .dialog-container {
        border-radius: 8px;
    }

    .dialog-header {
        margin-bottom: 8px;
        .title {
            display: flex;
            align-items: center;
            .icon {
                display: flex;
                align-items: center;
                margin-right: 8px;

                img {
                    width: 28px;
                    height: 28px;
                    padding: 4px;
                    border-radius: 50%;
                    background: #fde3d6;
                }
            }
            .text {
                font-size: 16px;
                font-weight: 500;
                color: #1e2433;
                line-height: 20px;
            }
        }
    }

    .dialog-body {
        .content-text {
            font-size: 14px;
            color: #363f55;
            line-height: 22px;

            &.normal {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .content-footer {
            position: relative;
            margin-top: 24px;
            min-height: 32px;

            .time {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                color: #757d8c;
                line-height: 20px;
            }

            .btn {
                position: absolute;
                right: 0;
            }
        }

        .rest-message-tip {
            // 字体居中用
            font-family: Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, Oxygen, Ubuntu,
                Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            padding: 7px 12px;
            font-size: 13px;
            color: #363f55;
            line-height: 18px;

            position: absolute;
            display: inline-block;
            left: 0;
            top: -41px;
            border-radius: 16px 16px 16px 0;
            background-image: linear-gradient(111deg, #f0fff9 0%, #ffffff 52%, #ffe2c6 100%);

            .count {
                color: #f77233;
            }
        }
    }
}
</style>
