import returnPositionString from '../utils/returnPositionString';

export function updatePosition(x, y) {

    // Store relative coordinates
    window.dragConfigData.relativeX = window.dragConfigData.mouseX * x;
    window.dragConfigData.relativeY = window.dragConfigData.mouseY * y;

    // Apply transformation to move element
    window.dragConfigData.move.style.transform = returnPositionString(
        window.dragConfigData.matrix,
        window.dragConfigData.matrixX + window.dragConfigData.relativeX,
        window.dragConfigData.matrixY + window.dragConfigData.relativeY,
    );
}

export const callPositionUpdate = {
    all() {
        updatePosition(true, true);
    }
};

export function repeatRaf() {
    callPositionUpdate.all();
    window.dragConfigData.posAnimation = requestAnimationFrame(repeatRaf);
};

export default function setUpMovement() {

    // Apply CSS class to move element
    window.dragConfigData.move.classList.add(window.dragConfigData.class.move);

    // Begin moving animation
    window.dragConfigData.posAnimation = requestAnimationFrame(repeatRaf);

    // Avoid this function to fire another time
    document.removeEventListener('mousemove', setUpMovement);
}