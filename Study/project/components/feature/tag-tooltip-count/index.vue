<template>
    <!-- 内容占据的空间超出原本的容器了 -->
    <!-- :visible-arrow="false" -->
    <ui-tooltip2
        v-if="tooltipVisible"
        effect="light"
        popper-class="tag-tooltip-count-popper"
        :offset="50"
        :placement="placement"
    >
        <div
            class="tag-tooltip-count-popper-origin"
            :class="{ onlyPlus: tooltipDisplayListMap.reference.some(item => item.value === UNIQUE_SYMBOL) }"
        >
            <ui-tag2
                v-for="item in tooltipDisplayListMap.reference"
                :key="item[props.value]"
                :closable="item.closable"
                @close="handleClose(item)"
                >{{ item.label }}</ui-tag2
            >
        </div>
        <template #content>
            <ui-scrollbar :max-height="maxHeight">
                <ui-tag2
                    v-for="item in tooltipDisplayListMap.content"
                    :key="item[props.value]"
                    :closable="item.closable"
                    @close="handleClose(item)"
                    >{{ item.label }}</ui-tag2
                >
            </ui-scrollbar>
        </template>
    </ui-tooltip2>
    <!-- 正常内容 -->

    <div v-else ref="originDisplayRef" class="tag-tooltip-count-popper-origin">
        <ui-tag2
            v-for="item in copyDataList"
            :key="item[props.value]"
            :closable="item.closable"
            @close="handleClose(item)"
            >{{ item.label }}</ui-tag2
        >
    </div>
</template>

<script>
import { debounce } from '@/utils/tools/optimize';
import UiTag2 from '@/components/feature/tag/index';

// 标签右 margin | 注意: 改这个值的时候要同步修改下面 css 的值 !!!

const MARGIN_RIGHT = 6;
// 标识符的标志（正常情况下不会出现的值）
const UNIQUE_SYMBOL = '$$*****$$';
// 避免浏览器自动计算的宽度有取整导致计算出现偏差
const BUFFER_WIDTH = 10;

export default {
    name: 'TagTooltipCount',
    components: { UiTag2 },
    props: {
        // 最大滚动高度
        maxHeight: {
            type: Number,
            default: 90 // 这个高度能够显示三行
        },
        // 字段名称
        props: {
            type: Object, // { label: string; value: string }
            default: () => ({
                label: 'label',
                value: 'value'
            })
        },
        // 是否可以关闭
        closable: {
            type: Boolean,
            default: false
        },
        // 数据源数组
        dataList: {
            type: Array,
            required: true
        },
        // 显示方向
        placement: {
            type: String,
            default: 'bottom'
        },
        //显示父级加子级
        showSearch: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            MARGIN_RIGHT,
            UNIQUE_SYMBOL,
            BUFFER_WIDTH,
            tooltipVisible: false, // 是否显示 tooltip
            copyDataList: [], // 备份数据
            // tooltip 使用的数据结构
            tooltipDisplayListMap: {
                reference: [],
                content: []
            }
        };
    },
    watch: {
        dataList: {
            handler(newVal) {
                this.copyDataList = (newVal || []).map(item => ({
                    label: this.props ? this.showSearch && item.parentName ?item.parentName + '/' + item[this.props.label] : item[this.props.label] : `${item}`,
                    value: this.props ? item[this.props.value] : `${item}`,
                    closable: this.closable || false,
                }));

                // 重新显示原本的容器（重新计算布局）
                this.tooltipVisible = false;

                this.$nextTick(() => {
                    try {
                        this.doLayout();
                    } catch (error) {
                        console.error('TagTooltipCount 组件执行逻辑出错', error);
                    }
                });
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        /**
         * 关闭节点（回传关闭的唯一数据标识 -> props.props.value 的值）
         * @param item 标签数据
         */
        handleClose(item) {
            // 传递关闭的数据
            this.$emit('close', item.value);
            // 重新显示原本的容器（重新计算布局）
            this.tooltipVisible = false;
        },

        /**
         * 屏幕宽度变化后重新计算
         */
        handleWindowResize() {
            const reCalc = debounce(() => {
                // 让正常容器显示出来
                this.tooltipVisible = false;
                // 过滤标识符项
                this.copyDataList = this.copyDataList.filter(item => item.value !== UNIQUE_SYMBOL);

                this.$nextTick(() => {
                    this.doLayout();
                });
            }, 100);

            this.$on('hook:mounted', () => {
                reCalc();
                window.addEventListener('resize', reCalc);
            });

            this.$on('hook:beforeDestroy', () => {
                window.removeEventListener('resize', reCalc);
            });
        },

        /**
         * 克隆节点-计算宽度（计数tag宽度）
         * @param node HTML标签
         * @param countStr 计数字符串 如: +99
         */
        calcCloneNode(node, countStr) {
            const cloneNode = node.cloneNode();
            // 放到一个看不到的位置
            cloneNode.style.position = 'absolute';
            cloneNode.style.top = '-9999px';
            cloneNode.style.left = '-9999px';
            // 放入数值文本，如 +99
            cloneNode.innerText = countStr;
            // 放到body上（用来获取实际渲染宽度）
            document.body.appendChild(cloneNode);
            const { offsetWidth } = cloneNode;
            // 移除节点
            cloneNode.remove();

            return {
                countNodeWidth: offsetWidth + MARGIN_RIGHT
            };
        },

        // 重新布局
        doLayout() {
            const { offsetWidth, children, childElementCount } = this.$refs.originDisplayRef;
            // 容器的所有子节点（所有 tag 标签）
            const childNodes = Array.from(children);
            // 子节点占据的空间宽度
            let nodeWidthCalc = 0;

            // 用 for 循环是为了可以用 break
            for (let childNodeIndex = 0; childNodeIndex < childNodes.length; childNodeIndex++) {
                const childNode = childNodes[childNodeIndex];
                // 每个子项的实际占用空间
                const itemRectWidth = childNode.offsetWidth + MARGIN_RIGHT;

                /* 没有超出容器 */
                if (nodeWidthCalc + itemRectWidth < offsetWidth) {
                    // 每次加和当前子元素节点的宽度 + 子元素的右边距
                    nodeWidthCalc += itemRectWidth;
                } else {
                    /* 超出容器了 */
                    // 第 x 个 开始，子元素相加的宽度就超过容器宽度了
                    const startExceededIndex = childNodeIndex;
                    // 还剩 x 个需要通过 popper 展示的
                    const remainCount = childElementCount - startExceededIndex;
                    // 计数节点的实际占用空间
                    const { countNodeWidth } = this.calcCloneNode(childNode, `+${remainCount}`);
                    // 最终的分隔索引值
                    const finalIndex =
                        nodeWidthCalc + countNodeWidth < offsetWidth - BUFFER_WIDTH
                            ? startExceededIndex
                            : startExceededIndex - 1;
                    // 插入指示数量
                    this.copyDataList.splice(finalIndex, 0, {
                        label: `+${childElementCount - finalIndex}`,
                        value: UNIQUE_SYMBOL,
                        closable: false
                    });
                    // 给 tooltip 用到的数据结构赋值
                    this.tooltipDisplayListMap = {
                        reference: this.copyDataList.slice(0, finalIndex + 1),
                        content: this.copyDataList.slice(finalIndex + 1)
                    };
                    // 显示 tooltip 容器
                    this.tooltipVisible = true;

                    // 跳出循环（已经完成对应的逻辑处理了）
                    break;
                }
            }
        }
    },
    mounted() {
        this.handleWindowResize();
    }
};
</script>

<style lang="less">
@max-width: 300px; // UI 定义的值

.tag-tooltip-count-popper {
    max-width: @max-width;
    width: 100%;
    line-height: 1 !important;
    padding: 3px 0 3px 6px;
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.08);

    .ui-scrollbar {
        .ui-scrollbar-view {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding-right: 12px;

            .ui-tag2 {
                display: inline-block;
                margin: 3px 4px 3px 0;
                max-width: calc(~'100% - 6px'); // 减去右 margin
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}

.tag-tooltip-count-popper-origin {
    width: 100%;
    height: 100%;

    &.onlyPlus {
        display: inline-block;
        max-width: 100%;
        width: unset;
    }
    // overflow: auto;
    // padding-left: 3px;

    &::-webkit-scrollbar {
        display: none;
    }

    .ui-tag2 {
        display: inline-block;
        //margin: 0 4px 3px 0;
        margin-right: 4px;
        max-width: calc(~'100% - 6px'); // 减去右 margin
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
