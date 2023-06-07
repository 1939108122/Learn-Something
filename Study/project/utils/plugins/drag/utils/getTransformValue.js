

export default function (str, dir) {
    
    
    let pos = Number(window.getComputedStyle(window.dragConfigData.move)[dir].replace('px', ''));

    if (str !== 'none') {
        const itemsArray = str.match(/[0-9.-]+/g); // ['1', '0', '0', '1', '10', '0']
        
        // Get matrix translate value, based on the x + y = 8 equation
        pos += Number(itemsArray[8 - dir.length]);
    }

    return pos;
};