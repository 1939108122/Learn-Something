<template>
    <!--个人勋章通知 -->
    <!--该div用于销毁组件-->
    <div v-if="show">
        <ui-dialog :value="true" preventLayer :showClose="false" :showFooter="false">
            <template #content>
                <div class="medal-my">
                    <div class="medal-header">
                        <div class="medal-title">
                            <img :src="require('@/assets/images/sales/medal-title.png')" />
                        </div>
                        <div class="medal-cancel">
                            <i class="icrm-icon-close" @click="closeDial()" />
                        </div>
                    </div>
                    <div class="medal-content">
                        <div class="medal-info">
                            <!--定位   动画效果-->
                            <div
                                v-if="details.length > 1"
                                class="icon-content"
                                :class="{ 'icon-disabled': selectIndex === 0 }"
                            >
                                <i class="ui-icon-arrow-left" @click="goItem('pre')" />
                            </div>
                            <template v-for="(item, index) in details">
                                <div v-if="index == selectIndex" class="medal-item">
                                    <img :src="getIconUrl(item)" class="item-reward" />
                                    <span v-html="item.honorMessage" class="item-name"> </span>
                                </div>
                            </template>
                            <div
                                v-if="details.length > 1"
                                class="icon-content"
                                :class="{ 'icon-disabled': selectIndex === details.length - 1 }"
                            >
                                <i class="ui-icon-arrow-right" @click="goItem('next')" />
                            </div>
                        </div>
                        <div class="medal-total">
                            <div v-if="details.length > 1" class="total">
                                <span
                                    v-for="(item, index) in details"
                                    :key="item.inspirationId"
                                    :class="index == selectIndex ? 'cur-total-icon' : 'total-icon'"
                                ></span>
                            </div>

                            <span class="medal-tip">勋章可在激励中心查看</span>
                        </div>
                    </div>
                </div>
            </template>
        </ui-dialog>
    </div>
</template>
<script>
import { honorUrls } from '@/utils/tools/honorurl.js';
export default {
    name: 'Medal',
    data() {
        return {
            //是否显示个人激励播报提示
            details: [],
            selectIndex: 0, //当前展示的下标
            show: false
        };
    },
    methods: {
        goItem(mode) {
            if (mode == 'pre') {
                if (this.details.length > 0 && this.selectIndex > 0) {
                    this.selectIndex -= 1;
                }
            } else {
                if (this.details.length > 0 && this.selectIndex < this.details.length - 1) {
                    this.selectIndex += 1;
                }
            }
        },
        getIconUrl(cell) {
            const url = honorUrls.find(item => item.id === cell.srcId)?.url || '';
            return require('@/assets/images' + url) || '';
        },
        updateDial(data) {
            const source = JSON.parse(data);
            this.details = source.details;
            this.show = source.show;
        },
        destroyDial() {
            this.$emit('destroy');
        },
        closeDial() {
            this.show = false;
        }
    }
};
</script>
<style lang="less" scoped>
.medal-my {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 420px;
    height: 563px;
    background: linear-gradient(180deg, #fff4eb 0%, #ffffff 100%);
    border-radius: 8px;
    transform: translate(-50%, -50%);
    z-index: 3;
    .medal-header {
        height: 161px;
        padding: 48px 36px 88px;
        background-image: url('~@/assets/images/sales/medal-img.png');
        background-size: 420px;
        background-repeat: no-repeat;
        .medal-title {
            height: 25px;
            img {
                width: 348px;
            }
        }
    }
    .medal-cancel {
        width: 20px;
        height: 20px;
        margin-top: -57px;
        margin-right: -18px;
        padding-left: 4px;
        float: right;
        cursor: pointer;
        opacity: 0.5;
        &:hover {
            background: #f7f8fb;
        }
    }

    .medal-content {
        padding: 0 24px 24px;
        .medal-info {
            display: flex;
            justify-content: space-between;
        }
        .icon-content {
            width: 24px;
            height: 24px;
            padding: 3px;
            margin: 46px 0;
            font-size: 16px;
            border: 1px solid #999592;
            border-radius: 50px;
            cursor: pointer;
            i {
                display: flex;
                align-items: center;
            }
        }
        .medal-item {
            margin: -57px auto 0;
            img {
                display: flex;
                margin: 0 auto;
            }
            .item-name {
                display: block;
                position: absolute;
                left: 50%;
                width: 360px;
                margin-top: 9px;
                text-align: center;
                transform: translate(-50%, 0);
            }
        }
        .item-reward {
            width: 260px;
            height: 240px;
        }
    }
    .medal-total {
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translate(-50%, 0);
        .total {
            display: flex;
            justify-content: center;
        }
    }
    .total-icon,
    .cur-total-icon {
        width: 6px;
        height: 6px;
        background: #9fa6b5;
        margin-right: 8px;
        border-radius: 50px;
    }
    .total-icon {
        opacity: 0.2;
    }
    .medal-tip {
        display: block;
        margin-top: 12px;
        text-align: center;
        line-height: 17px;
        color: #757d8c;
        font-size: 12px;
        font-weight: 400;
    }
    .icon-disabled {
        cursor: not-allowed !important;
    }
}
</style>
