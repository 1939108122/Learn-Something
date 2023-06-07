const checkEnum = {
    check: 1,
    uncheck: 0,
    half: 2,
};
const joinTypeEnum = {
    start: 1,
    end: -1,
    center: 0,
};
const showEnum = {
    unshow: 0,
    closeShow: 1,
    show: 2,
};

// 深度优先遍历
function flattenTreeData(treeData) {
    const flatNodes = [];
    const dig = treeData =>
        treeData.forEach(treeNode => {
            flatNodes.push(treeNode);
            dig(treeNode.subLevelModelList || []);
        });

    dig(treeData);
    return flatNodes;
}

let ff = (number) => {
    let floats = Number.parseFloat(number);

    if (floats.toString().indexOf('.') != -1) {
        let round = floats.toString().split('.')[0].length;
        return Number(floats.toFixed(17 - round > 0 ? 17 - round : 2));
    }

    return Number(floats);
};

export { checkEnum, joinTypeEnum, showEnum, flattenTreeData, ff };
