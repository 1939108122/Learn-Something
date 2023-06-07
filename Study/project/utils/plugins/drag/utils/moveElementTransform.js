

export default function (transform, left, top) {
    window.dragConfigData.move.style.transform = transform;
    window.dragConfigData.move.style.left = left;
    window.dragConfigData.move.style.top = top;
}