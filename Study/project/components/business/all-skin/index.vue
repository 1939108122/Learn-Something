<template>
    <!--城市皮肤通知城市全体-->
    <!--该div用于销毁组件-->
    <div v-if="show">
        <ui-dialog :value="true" preventLayer :showFooter="false" :showClose="false">
            <template #content>
                <div class="skin-all" :class="allclass">
                    <div class="skin-content">
                        <span class="skin-cancel">
                            <i class="icrm-icon-close" @click="close" />
                        </span>
                        <span class="skin-message" v-html="honorMessage" />
                        <span @click="changeSkin" class="skin-btn">立即换肤</span>
                        <span class="skin-tip">皮肤可在左下角换肤入口内进行切换</span>
                    </div>
                </div>
            </template>
        </ui-dialog>
    </div>
</template>
<script>
export default {
    name: 'AllSkin',
    data() {
        return {
            //是否显示个人激励播报提示
            details: [],
            show: false,
            ranking: '第一',
            allclass: '',
            honorMessage: '', // 弹窗信息
            theme: 0 //默认的主题
        };
    },
    methods: {
        updateDial(data) {
            const source = JSON.parse(data);
            this.details = source.details;
            this.show = source.show;
            this.allclass = this.getStyle();
            this.honorMessage = this.details?.[0]?.honorMessage || '';
            this.$store.dispatch('user/fetchUserHonor');
        },
        getStyle() {
            const srcId = this.details?.[0]?.srcId || '';
            if (srcId === 26) {
                this.theme = 5;
                return 'dragon';
            } else if (srcId === 27) {
                this.theme = 6;
                return 'elephant';
            } else if (srcId === 28) {
                this.theme = 7;
                return 'tiger';
            } else if (srcId === 29) {
                this.theme = 8;
                return 'leopard';
            } else if (srcId === 30) {
                this.theme = 9;
                return 'wolf';
            } else {
                return '';
            }
        },
        close() {
            this.show = false;
            this.$emit('destroy');
        },
        changeSkin() {
            this.$store.dispatch('user/setMenuTheme', this.theme);
            this.close();
        }
    }
};
</script>
<style lang="less" scoped>
.skin-all {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 420px;
    height: 550px;
    background-size: 420px;
    transform: translate(-50%, -50%);
    z-index: 3;
    border-radius: 0 0 16px 16px;

    .skin-content {
        margin-top: 354px;
        .skin-message {
            display: flex;
            justify-content: center;
        }
        .skin-cancel {
            position: relative;
            width: 20px;
            height: 20px;
            margin-top: -333px;
            margin-right: 18px;
            padding-left: 4px;
            float: right;
            color: #fff;
            cursor: pointer;
            opacity: 0.5;
            z-index: 4;
        }
        .skin-btn {
            display: block;
            width: 116px;
            height: 40px;
            padding: 10px 28px;
            margin: 47px auto 12px;
            line-height: 21px;
            font-size: 15px;
            font-weight: 500;
            text-align: center;
            border-radius: 20px;
            cursor: pointer;
        }
        .skin-tip {
            display: block;
            line-height: 17px;
            color: #fff;
            opacity: 0.5;
            text-align: center;
            font-size: 12px;
            font-weight: 400;
        }
    }
}
.dragon {
    background-image: url('./img/dragon.png');
    .skin-btn {
        background: linear-gradient(161deg, #3bdfa7 0%, #4ceded 100%);
        color: #363f55;
        box-shadow: inset 1px 1px 1px 0px #7cfff0;
    }
}
.elephant {
    background-image: url('./img/elephant.png');
    .skin-btn {
        background: linear-gradient(161deg, #efaa45 0%, #ffcf5b 100%);
        color: #3b2d1c;
        box-shadow: inset 1px 1px 1px 0px #ffeb7c;
    }
}
.leopard {
    background-image: url('./img/leopard.png');
    .skin-btn {
        background: linear-gradient(161deg, #d6ffd0 0%, #adeee7 100%);
        color: #263044;
        box-shadow: inset 1px 1px 1px 0px #e8fff0;
    }
}
.wolf {
    background-image: url('./img/wolf.png');
    .skin-btn {
        background: linear-gradient(161deg, #cc9fff 0%, #f0bcff 100%);
        color: #2f1b3e;
        box-shadow: inset 1px 1px 1px 0px #f2e3fe;
    }
}
.tiger {
    background-image: url('./img/tiger.png');
    .skin-btn {
        background: linear-gradient(161deg, #ef8c45 0%, #ffa05b 100%);
        color: #3b2d1c;
        box-shadow: inset 1px 1px 1px 0px #ffbd7c;
    }
}
</style>
