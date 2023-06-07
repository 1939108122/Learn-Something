import scrollView from './scroll-view';
import scrollItem from './scroll-item';

scrollView.install = function install(Vue) {
    Vue.component(scrollView.name, scrollView);
};

scrollItem.install = function install(Vue) {
    Vue.component(scrollItem.name, scrollItem);
};

export const ScrollView = scrollView;
export const ScrollItem = scrollItem;