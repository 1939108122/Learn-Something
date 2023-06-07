<template>
    <ul class="quick-filtrate">
        <li v-for="(item, idx) in list" :key="idx" :class="{'active': item.checked}" @click="select(item, idx)" ><slot class="icon"></slot><div>
            <span v-if="isHtml" v-html="item.label"></span>
            <span v-else>{{ item.label }}</span>
            </div>
        </li>
    </ul>
</template>
<script>
export default {
    name: 'quickFiltrate',
    props: {
        data: {
            type: Array,
            default: ()=> ([])
        },
        isHtml: {
            type: Boolean,
            default: false,
        },
        value: {
            type: [String, Number],
            default: '',
        }
    },
    data() {
        return {
            list: []
        };
    },
    created() {
        let flag = false;
        let arr = this.value.toString().split(',');
        this.data.map((item, idx) => {
            flag = false;
            if(arr.indexOf(item.value.toString()) > -1){
                flag = true;
            }
            this.list.push(Object.assign(item, {
                checked: flag,
            }));
        });
    },
    methods: {
        select(item, idx) {
            item.checked = !item.checked;
            this.$set(this.list, idx, item);
            let arr = [];
            this.list.map((value, key) => {
                if(value.checked) {
                    arr.push(value.value);
                }
            });
            this.$emit('input', arr.join(','));
        }
    },
};
</script>

<style lang="less">
    .quick-filtrate {
        display: inline-block;
        margin-left: -10px;
        li {
            display: inline-block;
            position: relative;
            padding: 0 10px;
            margin-left: 10px;
            line-height: 28px;
            background: #ffffff;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
            border: 1px solid #CDD0D6;
            border-radius: 4px;
            i {
                color: #a0a4b1;
                font-size: 16px;
                vertical-align: middle;
                margin-top: -2px;
                margin-right: 4px;
            }
            div {
                display: inline-block;
            }
            &.active {
                color: #01A09C;
                border: 1px solid #00BEBD;
                i {
                    color: #01A09C;
                }
            }
        }
    }
</style>