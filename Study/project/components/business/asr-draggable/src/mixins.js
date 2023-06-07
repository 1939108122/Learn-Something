// todo 开发用
// import asrList from './asr_list';
import asrSelect from './asr-select.vue';
import asrSlider from './asr-slider.vue';
import { debounce } from '@/utils/tools/optimize.js';
import GptTyping from './gpt-typing.vue';
import CustomerTag from './customer-tag';

const titleMap = {
    Agent: require('./images/avatar-salesperson.png'), // 顾问
    Customer: require('./images/avatar-customer.png') // 客户
};

const titleNameMap = {
    // Agent: '顾问',
    Agent: '销售',
    Customer: '客户'
};

const scrollEnd = debounce((that) => {
    that._isUserScroll = false;
    that._isMousewheel = false;
}, 1200);

export default {
    components: {
        asrSelect,
        asrSlider,
        GptTyping,
        CustomerTag
    },
    data() {
        return {
            titleMap,
            titleNameMap,
            speed: 1,
        };
    },
    mounted() {
        this.setMouseEvent();
    },
    methods: {
        setMouseEvent() {
            // 通过获取鼠标位置来模拟
            this.$nextTick(() => {
                this.ASRView = document.querySelector('#__asr_view');
                if(!this.ASRView) return;
                let rect = this.ASRView.getBoundingClientRect();
                let html = document.getElementsByTagName('html')[0];

                this.ASRView.onmousemove = (event) => {
                    let w = rect.width - event.clientX + rect.left;
                    if(w < 9 && w > 1) {
                        html.onmousedown = () => {
                            this._isUserScroll = true;
                        };
                    } else {
                        html.onmousedown = null;
                    }
                };
            });
        },
        onSpeedChange(s) {
            try {
                if(this.audio) this.audio.playbackRate = s;
            } catch (e) {
                //
            }
        },
        onScrollEnd() {
            scrollEnd(this);
        }
    }
};
