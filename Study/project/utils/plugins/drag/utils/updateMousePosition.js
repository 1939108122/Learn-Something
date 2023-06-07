

export default function (e) {
    window.dragConfigData.mouseX = e.pageX - window.dragConfigData.initialX;
    window.dragConfigData.mouseY = e.pageY - window.dragConfigData.initialY;
};