import Vue from 'vue';
import draggableVideo from '@/components/business/video-draggable/index.js';
import { closeAudio } from '../tools/util';
let DraggableAudio = Vue.extend(draggableVideo);

const seeVideo = (url, audioInfo) => {
    closeAudio();
    let propsData = {
            url,
            audioInfo
        };
    const instance = new DraggableAudio({
        el: document.createElement('div'),
        propsData
    });
    instance.$on('on-close', closeAudio);
    Vue.prototype.$draggableVideo = instance;
    document.body.appendChild(instance.$el);
};

export default {
    install(Vue) {
        Vue.prototype.$seeVideo = seeVideo;
    }
};
