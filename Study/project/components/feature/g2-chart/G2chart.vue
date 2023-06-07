<template>
<section class="_g2-chart-contain">
    <div :id="id" class="G2chart" ref="chartbox">
        <!--加载中-->
        
    </div>
    <div class="data-tips" v-if="isLoading || !chartDataStr.length">
        <div class="spinner _blank-spinner"><span><i class="icon-toast-loading"></i>{{blankTxt}}</span></div>
    </div>
</section>
</template>

<script>
export default {
    name: 'G2chart',
    data() {
        return {
            chart: null,
            isLoading: false,
            chartDataStr: []
        };
    },
    props: {
        chartData: {
            type: Array,
            default: () => {
                return {
                    data: []
                };
            }
        },
        xName: {
            type: String,
            default: 'x'
        },
        yName: {
            type: String,
            default: 'y'
        },
        config: Object,
        id: String,
        blankTxt: {
            type: String,
            default: '正在加载中'
        }
    },
    mounted() {
        this.chartDataStr = this.chartData;
    },
    // 监听API接口传过来的数据  2018-08-21更新
    watch: {
        immediate: true,
        chartData() {
            this.chartDataStr = this.chartData;
        },
        chartDataStr() {    // 监听chartData，当放生变化时，触发这个回调函数绘制图表
            if (this.chartDataStr) {
                this.drawChart();
            }
        }
    },
    methods: {
        drawChart: function () {
            this.isloading = false;
            this.$refs.chartbox.innerHTML = '';
            let options = {};
            let base = this.config.base || {};
            Object.assign(options, {
                container: this.id
            }, this.config.options);
            this.chart = new G2.Chart(options);
            if (this.chart) {
                this.chart.clear();
            }
            this.chart.source(this.chartData, base);
            this.interval();
            this.chart.render();
        },
        interval: function () {// 默认，柱状图
            if(this.config.interval) {
                this.config.interval(this.chart);
            } else {
                this.chart.interval().position(this.xName + '*' + this.yName);
            }
        },
    }
};
</script>

<style scoped lang="less">
    /* .G2chart {
        height: 300px;
    }

    .G2chart {
        height: 300px;
        overflow: hidden;
    } */

    .G2chart .data-tips {
        min-height: 300px;
        padding-top: 0;
    }
    ._g2-chart-contain{
        position: relative;
        .data-tips{
            top: 0;
            left: 0;
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }
    ._blank-spinner{
        width: auto !important;
        height: auto !important;
    }
</style>

