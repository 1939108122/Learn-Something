<template>
    <div class="btns-select">
        <a href="javascript:;" :class="['btns-select-trigger', {'open': show}]"
           @click.prevent="toggle" v-clickoutside="hide">
            <span>{{placeholder}}</span>
            <i class="icrm-bossui-icon-down"></i>
        </a>
        <template v-if="show">
            <div class="btns-select-lists">
                <slot></slot>
                <!--<ul>
                    <li v-for="(item, index) in list"
                        :key="index"
                        @click="selectItem(item, index)">
                        {{item.label}}
                    </li>
                </ul>-->
            </div>
        </template>
    </div>
</template>
<script>
export default {
    data() {
        return {
            show: false,
        };
    },
    props: {
        placeholder: {
            type: String,
            default: '批量处理'
        }/*,
        list: {
            type: Array,
            default: () => [],
            required: true,
        }*/
    },
    created() {
    },
    methods: {
        toggle() {
            this.show = !this.show;
        },
        hide() {
            this.show = false;
        }/*,
        selectItem(item, index) {
            this.$emit('on-select', item, index);
        }*/
    }
};
</script>
<style lang="less" scoped>
    @import "./index.less";
</style>
