<template>
    <div class="ga-chart-line">
        <div :id="`ga-chart-line-${roleId}`" v-if="source.length > 0"></div>
        <data-blank v-else no-data></data-blank>
    </div>
</template>

<script>
export default {
    name: 'chart-line',
    props: {
        // 数据源
        source: {
            type: Array,
            default: () => ([])
        },
        roleId: String,
        // 高度
        height: {
            type: [String, Number],
            default: 260
        },
        // 坐标配置
        coord: {
            type: Object,
            default: () => ({
                x: 'x',
                y: 'y',
                z: 'z'
            })
        },
        // 显示范围
        yRange: {
            type: Array,
            default: () => ([])
        },
        // 格式化纵坐标显示
        yFormatter: Function,
        // 格式化横坐标显示
        xFormatter: Function,
        // 格式化label显示
        labelFormatter: {
            type: Function,
            default: (val) => val
        },
        // 是否展示纵/横坐标
        showY:{
            type: Boolean,
            default: true
        },
        showX:{
            type: Boolean,
            default: true
        },
        showLabel: Boolean
    },
    data () {
        return {
            chart: null
        };
    },
    mounted () {
        this.drawChart(this.source);
    },
    methods: {
        drawChart (data) {
            if(this.source.length === 0) return;
            const {x, y, z} = this.coord;
            this.chart = new G2.Chart({
                container: `ga-chart-line-${this.roleId}`,
                forceFit: true, // 图表的宽度自适应开关, 设置为 true 时表示自动取 dom（实例容器）的宽度。
                height: this.height
            });
            // 计算最大值， 最小值
            const mapArr = [...this.source].sort((a, b) => b[y]*1 - a[y]*1);
            const max = this.yRange[1] || mapArr[0][y];
            const min = this.yRange[0] || mapArr[mapArr.length - 1][y];

            // 设置数据源
            this.chart.source(data);
            // 设置提示
            this.chart.tooltip({
                crosshairs: {
                    type:'cross' // rect, cross(十字)，x, y|line
                }
            });
            // 设置纵坐标展示方案
            this.chart.axis(x, this.showX === false ? false : {
                label: {
                    formatter: this.xFormatter
                }
            });
            // 设置纵坐标展示方案
            this.chart.axis(y, this.showY === false ? false : {
                label: {
                    formatter: this.yFormatter
                }
            });

            this.chart.scale(y, {
                min: min,
                max: max
            });
            // position('属性x*属性y'), 属性x会映射到X轴, 属性2会映射到Y轴;也可以用['x', 'y']
            this.chart.line().position([x, y]).color(z);
            this.chart.point().position([x, y]).size(4)
                .label([x, y], (x, y) => {
                    return this.showLabel ? this.labelFormatter(y) : '';
                }).shape('circle');
            this.chart.render();
        }
    }
};
</script>

<style lang="less">
.ga-chart-line {
}
</style>