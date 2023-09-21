import Vue from "vue";
import Vuex from 'vuex';


Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        count: 1
    },
    mutations: { //mutations 不支持异步函数
        increment(state, count) {
            console.log(state, 'state');
            state.count = count;
        },
        sub(state) {
            state.count--;
        }
    },
    actions: {
        addSync(context, count) {
            console.log(context, 'context');
            setTimeout(() => {
                context.commit('increment', count);
            }, 1000);
        }
    },
    getters: {
        showNum(state) {
            return `我是数量${state.count}`;
        }
    }
});



export default store;