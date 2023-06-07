<template>
    <div class="gpt-content" ref="gptContent"></div>
</template>
<script>
export default {
    name: 'GptTyping',
    data () {
        return {
            timer: null,
            scrollTimer: null,
            previous: null,
        };
    },
    computed: {
        typeHtml () {
            return `<ul>${this.getGptContentStr()}</ul>`;
        },
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    beforeDestroy() {
        this.timer && clearTimeout(this.timer) && (this.timer = null);
        this.scrollTimer && clearTimeout(this.scrollTimer) && (this.scrollTimer = null);
    },
    methods: {
        getGptContentStr () {
            let str = '';
            this.list.forEach(item => {
                str += `<li class="gpt-content-item"><div class="gpt-content-item-title">${item.query}</div><div class="gpt-content-item-content">${item.result}</div></li>`;
            });
            return str;
        },
        typeHtmlChars (curString, curStrPos) {
            const curChar = curString.substring(curStrPos).charAt(0);
            const curChar2 = curString.substring(curStrPos).substring(0, 2);
            const curChar3 = curString.substring(curStrPos).substring(0, 3);
            const curChar4 = curString.substring(curStrPos).substring(0, 4);

            if (curChar === '<' && (curChar3 === '<ul' || curChar3 === '<li' || curChar4 === '<div' || curChar2 === '</')) {
                let endTag = '>';
                while (curString.substring(curStrPos + 1).charAt(0) !== endTag) {
                    curStrPos++;
                    if (curStrPos + 1 > curString.length) {
                        break;
                    }
                }
                curStrPos++;
            }

            return curStrPos;
        },
        typing (curString, curStrPos) {

            curStrPos = this.typeHtmlChars(curString, curStrPos);

            this.timer && clearTimeout(this.timer) && (this.timer = null);

            this.timer = setTimeout(() => {
                if (curStrPos >= curString.length) return;

                curStrPos += 1;
                const nextString = curString.substring(0, curStrPos);
                this.replaceText(nextString);
                this.typing(curString, curStrPos);
            }, 10);
            
        },
        replaceText (str) {
            if (!this.$refs.gptContent) return;
            this.$refs.gptContent.innerHTML = str;
            this.$nextTick(() => {
                this.scrollIntoView(16.7, () => {
                    try {
                        this.$refs.gptContent.scrollTop = this.$refs.gptContent.scrollHeight;
                    } catch (error) {
                        // 
                    }
                });
            });
        },
        scrollIntoView (wait, fn) {
            const now = +new Date();
            const _this = this;
            if (!this.previous) {
                this.previous = now;
            }
            clearTimeout(this.scrollTimer);
            if (now - this.previous > wait) {
                fn();
                this.previous = now;
            } else {
                this.scrollTimer = setTimeout(() => {
                    fn();
                }, wait);
            }
        },
    },
    watch: {
        typeHtml: {
            handler (str) {
                if (!str) return;
                this.$nextTick(() => {
                    this.typing(str, 0);
                });
                
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.gpt-content {
    flex: 1;
    padding-right: 20px;
    overflow: auto;
    overflow: overlay;
    cursor: default;
    &::-webkit-scrollbar {
        width: 8px;
        cursor: pointer;
    }
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-track-piece {
        display: none;
    }
    .gpt-content-item {
        padding: 0 0 16px 14px;
        line-height: 20px;
        cursor: grab;
        .gpt-content-item-title {
            position: relative;
            font-size: 12px;
            color: #555B66;
            &::before {
                content: '';
                position: absolute;
                left: -11px;
                top: 8px;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #CDD0D6;
            }
        }
        .gpt-content-item-content {
            margin-top: 2px;
            font-weight: 400;
            font-size: 13px;
            color: #1E2433;
        }
    }
}
</style>