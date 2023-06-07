<template>
    <ul v-if="list.length" class="component-filtrate">
        <template v-for="(item, idx) in list">
            <li v-if="!hideList.includes(item.value)" :key="idx" :class="{'active': item.checked}" @click="select(item, idx)">
                <img v-if="item.new" src="@/assets/images/icon-new.png">
                <i class="ui-icon-circle-check-outline"></i>
                <div>{{ item.label }}<span v-if="item.count >=0">(<em class="text-red">{{ item.count }}</em>)</span></div>
            </li>
        </template>
        
    </ul>
</template>
<script>
export default {
    name: 'filtrate',
    props: {
        data: {
            type: Array,
            default: () => ([])
        },
        hideList: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            list: []
        };
    },
    watch: {
        data: {
            handler(list) {
                this.list = JSON.parse(JSON.stringify(list));
            },
            immediate: true
        }
    },
    methods: {
        select(item, idx) {
            this.$set(item, 'checked', !item.checked);
            let arr = [];
            let valueArr = [];
            this.list.map((value, key) => {
                if (value.checked) {
                    arr.push(value.value);
                    valueArr.push(value.label);
                }
            });
            this.$emit('input', arr.join(','));
            this.$emit('on-change', valueArr);
        }
    },
};
</script>

<style lang="less">
    .component-filtrate {
        display: inline-block;
        // margin-left: -10px;
        white-space: break-spaces;
        &:last-child li:last-child {
            margin-right: 0;
        }
        li {
            display: inline-block;
            position: relative;
            padding: 0 10px;
            // margin-left: 10px;
            margin-right: 10px;
            line-height: 28px;
            background: #ffffff;
            font-size: 14px;
            cursor: pointer;
            white-space: normal;
            border: 1px solid #e7eaed;
            border-radius: 4px;
            img {
                position: absolute;
                width: 24px;
                height: 10px;
                right: 0;
                top: -10px;
            }
            i {
                color: #a0a4b1;
                font-size: 16px;
                vertical-align: middle;
                margin-top: -2px;
            }
            div {
                display: inline-block;
                margin-left: 4px;
            }
            &.active {
                color: #54d8c9;
                border: 1px solid #54d8c9;
                i {
                    color: #54d8c9
                }
            }
        }
    }
</style>
