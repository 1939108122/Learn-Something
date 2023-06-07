
import { formatDate } from '@/utils/tools/utils.js';

export default {
    data () {
        return {
            trackEventStartTime: 0,
        };
    },
    methods: {
        onShow () {
            this.trackEventStartTime = Date.now(); // 记录点击时间
        },
        onHide (name) {
            const trackEventEndTime = Date.now();
            const duration = trackEventEndTime - this.trackEventStartTime;

            // 小于200ms 不上报
            if (duration < 200) return;

            const __duration = (duration / 1000).toFixed(1);
            const options = {
                p1: this.$store.state.user.userInfo.userId, // userid
                p2: this.$parent.origin.customerId, // 客户id
                p3: name, // 标签名称
                p4: formatDate(new Date(this.trackEventStartTime), 'yyyy-MM-dd HH:mm:ss'), // 触发hover的时间
                p5: __duration, // 停留时长
            };

            this.$BossAnalytics.track('crm-customer-icon-hover', {
                ...options,
            });
        },
    }
};