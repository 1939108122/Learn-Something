import emitter from '@/mixins/emitter.js';
export default {
    name: 'scroll-item',
    inject: ['scroll'],
    mixins: [emitter],
    props: {
        limit: { // 吸顶的头部高度
            type: Number,
            default: 30
        },
        buffer: { // 缓冲距离
            type: Number,
            default: 2
        }
    },
    watch: {
        'scroll.scrollY' (nv) {
            this.offsetTop = this.$el.offsetTop;
            this.watchScroll(nv);
        }
    },
    data () {
        return {
            offsetTop: 0
        };
    },
    render (h) {
        return h('li', {class: 'scroll-item'}, this.$slots.default);
    },
    methods: {
        watchScroll (val) {
            const disY = this.offsetTop - this.scroll.scrollY;
            if(disY > 0 && disY < this.limit-this.buffer){
                this.dispatch('scroll-view', 'move', [disY - this.limit, this.$vnode.key - 1]);
            }
            if(disY <= this.buffer){
                this.dispatch('scroll-view', 'update', [this.$vnode.key]);
            }
        }
    }
};