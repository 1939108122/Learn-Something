import Vue from 'vue';
import CallinDial from './index.vue';

CallinDial.createInstance = propsData => {

    const Instance = new Vue({
        render (h) {
            return h(CallinDial, {
                props: propsData || {},
            });
        },
    });
    
    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const dial = Instance.$children[0]; //实例

    return {
        $content: dial,
        show (callParams) {
            dial.showDial(callParams);
        },
        destroy () {
            dial.destroyDial();
        },
        closeCallingPop () {
            dial.closeCallingPop();
        },
    };
};

export default CallinDial;
