
// 输入文本光标位置
export function EditableCaret ($inputor) {
    this.$inputor = $inputor;
    this.domInputor = this.$inputor[0];
}

EditableCaret.prototype.getOffset = function () {
    var clonedRange, offset, range, rect, shadowCaret;
    if (window.getSelection && (range = this.range())) {
        if (range.endOffset - 1 > 0 && range.endContainer !== this.domInputor) {
            clonedRange = range.cloneRange();
            clonedRange.setStart(range.endContainer, range.endOffset - 1);
            clonedRange.setEnd(range.endContainer, range.endOffset);
            rect = clonedRange.getBoundingClientRect();
            offset = {
                height: rect.height,
                left: rect.left + rect.width,
                top: rect.top,
            };
            clonedRange.detach();
        }
        if (!offset || (offset != null ? offset.height : void 0) === 0) {
            clonedRange = range.cloneRange();
            shadowCaret = document.createTextNode("|");
            clonedRange.insertNode(shadowCaret);
            clonedRange.selectNode(shadowCaret);
            rect = clonedRange.getBoundingClientRect();
            offset = {
                height: rect.height,
                left: rect.left,
                top: rect.top,
            };
            shadowCaret.remove();
            clonedRange.detach();
        }
    } else if (document.selection) {
        offset = this.getOldIEOffset();
    }
    if (offset) {
        offset.top += window.pageYOffset || document.documentElement.scrollTop;
        offset.left += window.pageXOffset || document.documentElement.scrollLeft;
    }
    return offset;
};

EditableCaret.prototype.getOldIEOffset = function () {
    var range, rect;
    range = document.selection.createRange().duplicate();
    range.moveStart("character", -1);
    rect = range.getBoundingClientRect();
    return {
        height: rect.bottom - rect.top,
        left: rect.left,
        top: rect.top,
    };
};

EditableCaret.prototype.range = function () {
    if (!window.getSelection) {
        return;
    }

    let sel = window.getSelection();
    if (sel.rangeCount > 0) {
        return sel.getRangeAt(0);
    } else {
        return null;
    }
};
/**
 * 输入框插入表情
 */
export function insertFaceToHtml (src, key) {
    // const img = emojisToImg(src, key);
    const iptEl = document.querySelector(".chat-input");

    if ("getSelection" in window) {
        var sel = window.getSelection();
        if (sel && sel.rangeCount === 1) {
            //有选区，且选区数量是一个
            iptEl.focus();
            const range = sel.getRangeAt(0);
            //如果先失焦，再点击表情，强制将光标移动到最后,写法还不对后面再看

            var img = new Image();
            img.src = src;
            img.setAttribute("data-key", key);
            img.className = "emoj-insert";
            img.setAttribute("title", key.replace("[", "").replace("]", ""));
            range.deleteContents(); //删除选中的内容，当然如果没有选中，只是光标的话就什么也不会删除
            range.insertNode(img);
            range.collapse(false); //对于IE来说，参数不可省略
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if ("selection" in document) {
        iptEl.focus();
        const range = document.selection.createRange();
        range.pasteHTML(
            '<img class="emoj-insert" data-key="' +
            key +
            '" title="' +
            key.replace("[", "").replace("]", "") +
            '" src="' +
            src +
            '">'
        );
        iptEl.focus(); //IE 11模拟的IE5~IE8无须这一步也能获得焦点
    }
}

/**
 * 输入框插入html
 */
export function insertHtml (el, $html = "") {
    let iptEl = document.querySelector(".chat-input");
    const $el = el || iptEl;
    $el.focus();

    if (window.getSelection && window.getSelection().getRangeAt) {
        const sel = window.getSelection();
        let range = sel.getRangeAt(0);
        range.deleteContents();
        const el = document.createElement("div");
        el.innerHTML = $html;

        const frag = document.createDocumentFragment();
        let node;
        let lastNode;

        while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
        }

        // insertNode在range的开始位置插入一个节点
        range.insertNode(frag);
        // 收尾
        if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            sel.selectAllChildren($el); //sel选择el下所有子内容
            sel.collapseToEnd(); //光标移至最后
        }
    } else if (document.selection && document.selection.createRange) {
        const range = document.selection.createRange();
        range.pasteHTML($html);
    }

    $el.focus();
}

export function copyText (e) {
    let text = null;
    let textRange;
    if (window.clipboardData && window.clipboardData.setData) {
        text = window.clipboardData.getData("text");
    } else {
        text = (e.originalEvent || e).clipboardData.getData("text/plain");
    }

    if (document.body.createTextRange) {
        if (document.selection) {
            textRange = document.selection.createRange();
        } else if (window.getSelection) {
            const sel = window.getSelection();
            const range = sel.getRangeAt(0);
            // 创建临时元素，使得TextRange可以移动到正确的位置
            const tempEl = document.createElement("span");
            tempEl.innerHTML = "&#FEFF;";
            range.deleteContents();
            range.insertNode(tempEl);
            textRange = document.body.createTextRange();
            textRange.moveToElementText(tempEl);
            tempEl.parentNode.removeChild(tempEl);
        }
        textRange.text = text;
        textRange.collapse(false);
        textRange.select();
    } else {
        // Chrome之类浏览器
        document.execCommand("insertText", false, text);
    }
} 