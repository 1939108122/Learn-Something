<template>
    <div class="sheet-panel vue-amap-location">
        <div class="sheet-title">
            <h2>{{ title }}</h2>
        </div>
        <div class="sheet-wrapper">
            <div class="sheet-block">
                <div id="amap-location"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { loadMap, removeMap } from '@/utils/tools/loadmap.js';
export default {
    name: 'vue-amap-location',
    data () {
        return {};
    },
    props: {
        lat: {
            type: Number,
            default: '',
        },
        lng: {
            type: Number,
            default: '',
        },
        title: {
            type: String,
            default: '活动地址',
        }
    },
    mounted () {

        let vm = this;

        loadMap('mapLoaded');
        
        vm.$nextTick(() => {
            window['mapLoaded'] = function() {
                
                let id = 'amap-location';
                let lat = vm.lat;
                let lng = vm.lng;
                    
                let map = new AMap.Map(id, {
                    resizeEnable: false,
                    scrollWheel: false,
                    center: [lng, lat],
                    zoom: 15
                });
                
                var clickEventListener = map.on('click', function() {
                    map.setStatus({scrollWheel: true});
                });
                var mouseOutEventListener = map.on('mouseout', function() {
                    map.setStatus({scrollWheel: false});
                });
                
                new AMap.Marker({
                    map: map,
                    position: [lng, lat],
                    content: '<span class="map-icon"><img src="https://img.bosszhipin.com/beijin/crm/file/27eceac22aa2973fed8e209e19bacf60-82ae2d44b9b38b8bAtj6DG80DhIOlQ~~.png"/></span>'  
                });
            };   
        });

    },
    beforeDestroy() {
        // 为了走mapLoaded事件，必须得remove
        removeMap();
    }
};
</script>

<style lang="less">
.vue-amap-location {
    #amap-location {
        width: 100%;
        height: calc(~"100vh - 200px");
        .map-icon {
            display: inline-block;
            animation: play 0.4s ease infinite alternate;
            -webkit-animation: play 0.4s ease infinite alternate;
        }
        .map-icon img {
            width: 24px;
            height: 26px;
        }

        @keyframes play {
            from{transform: translateY(-5px);}
            to{transform: translateY(5px);}
        }
        @-webkit-keyframes play {
            from{-webkit-transform: translateY(-5px);}
            to{-webkit-transform: translateY(5px);}
        }
    }
}
</style>