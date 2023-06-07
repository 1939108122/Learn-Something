import Vue from 'vue';
import instanceIndex from './index.vue';
import store from '@/store/index';

let instance = null;
let seatConstructor = Vue.extend(instanceIndex);

let Seat = params => {

    Seat.hide();

    // cc未关联
    if(!store.state.message.seats.length) {
        Vue.prototype.$toast({
            type: 'error',
            content: '无可用座席号，请联系城市运营关联座席号',
        });
        return false;
    };

    let propsData = Object.prototype.toString.call(params) === '[object Object]' ? params : {};
    instance = new seatConstructor({
        el: document.createElement('div'),
        propsData,
    });
    document.body.appendChild(instance.$el);
};

Seat.hide = () => {
    if (instance) {
        instance.$destroy();
        document.body.removeChild(instance.$el);
        instance = null;
    };
};

window.addEventListener('hashchange', Seat.hide, false);
window.addEventListener('popstate', Seat.hide, false);

Seat.install = function(Vue) {
    Vue.prototype.$Seat = Seat;
};

export default Seat;