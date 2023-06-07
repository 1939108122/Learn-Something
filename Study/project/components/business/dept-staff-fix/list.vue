<template>
    <li class="tree-item" :style="{'max-height': viewH + 'px', 'overflow': 'auto'}" ref="list">
        <div :style="{height: scrollH + 'px', 'padding-top': translateY + 'px'}">
            <div :style="{'transform': 'translateY(' + {translateY} + 'px)'}" :key="timeStamp">
                <p class="dept-person" v-for="(item, index) in list" :key="index" @click="chooseItem(item)">{{ item.name }}</p>
            </div>
        </div>
    </li>
</template>

<script type="text/javascript">
import { throttle } from '@/utils/tools/optimize.js';
export default {
    name: 'list',
    props: {
        staffList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    watch: {
        staffList: {
            handler(val){
                this.$nextTick(() => {
                    this.list = val.slice(0, this.count);
                    this.initList();
                });
            },
            immediate: true
        }
    },
    data () {
        return {
            itemHeight: 38,
            len: 0,
            start: 0, // 记录开始值
            viewH: 186, // 最大市口高度
            scrollH: 0, // 滑动高度
            list: [], // 展示的数组，
            count: 6, // 可查看数量
            translateY: 0, // 偏移量
            timeStamp: Date.now(),
        };
    },
    methods: {
        updateKey () {
            this.timeStamp = Date.now();
        },
        initList () {
            this.translateY = 0;
            this.start = 0;
            this.len = this.staffList.length;
            this.scrollH = this.itemHeight * this.len;
        
            this.count = Math.ceil(this.viewH / this.itemHeight) + 4 ; // 上下多余出两个
        },
        chooseItem (item) {
            this.$emit('change-item', item);
        },
    },
    created() {
        
    },
    mounted () {
        this.$refs.list.addEventListener('scroll', throttle((e) => {
            let start = e.target.scrollTop / this.itemHeight;
            this.translateY = e.target.scrollTop - e.target.scrollTop % this.itemHeight;
            if (parseInt(this.start) == parseInt(start)) {
                return;
            }
            this.start = start;
            this.list = this.staffList.slice(start, start + this.count);
        }, 70));
    }
};
</script>
<style lang="less" scoped>
.tree-item{
    padding: 0;
    margin-bottom: 0;
}
.dept-person{
    height: 36px;
    line-height: 22px;
    padding: 7px 8px;
    color: #414a60;
    &:hover{
        background-color: #F2F5FA;
    }
}
</style>