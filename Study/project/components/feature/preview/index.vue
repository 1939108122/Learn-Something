<template>
    <div class="preview-popup">
        <div class="img-show">
            <img :src="src" :width="size.width" :height="size.height" @load="successLoadImg"/>
        </div>
        <span class="ui-icon-circle-close-outline close-icon" @click.self="handleRemove"></span>
    </div>
</template>
<script>
export default {
    name: 'preview',
    props: {
        src: {
            required: true,
            type: String,
            default: ''
        }
    },
    data () {
        return {
            img: new Image(),
            size: {
                width: 0,
                height: 0
            },
            imgComplete: false
        };
    },
    mounted () {
        this.createImg();
    },
    methods: {
        createImg () {
            this.img.src = this.src;
            this.img.onload = (event) => {
                if(this.img.complete){
                    this.getWH();
                }
            };
        },
        successLoadImg (event) {
            if (event.target.complete == true) {
                if(!this.imgComplete){
                    this.getWH();
                }
            }
        },
        getWH () {
            const {innerHeight, innerWidth} = window;
            const {width, height } = this.img;
            // 宽高都小于可视区
            if(width <= innerWidth-160 && height <= innerHeight){ 
                this.size.width = width;
                this.size.height = height;
            }else if(width >= height && width > innerWidth-160) { // 长度优先
                this.size.width = innerWidth-160;
                this.size.height = '';
            }else if(height > width && height >= innerHeight) { // 高度优先
                this.size.height = innerHeight;
                this.size.width = '';
            }else {
                this.size.width = width;
                this.size.height = height;
            }


        },
        handleRemove () {
            this.$emit('close');
        }
    }
};
</script>
<style lang="less">
.preview-popup {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.8);
    .close-icon {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        &:hover {
            color: #bbb;
        }
    }
    .img-show {
        position:absolute;
        left: 50%;
        top: 50%;
        max-width: 100%;
        max-height: 100%;
        overflow: auto;
        transform: translate3d(-50%, -50%, 0);
        img {
            transition: all .5s ease-out;
        }
    }
}
</style>