import Vue from 'vue';
import draggableAudio from '@/components/business/audio-draggable/index.js';
import { closeAudio } from '../tools/util';
let DraggableAudio = Vue.extend(draggableAudio);

const seeAudio = (url, audioInfo) => {
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
    Vue.prototype.$draggableAudio = instance;
    document.body.appendChild(instance.$el);
};

export default {
    install(Vue) {
        Vue.prototype.$seeAudio = seeAudio;
    }
};
