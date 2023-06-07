<template>
    <ui-popover
        class="asr-tags-item"
        :offset="0"
        transition=""
        popper-class="popover-asr-keyword"
        placement="bottom-start"
        title="命中关键词"
        trigger="hover">
        <div class="asr-tags-item-name" :class=" tags.hitTagStyle == 1 ? 'primary' : 'danger' " slot="reference">{{ tags.hitTagName }}</div>
        <div class="asr-tags-item-content">
            <ul v-if="tags.hitWord && Array.isArray(tags.hitWord) && tags.hitWord.length">
                <li @click="jumpSpecificChat(item)" v-for="(item, index) in tags.hitWord" :key="index">#{{ item }}</li>
            </ul>
            <div v-else>未匹配到数据</div>
        </div>
    </ui-popover>
</template>

<script>
export default {
    name: 'AsrCustomerTag',
    data () {
        return {};
    },
    props: {
        tags: {
            type: Object,
            default: () => ({
                hitTagName: '',
                hitTagStyle: 1,
                hitWord: []
            })
        }
    },
    methods: {
        jumpSpecificChat (text) {
            this.$emit('jump', text);
        }
    },
};
</script>

<style lang="less">
.asr-tags-item {
    position: relative;
    display: block;
    margin-right: 4px;
    margin-bottom: 4px;
    .asr-tags-item-name {
        padding: 1px 4px;
        line-height: 18px;
        font-size: 12px;
        border-radius: 2px;
        white-space: nowrap;
        &.primary {
            color: #077945;
            background-color: #E1F5ED;
        }
        &.danger {
            color: #E6405C;
            background-color: #FDECEE;
        }
    }
}
.popover-asr-keyword {
    z-index: 10000!important;
    max-width: 240px;
    box-shadow: 0px 2px 6px 0px rgba(49,51,56,0.16);
    border: 1px solid #E7EAEC;
    .ui-popover__title {
        line-height: 20px;
        font-weight: 500;
        color: #363F55;
        font-size: 14px;
    }
    .asr-tags-item-content {
        ul {
            display: flex;
            flex-wrap: wrap;
        }
        li {
            margin-right: 12px;
            margin-bottom: 2px;
            line-height: 22px;
            font-size: 13px;
            color: #4465EB;
            cursor: pointer;
            &:hover {
                font-weight: 500;
                color: #1C40D2;
            }
        }
    }
}

</style>