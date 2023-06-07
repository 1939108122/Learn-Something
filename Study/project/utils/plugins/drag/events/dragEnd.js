

import dragMove from './dragMove';

import moveElementTransform from '../utils/moveElementTransform';
import returnPositionString from '../utils/returnPositionString';
import updateMousePosition from '../utils/updateMousePosition';

export default function () {
    // Stop move animation
    cancelAnimationFrame(window.dragConfigData.posAnimation);

    // Remove setUpMovement() if mouse/touch hasn't moved
    document.removeEventListener('mousemove', dragMove);

    // Replace transform properties with left and top
    moveElementTransform(
        window.dragConfigData.matrix ? returnPositionString(window.dragConfigData.matrix, 0, 0) : 'none',
        `${window.dragConfigData.matrixX + window.dragConfigData.relativeX}px`,
        `${window.dragConfigData.matrixY + window.dragConfigData.relativeY}px`,
    );

    // Remove CSS classes
    window.dragConfigData.grab.classList.remove(window.dragConfigData.class.down);
    window.dragConfigData.move.classList.remove(window.dragConfigData.class.move);

    // Stop updating mouse position
    document.removeEventListener('mousemove', updateMousePosition);
}
