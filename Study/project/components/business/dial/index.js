import Vue from 'vue';
import Dial from './dial.vue';

Dial.createInstance = propsData => {

    const Instance = new Vue({
        render (h) {
            return h(Dial, {
                props: propsData || {},
            });
        },
    });
    
    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const dial = Instance.$children[0]; //实例

    return {
        $content: dial,
        show (data={type: '', callParams: ''}) {
            dial.updateDial(data);
        },
        destroy () {
            dial && dial.$destroy();
            document.body.removeChild(component.$el);
        },
        closeCallingPop () {
            dial.closeCallingPop();
        },
    };
};

export default Dial;
