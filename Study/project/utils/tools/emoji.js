/**
 * 系统表情相关
 */

const list = [
    '微笑',
    '撇嘴',
    '色',
    '发呆',
    '得意',
    '流泪|大哭',
    '害羞',
    '闭嘴|不说话',
    '叹气',
    '睡觉|睡',
    '尴尬',
    '发怒',
    '调皮',
    '呲牙',
    '惊讶',
    '难过',
    '酷',
    '冷汗',
    '抓狂',
    '吐',
    '偷笑',
    '愉快',
    '白眼',
    '傲慢',
    '饥饿',
    '困',
    '惊恐',
    '流汗',
    '憨笑',
    '悠闲',
    '奋斗',
    '咒骂',
    '疑问',
    '嘘',
    '晕',
    '疯了',
    '衰',
    '骷髅',
    '敲打',
    '再见',
    '擦汗',
    '抠鼻',
    '鼓掌',
    '糗大了',
    '坏笑',
    '左哼哼',
    '右哼哼',
    '哈欠',
    '鄙视',
    '委屈',
    '快哭了',
    '阴险',
    '亲亲',
    '吓',
    '可怜',
    '开心',
    '满意',
    '不高兴',
    '生病',
    '笑哭',
    '皱眉',
    '幽灵',
    '恶魔',
    '高兴',
    '菜刀',
    '西瓜',
    '啤酒',
    '篮球',
    '乒乓',
    '咖啡',
    '饭',
    '面条',
    '猪头',
    '玫瑰',
    '凋谢',
    '嘴唇',
    '爱心',
    '心碎',
    '蛋糕',
    '闪电',
    '炸弹',
    '刀',
    '足球',
    '瓢虫',
    '便便',
    '月亮',
    '太阳',
    '礼物',
    '拥抱',
    '强',
    '弱',
    '握手',
    '胜利',
    '抱拳',
    '勾引',
    '拳头',
    '差劲',
    '爱你',
    'NO',
    'OK',
];

const srcUrl = i => {
    return `https://static.zhipin.com/library/emotions/3x/Expression_${i +
        1}@3x.png`;
};

export const emojisReg = [];
export const emojiMap = {};

export const emojis = list.map((item, index) => {
    const keys = item.split('|');
    let itemObj;
    keys.forEach(key => {
        const obj = {
            title: key,
            key: `[${key}]`,
            src: srcUrl(index),
        };

        emojiMap[key] = obj;
        emojiMap[`[${key}]`] = obj;
        emojisReg.push(`\\[${key}\\]`);

        if (!itemObj) {
            itemObj = obj;
        }
    });

    return itemObj;
});

/**
 * 正则匹配表情符号转成成img
 */
export const emojisRegExp = res => {
    const str = emojisReg.join('|');
    let regEmoji = new RegExp(str, 'ig');
    let result = res.replace(regEmoji, function (r) {
        let tempPath = emojiMap[r];
        const img = emojisToImg(tempPath.src, tempPath.key);
        return img.outerHTML;
    });

    return result;
};

/**
 * 将表情转换成img标签
 */
export function emojisToImg (src, key) {
    const img = new Image();
    img.src = src;
    img.setAttribute('data-key', key);
    img.setAttribute('draggable', false);
    img.className = 'emoj-insert';
    img.setAttribute('title', key.replace('[', '').replace(']', ''));
    return img;
}

export const converToMessage = function (fragment) {
    const enmotion = function () {
        let group = [];
        let wrap = document.createElement('div');
        wrap.innerHTML = fragment.replace(/\\/g, '###h###');

        const enmojis = wrap.querySelectorAll('.emoj-insert');
        const imgs = wrap.querySelectorAll('.send-img');
        const divs = wrap.querySelectorAll('div');

        let j = enmojis.length;
        let k = divs.length;
        let m = imgs.length;

        while (m--) {
            const key = imgs[m].getAttribute('title');
            const textNode = document.createTextNode(`<img src="${key}" alt="a" >`);
            imgs[m].parentNode.insertBefore(textNode, imgs[m]);
            imgs[m].parentNode.removeChild(imgs[m]);
        }

        while (j--) {
            const key = enmojis[j].getAttribute('title');
            const textNode = document.createTextNode(`[${key}]`);
            enmojis[j].parentNode.insertBefore(textNode, enmojis[j]);
            enmojis[j].parentNode.removeChild(enmojis[j]);
        }

        while (k--) {
            group.push(divs[k].innerHTML);
            divs[k].parentNode.removeChild(divs[k]);
        }
        group = group.reverse();
        let str = group.length ? '\n' + group.join('\n') : group.join('\n');
        return (wrap.innerHTML + str)
            .replace(/###h###/g, '&#92;')
            .replace(/<br>/g, '\n');
    };
    const html = enmotion();
    return html.replace(/&nbsp;/g, ' ').trim();
};

/**
 * 转换表情, 过滤标签
 */
export const FragmentToMessage = function (fragment) {
    let text = ('' + converToMessage(fragment)).trim();

    text = text
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        /*.replace(/&amp;/g, '&')*/;
    //     .replace(/<[^>]*>/g, "");

    return text;
};

export default {
    emojiMap,
    emojis,
    emojisReg,
    emojisRegExp,
    emojisList: list,
};
