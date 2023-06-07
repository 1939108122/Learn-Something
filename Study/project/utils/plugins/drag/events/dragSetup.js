
import dragStart from './dragStart';
import dragEnd from './dragEnd';

export default function (el, binding) {

    const value = binding.value; // undefined or {handle: '.exhibition'}
    const handleSelector = value instanceof Object ? value.handle : value;

    const handleArray = document.querySelectorAll(handleSelector);

    if (handleArray.length !== 0) {

        el.classList.add(window.dragConfigData.class.usesHandle);

        handleArray.forEach((grabElement) => {

            grabElement.classList.add(window.dragConfigData.class.handle);
        
            grabElement.onmousedown = e => dragStart(grabElement, el, e);
            // grabElement.ontouchstart = e => dragStart(grabElement, el, axis, e);
        });

    } else {
        el.onmousedown = e => dragStart(el, el, e);
        // el.ontouchstart = e => dragStart(el, el, axis, e);
    };

    // Apply CSS classes to the element
    el.classList.add(window.dragConfigData.class.initial);

    // 避免多个v-drag影响
    // document.addEventListener('mouseup', dragEnd);

};