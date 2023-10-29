var count = 3;

function addCount() {
    count++;
}

module.exports = {
    get count() {
        return count;
    },
    addCount: addCount
}