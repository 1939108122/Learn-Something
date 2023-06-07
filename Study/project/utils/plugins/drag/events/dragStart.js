import dragMove from './dragMove';
import dragEnd from './dragEnd';

import getTransformValue from '../utils/getTransformValue';
import moveElementTransform from '../utils/moveElementTransform';
import returnPositionString from '../utils/returnPositionString';
import updateMousePosition from '../utils/updateMousePosition';

export default function (grabElement, moveElement, e) {

    // Store elements
    window.dragConfigData.grab = grabElement;
    window.dragConfigData.move = moveElement;

    // Store current mouse or touch position
    window.dragConfigData.initialX = e.pageX;
    window.dragConfigData.initialY = e.pageY;

    // Reset relative coordinates
    window.dragConfigData.relativeX = 0;
    window.dragConfigData.relativeY = 0;

    // Get transform string of the move element
    const matrix = window.getComputedStyle(window.dragConfigData.move).transform;

    // Store matrix value
    if (matrix === 'none') {
        window.dragConfigData.matrix = false;
    } else {
        window.dragConfigData.matrix = matrix.match(/\d([^,]*,){4}/g);
    };

    const left = getTransformValue(matrix, 'left');
    const top = getTransformValue(matrix, 'top');

    // Replace left and top properties with transform
    moveElementTransform(returnPositionString(window.dragConfigData.matrix, left, top), 0, 0);


    window.dragConfigData.matrixX = left;
    window.dragConfigData.matrixY = top;
    
    // Apply CSS class to grab element
    window.dragConfigData.grab.classList.add(window.dragConfigData.class.down);

    // 添加监听回调
    document.addEventListener('mouseup', dragEnd);

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mousemove', dragMove);

};