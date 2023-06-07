import DragSetup from './events/dragSetup';
import dragEnd from './events/dragEnd';

export default {
    install(Vue, options) {

        // 基础配置参数
        window.dragConfigData = {
            class: {
                initial: 'drag-draggable', // 默认给盒子添加的类
                usesHandle: 'drag-uses-handle', // 添加了handle的盒子 类
                handle: 'drag-handle', //默认给handle元素添加的类
                down: 'drag-down',
                move: 'drag-move'
            }
        };

        // 添加一些基础样式
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `.${window.dragConfigData.class.initial}{position:relative;transition:none;}.${window.dragConfigData.class.initial}:not(.${window.dragConfigData.class.usesHandle}),.${window.dragConfigData.class.handle}{cursor:move;cursor:grab;cursor:-webkit-grab;cursor:-moz-grab;}.${window.dragConfigData.class.handle}.${window.dragConfigData.class.down},.${window.dragConfigData.class.initial}:not(.${window.dragConfigData.class.usesHandle}).${window.dragConfigData.class.down}{z-index:999;cursor:grabbing;cursor:-webkit-grabbing;cursor:-moz-grabbing;}`;
        document.body.appendChild(styleElement);

        // 注册全局指令
        Vue.directive('drag', {
            inserted (el, binding) {

                // init elements
                window.dragConfigData.grab = el;
                window.dragConfigData.move = el;

                document.removeEventListener('mouseup', dragEnd);

                DragSetup(el, binding);
            },
            update (el, binding) {

                el.onmousedown = null;
                el.ontouchstart = null;

                const handle = typeof binding.oldValue === 'object' ? binding.oldValue.handle : binding.oldValue;
                const oldHandleArray = document.querySelectorAll(handle);

                if(oldHandleArray.length !== 0) {
                    oldHandleArray.forEach((oldHandle) => {
                        // Remove events from the old handle
                        oldHandle.onmousedown = null;
                        oldHandle.ontouchstart = null;
                
                        // Remove CSS classes related to the old handle
                        oldHandle.classList.remove(window.dragConfigData.class.handle);
                        el.classList.remove(window.dragConfigData.class.usesHandle);
    
                        // Add draggable configuration to element
                        DragSetup(el, binding);
                    });
                } else {
                    DragSetup(el, binding);
                };
            },
            unbind () {
                // console.log('unbind');
            },
        });
    },
};