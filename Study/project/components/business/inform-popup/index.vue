<template>
    <div class="inform-popup" v-if="Object.keys(informMap).length !== 0">
        <ul
            v-for="(itemArr, informType) in informMap"
            class="inform-item-list lightSpeedIn"
            :key="informType"
            :ref="`itemArr-${informType}`"
            @animationend="onTransitionEnd(informType)"
        >
            <!-- 不可以折叠 -->
            <template v-if="itemArr[0].canFold === undefined">
                <li class="inform-item">
                    <template v-if="!itemArr[0].hideIconOption">
                        <a href="javascript:void(0);" class="icon-wrapper" @click.prevent="onClose(itemArr[0])"><i class="icrm-close"></i></a>
                    </template>
                    <div class="icon">
                        <svg class="i-sprite-crm" aria-hidden="true">
                            <use xlink:href="#i-crm-infrom"></use>
                        </svg>
                    </div>
                    <div class="content">
                        <dots :line="2" :txt="generateInformText(itemArr)" placement="top" />
                        <!-- 3.53.12 添加 -->
                        <template v-if="itemArr[0].subTitle">
                            <dots :line="1" :txt="itemArr[0].subTitle" placement="top" />
                        </template>
                    </div>
                    <a href="javascript:void(0);" class="operation" @click.prevent="onLookOver(itemArr[0])">查看</a>
                </li>
            </template>
            <!-- 可以折叠 -->
            <template v-else>
                <!-- 折叠状态 -->
                <template v-if="itemArr[0].foldState">
                    <li class="inform-item">
                        <a href="javascript:void(0);" class="icon-wrapper" @click="toggleFold(itemArr)"
                            ><i class="icrm-side-arrow" :class="{ fold: itemArr[0].foldState }"></i
                        ></a>
                        <div class="icon">
                            <svg class="i-sprite-crm" aria-hidden="true">
                                <use xlink:href="#i-crm-infrom"></use>
                            </svg>
                        </div>
                        <div class="content">
                            <dots :line="2" :txt="generateInformText(itemArr)" placement="top" />
                            <!-- 3.53.12 添加 -->
                            <template v-if="itemArr[0].subTitle">
                                <dots :line="1" :txt="itemArr[0].subTitle" placement="top" />
                            </template>
                        </div>
                        <a href="javascript:void(0);" class="operation" @click.prevent="onLookOver(itemArr[0])">查看</a>
                    </li>
                </template>
                <!-- 展开状态 -->
                <template v-else>
                    <li class="inform-item" v-if="itemArr.length > 1">
                        <a href="javascript:void(0);" class="icon-wrapper" @click="toggleFold(itemArr)"
                            ><i class="icrm-side-arrow" :class="{ fold: itemArr[0].foldState }"></i
                        ></a>
                        <div class="icon">
                            <svg class="i-sprite-crm" aria-hidden="true">
                                <use xlink:href="#i-crm-infrom"></use>
                            </svg>
                        </div>
                        <div class="content">
                            <dots :line="2" :txt="generateInformText(itemArr)" placement="top" />
                            <!-- 3.53.12 添加 -->
                            <template v-if="itemArr[0].subTitle">
                                <dots :line="1" :txt="itemArr[0].subTitle" placement="top" />
                            </template>
                        </div>
                        <a href="javascript:void(0);" class="operation" @click.prevent="onLookOver(itemArr[0])">查看</a>
                    </li>
                    <li class="inform-item" v-for="item in itemArr" :key="item.timestamp">
                        <a href="javascript:void(0);" class="icon-wrapper" @click.prevent="onDeleteFoldItem(itemArr, item, 'close')"><i class="icrm-close"></i></a>
                        <div class="icon">
                            <svg class="i-sprite-crm" aria-hidden="true">
                                <use xlink:href="#i-crm-infrom"></use>
                            </svg>
                        </div>
                        <div class="content">
                            <dots :line="2" :txt="generateInformText(item)" placement="top" />
                            <!-- 3.53.12 添加 -->
                            <template v-if="itemArr[0].subTitle">
                                <dots :line="1" :txt="item.subTitle" placement="top" />
                            </template>
                        </div>
                        <a href="javascript:void(0);" class="operation" @click.prevent="onDeleteFoldItem(itemArr, item, 'lookOver')">查看</a>
                    </li>
                </template>
            </template>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'inform-popup',
    data() {
        return {
            // 提示列表
            informMap: {
                // exam: [{ type: 'exam', typeName: '考试', inform: 'inform1', url: 'url1' }], // 考试推送
                // announcement: [{ type: 'announcement', typeName: '公告', inform: 'inform2', url: 'url2' },], // 公告推送
                // knowledge: [{ type: 'knowledge', typeName: '知识库', inform: 'inform3', url: 'url3' }], // 知识库推送
                // talkExam: [{ type: 'talkExam', typeName: '话术考试', inform: 'inform3', url: 'url3' }], // 话术考试推送
            },
        };
    },
    methods: {
        // 生成不重复的ID
        generateNonDuplicateID(randomLength) {
            // 引入时间戳 随机数前置 36进制 加入随机数长度控制
            if (randomLength < 13 || randomLength > 16) {
                console.error('请输入13-16之内的整数');
                return;
            }
            // 随机数长度
            randomLength = randomLength ? randomLength : 13 + Math.floor(Math.random() * 4);
            return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36);
        },
        // 改变折叠状态
        toggleFold(targetArr) {
            if (Array.isArray(targetArr)) {
                targetArr.forEach((item) => {
                    item.foldState = !item.foldState;
                });
            }
        },
        /**
         * 消息推送设置
         * 如果是可以折叠的消息：canFold、foldState 这两个必须都传
         */
        informFn(
            informObj = {
                option: '',
                id: '',
                type: '',
                typeName: '',
                inform: '',
                lookOver: null,
                close: null,
                canFold: false, // 是否可以折叠
                foldState: false, // 折叠状态
                hideIconOption, // 是否隐藏关闭图标配置 { type: 'knowledge' }
                subTitle: '', // 副标题
            }
        ) {
            /*
             * 目前线上使用的   inform类型
             * exam          考试通知
             * announcement  公告通知
             * knowledge     知识库更新通知
             * talkExam      话术考试
             * examNotice    考试系统消息通知
             *
             * renewalNewEmployer 合作客户管理-新雇主数据更新通知
             * renewalOldEmployer 合作客户管理-老雇主数据更新通知
             * */
            /*  使用方式
                this.$inform.push({
                    option: 'delete', // 默认添加推送消息，delete表示删除某条推送消息
                    id: '', // 删除消息的id
                    type: 'knowledge', // 业务类型
                    typeName: '考试', // 业务类型名称
                    inform: '新人入职考试', // 通知内容
                    lookOver: function () { // 点击查看后要做哪些事（如埋点）
                        console.log('lookOver');
                    },
                    close: function () { // // 点击叉号后要做哪些事（如埋点）
                        console.log('close');
                    },
                });
            */
            const {
                option,
                id,
                type,
                typeName,
                inform,
                lookOver,
                close,
                keepInformText,
                specialTreatment,
                canFold, // 是否可以折叠
                foldState, // 折叠状态
                hideIconOption,
                subTitle,
            } = informObj;

            // 根据id删除一条推送消息
            if (option === 'delete') {
                if (!id) return;
                for (let infoType in this.informMap) {
                    this.informMap[infoType].forEach((item, index, arr) => {
                        if (item.id === id) {
                            arr.splice(index, 1);
                        }
                    });
                }
            } else {
                // 默认添加推送消息
                if (!type) return;
                const target = {
                    timestamp: this.generateNonDuplicateID(),
                    option,
                    id,
                    type,
                    typeName,
                    inform,
                    lookOver,
                    close,
                    keepInformText,
                    specialTreatment,
                    canFold,
                    foldState,
                    hideIconOption,
                    subTitle,
                };
                // 如果输入这四种类型
                if (type in this.informMap) {
                    // 向对应项添加新成员
                    this.informMap[type].push(target);
                    this.$nextTick(() => {
                        this.$refs[`itemArr-${type}`][0].classList.add('heartBeat');
                    });
                } else {
                    // 添加新类型
                    this.$set(this.informMap, `${type}`, [target]);
                }
            }
        },
        // 关闭
        onClose({ type, close }) {
            // 清空对应类型的数据
            this.$delete(this.informMap, type);
            if (typeof close === 'function') {
                close();
            }
        },
        /**
         * 用于删除折叠中的项目
         *
         * operate: lookOver-调用查看方法  close-调用关闭方法
         */
        onDeleteFoldItem(targetArr, targetItem, operate = 'lookOver') {
            if (targetArr.length > 1) {
                const targetIndex = targetArr.findIndex(item => item.timestamp === targetItem.timestamp);
                targetArr.splice(targetIndex, 1);
            } else {
                // 清空此类型的数据
                this.$delete(this.informMap, targetItem.type);
            }
            if (operate === 'lookOver' && typeof targetItem.lookOver === 'function') {
                targetItem.lookOver();
            }
            if (operate === 'close' && typeof targetItem.close === 'function') {
                targetItem.close();
            }
        },
        // 查看
        onLookOver({ type, lookOver, hideIconOption }) {
            // 清空对应类型的数据
            this.$delete(this.informMap, type);
            if (typeof lookOver === 'function') {
                lookOver();
                if (hideIconOption) {
                    // 知识点类型-作如下处理
                    if (hideIconOption.type === 'knowledge') {
                        try {
                            /**
                             * 做法来源
                             * 处理3.47.04需求【https://wiki.kanzhun-inc.com/pages/viewpage.action?pageId=149058063】
                             * 关联消息文件 src/services/user.js
                             */
                            // 保存引用
                            const messageList = this.$store.state.common.hideIconKnowledgeMessageList;
                            if (messageList.length !== 0) {
                                const targetItem = messageList[0];
                                this.$store.commit('common/deleteKnowledgeListMessage', targetItem.addTimeStamp);
                                /* 不用处理 全局消息改版 */
                                this.$inform(targetItem);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        },
        onTransitionEnd(informType) {
            this.$refs[`itemArr-${informType}`][0].classList.remove('heartBeat');
            this.$refs[`itemArr-${informType}`][0].classList.remove('lightSpeedIn');
        },
        /**
         * 生成通知类型提示文本（单类型单条、单类型多条）
         * @param {Array} target 每个通知类型的数组
         */
        generateInformText(target) {
            if (Array.isArray(target)) {
                // 当前通知类型数量
                const informLength = target.length;
                // 获取通知类型、通知内容
                const {
                    typeName, // 获取通知类型
                    inform, // 通知内容
                    keepInformText = false, // 是否保持显示通知内容（单类型多条时用）
                    specialTreatment, // 需要特殊处理
                } = target[0];
                // 最终的提示文本
                let informContent = '';
                if (specialTreatment) {
                    // 嵌入的考试系统通知
                    if (specialTreatment === 'exam-system') {
                        informContent = inform.replace('$$', target.length);
                    }
                } else {
                    if (informLength > 1) {
                        informContent = `您有${target.length}个${target[0].typeName}通知，请及时查看。`;
                        if (keepInformText) {
                            informContent += inform;
                        }
                    } else {
                        informContent = `${typeName}通知：${inform}`;
                    }
                }
                return informContent;
            } else {
                const {
                    typeName, // 获取通知类型
                    inform, // 通知内容
                } = target;
                return `${typeName}通知：${inform}`;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.inform-popup {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 2000;
    padding: 10px;
    max-height: calc(~'100% - 48px - 30px');
    overflow-y: auto;
    margin-right: -19px;
    width: 439px;
    &::-webkit-scrollbar {
        display: none;
    }
    .inform-item-list {
        margin-bottom: 10px;
        .inform-item {
            box-sizing: content-box;
            position: relative;
            padding: 30px 30px 20px 30px;
            width: 340px;
            min-height: 40px;
            margin-bottom: 10px;
            background-color: #ffffff;
            box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.11);
            -webkit-box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.11);
            border-radius: 3px;
            display: flex;
            align-items: center;

            &:last-child {
                margin-bottom: 0;
            }

            .icon {
                float: left;
                width: 40px;
                height: 40px;
                margin-right: 20px;

                .i-sprite-crm {
                    display: block;
                    width: 40px;
                    height: 40px;
                }
            }

            .content {
                flex-basis: 230px;
                line-height: 20px;
                min-height: 40px;
                overflow: hidden;

                span {
                    display: inline-block;
                    vertical-align: middle;
                    margin: auto 0;
                }
            }

            .operation {
                float: right;
                width: 60px;
                height: 32px;
                // margin-top: 4px;
                margin-left: 10px;
                line-height: 32px;
                background-color: #53cac3;
                text-align: center;
                color: #ffffff;
                border-radius: 3px;

                &:hover {
                    background-color: #42e2d0;
                }
            }

            .icon-wrapper {
                position: absolute;
                padding: 2px;
                top: 6px;
                right: 6px;
                color: #8a91a4;
                line-height: 12px;

                &:hover {
                    background-color: #dddddd;
                }

                i {
                    display: inline-block;
                    font-size: 12px;
                    // transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                    &.icrm-side-arrow {
                        &.fold {
                            transform: rotate(90deg);
                        }
                    }
                }
            }
        }
        .inform-item-more {
            padding: 12px 30px 13px 30px;
            width: 340px;
            height: auto;
            margin-bottom: 0;
            line-height: 12px;
            text-align: right;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .op-more {
            color: #53cac3;
            i {
                display: inline-block;
                margin-left: 5px;
                font-size: 12px;
            }
        }
    }
}

@-webkit-keyframes lightSpeedIn {
    from {
        -webkit-transform: translate3d(100%, 0, 0) skewX(-30deg);
        transform: translate3d(100%, 0, 0) skewX(-30deg);
        opacity: 0;
    }

    60% {
        -webkit-transform: skewX(20deg);
        transform: skewX(20deg);
        opacity: 1;
    }

    80% {
        -webkit-transform: skewX(-5deg);
        transform: skewX(-5deg);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

@keyframes lightSpeedIn {
    from {
        -webkit-transform: translate3d(100%, 0, 0) skewX(-30deg);
        transform: translate3d(100%, 0, 0) skewX(-30deg);
        opacity: 0;
    }

    60% {
        -webkit-transform: skewX(20deg);
        transform: skewX(20deg);
        opacity: 1;
    }

    80% {
        -webkit-transform: skewX(-5deg);
        transform: skewX(-5deg);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

.lightSpeedIn {
    -webkit-animation-name: lightSpeedIn;
    animation-name: lightSpeedIn;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

@-webkit-keyframes heartBeat {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    14% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
    }

    28% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    42% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
    }

    70% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes heartBeat {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    14% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
    }

    28% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    42% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
    }

    70% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

.heartBeat {
    -webkit-animation-name: heartBeat;
    animation-name: heartBeat;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
}
</style>
