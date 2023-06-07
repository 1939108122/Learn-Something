// todo 开发用
// import asrList from './asr_list';
import asrSelect from './asr-select.vue';
import asrSlider from './asr-slider.vue';
import { debounce } from '@/utils/tools/optimize.js';

const titleMap = {
    // Agent: '顾问',
    // Customer: '客户',
    Agent: require('@/assets/images/avatar-service.png'),
    Customer: require('@/assets/images/avatar.png')
};

const scrollEnd = debounce((that) => {
    that._isUserScroll = false;
    that._isMousewheel = false;
}, 1200);

export default {
    components: {
        asrSelect,
        asrSlider
    },
    data() {
        return {
            titleMap,
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
