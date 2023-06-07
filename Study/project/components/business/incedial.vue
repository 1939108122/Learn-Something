<template>
    <!--最新弹框-->
    <div class="broad-notice-my" id="myNotice">
        <div class="broad-header">
            <div class="broad-title">
                <img :src="require('@/assets/images/sales/tip-img.png')" />
            </div>
            <div class="broad-cancel">
                <i class="icrm-icon-close" @click="closeDial()" />
            </div>

            <div class="broad-rules">奖励明细可在激励中心查看</div>
        </div>
        <div class="broad-content">
            <div class="broad-info">
                <div class="icon-content">
                    <i class="ui-icon-arrow-left" @click="selectIndex == 0 ? '' : getPre()" />
                </div>
                <div v-for="(item, index) in details" :key="item.inspirationId">
                    <div v-if="index == selectIndex" class="broad-item">
                        <div class="item-reward">
                            <div v-if="item.inspirationAttr !== '1002'" class="item-price"><span>¥</span>{{ item.rewardAmount }}</div>
                            <div v-if="item.inspirationAttr !== '1002'" class="item-type">{{ item.inspirationAttrStr }}</div>

                            <div v-if="item.inspirationAttr == '1002'" class="item-price" :style="{ fontSize: item.inspirationName.length > 10 ? '14px' : '20px' }">
                                {{ item.inspirationName }}
                            </div>
                        </div>
                        <div class="item-desc">
                            <div class="item-name">{{ item.inspirationMonth }}激励</div>
                            <div class="item-reason">发放原因: {{ item.providerReason }}</div>
                            <div class="item-reason">发放形式: {{ item.providerForm }}</div>
                        </div>
                    </div>
                </div>
                <div class="icon-content">
                    <i class="ui-icon-arrow-right" @click="selectIndex == details.length - 1 ? '' : getNext()" />
                </div>
            </div>
            <div class="broad-total">
                <div v-for="(item, index) in details" :key="item.inspirationId" :class="index == selectIndex ? 'cur-total-icon' : 'total-icon'"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'incedial',
    data() {
        return {
            //是否显示个人激励播报提示
            details: [],
            selectIndex: 0, //当前展示的下标
            callParams: {
                inspirationMonth: '', //激励月份
                inspirationId: '', //激励id
                inspirationAttrStr: '', //激励品属性
                inspirationName: '', //激励品名称
                providerReason: '', //发放原因
                providerForm: '', //发放形式
                providerTime: '', //发放时间
            },
        };
    },
    methods: {
        getPre() {
            if (this.details.length > 0 && this.selectIndex >= 0) {
                this.selectIndex -= 1;
            }
        },
        getNext() {
            if (this.details.length > 0 && this.selectIndex < this.details.length) {
                this.selectIndex += 1;
            }
        },
        updateDial(data) {
            this.details = JSON.parse(data);
        },
        closeDial() {
            const myNotice = document.getElementById('myNotice');
            this.$emit('destroy');
            document.body.removeChild(myNotice);
        },
    },
};
</script>
<style lang="less" scoped>
.broad-notice-my {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 460px;
    border-radius: 8px;
    padding: 0 8px 8px;
    z-index: 2000;
    background: linear-gradient(180deg, #fc384b 0%, #fae0cf 100%);
    transform: translate(-50%, -50%);
    .broad-header {
        height: 76px;
        .broad-title {
            height: 100%;
            img {
                width: 420px;
            }
        }
        .broad-cancel {
            margin-top: -58px;
            float: right;
            color: #fff;
            cursor: pointer;
            opacity: 0.7;
            margin-right: 15px;
        }
        .broad-rules {
            margin-top: -35px;
            margin-left: 4px;
            font-size: 12px;
            transform: scale(0.9);
            font-weight: 400;
            color: #fff;
            line-height: 20px;
        }
    }
    .broad-content {
        position: relative;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, #ffffff 16%, #ffffff 100%);
        border-radius: 8px;
        border: 1px solid #ffffff;
        padding: 42px 12px 16px 6px;
        z-index: 2;
        .broad-info {
            display: flex;
            justify-content: space-between;
        }
        .icon-content {
            width: 24px;
            height: 24px;
            padding: 0px 4px 4px 2px;
            font-size: 16px;
            margin: auto 0;
            border-radius: 4px;
            cursor: pointer;
            background: #ecedf0;
            transform: rotate(45deg);
            padding-left: 4px;
            .ui-icon-arrow-left:before,
            .ui-icon-arrow-right:before {
                transform: rotate(-45deg);
                display: inline-block;
            }
        }
        .broad-item {
            display: flex;
            background: #ffffff;
            border-radius: 4px;
            margin: 0 11px 0 14px;
            .item-reward {
                width: 137px;
                padding: 19px 12px 24px 12px;
                text-align: center;
                border-radius: 4px;
                background: radial-gradient(circle at top left, transparent 0, #ffe8ef 0) top left, radial-gradient(circle at top right, transparent 10px, #ffe8ef 0) top right,
                    radial-gradient(circle at bottom right, transparent 10px, #ffe8ef 0) bottom right, radial-gradient(circle at bottom left, transparent 0, #ffe8ef 0) bottom left;
                background-size: 51% 51%;
                background-repeat: no-repeat;
                .item-price {
                    font-size: 30px;
                    font-family: kanzhun;
                    color: #e6405c;
                    line-height: 36px;
                    span {
                        font-size: 14px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        line-height: 20px;
                    }
                }
                .item-type {
                    background: rgba(255, 215, 226, 0.6);
                    border-radius: 11px;
                    font-size: 12px;
                    font-weight: 400;
                    color: #e6405c;
                    line-height: 17px;
                    margin: 12px auto 0;
                    padding: 3px 16px 1px;
                    height: 21px;
                    width: 80px;
                }
            }

            .item-desc {
                position: relative;
                width: 220px;
                padding-left: 16px;
                padding-bottom: 26px;
                text-align: left;
                border-radius: 4px;
                border: 1px solid #dbdfe6;
                border-left: 0;
                font-size: 12px;
                font-weight: 400;
                color: #9fa6b5;
                line-height: 17px;
                .item-name {
                    margin-top: 32px;
                    font-size: 16px;
                    font-weight: 500;
                    color: #1e2433;
                    line-height: 22px;
                }
                .item-reason {
                    margin-top: 8px;
                    padding: 0 26px 0 0;
                    background: #fff;
                    color: #9fa6b5;
                }
            }
            .item-desc:before {
                position: absolute;
                border-radius: 0 0 100% 0;
                content: ' ';
                border-right: 1px solid #dbdfe6;
                border-top: 1px solid #fff;
                width: 11px;
                height: 11px;
                left: -2px;
                top: -1px;
                background: #fff;
            }
            .item-desc:after {
                position: absolute;
                border-radius: 0 100% 0 0;
                content: ' ';
                border-right: 1px solid #dbdfe6;
                width: 11px;
                height: 11px;
                bottom: -1px;
                left: -1px;
                background: #fff;
            }
        }
    }
    .broad-total {
        display: flex;
        margin-top: 26px;
        justify-content: center;
    }
    .total-icon,
    .cur-total-icon {
        width: 4px;
        height: 4px;
        background: #ea4250;
        margin-right: 6px;
    }
    .total-icon {
        opacity: 0.2;
    }
}
</style>
