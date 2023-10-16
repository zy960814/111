<template>
    <div>
        <div>
            显示
            <el-switch v-model="showEchart" @change="init" :active-value="true" :inactive-value="false"></el-switch>
            类型
            <el-radio-group v-model="chartType">
                <el-radio-button label="line"></el-radio-button>
                <el-radio-button label="point"></el-radio-button>
                <el-radio-button label="stack"></el-radio-button>
            </el-radio-group>
            其他option
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="textarea">
            </el-input>
        </div>
        <div class="inline-div" v-if="showEchart">
            <span>渲染速度：</span>
            <span>{{graphTime}}ms</span>
        </div>
        <div id="chart"></div>
    </div>
</template>

<script>
    import {chartTimeSeriesLineOption, chartTimeSeriesAreaOption, chartTimeSeriesScatterOption} from '../mychart/chartTimeSeries'
    import uplot from 'uplot'
    export default {
        name: "myuplot",
        data () {
            return {
                chart:'',
                graphTime: 0,
                showEchart: false,
                chartType: 'line',
                textarea: '',
                chartOptions: []
            }
        },
        mounted() {
        },
        computed : {
            initData () {
                return this.$store.getters.getinitData
            } ,
        },
        methods: {
            init () {
                if (!this.showEchart) {
                    return
                }
                this.$nextTick(()=>{
                    this.startGraphTime=new Date().getTime();

                    const opts = {
                        title: "Server Events",
                        width: 400,
                        height: 400,
                        //	ms:     1,
                        //	cursor: {
                        //		x: false,
                        //		y: false,
                        //	},
                        series: [
                            // {},
                            {
                                label: "CPU",
                                scale: "%",
                                value: (u, v) => v == null ? null : v.toFixed(1) + "%",
                                stroke: "red",
                                width: 1/devicePixelRatio,
                            },
                            // {
                            //     label: "RAM",
                            //     scale: "%",
                            //     value: (u, v) => v == null ? null : v.toFixed(1) + "%",
                            //     stroke: "blue",
                            //     width: 1/devicePixelRatio,
                            // },
                            // {
                            //     label: "TCP Out",
                            //     scale: "mb",
                            //     value: (u, v) => v == null ? null : v.toFixed(2) + " MB",
                            //     stroke: "green",
                            //     width: 1/devicePixelRatio,
                            // }
                        ]
                    };
                    this.chartOptions =  JSON.parse(JSON.stringify(chartTimeSeriesLineOption))
                    console.log(JSON.stringify(this.chartOptions))
                    if (this.textarea) {
                        console.log(JSON.parse(this.textarea))
                        this.chartOptions = {
                            ...this.chartOptions,
                            ...JSON.parse(this.textarea)
                        }
                    }
                    const tempSeries = JSON.parse(JSON.stringify(opts.series[0]))
                    // opts.series.push({})
                    opts.series = this.initData.map(item=>{
                        const obj= {
                            ...tempSeries,
                            label: item.key
                        }
                        return obj
                    })
                    const data = this.initData.map(item=>{
                        return item.value
                    })
                    this.chart = new uplot(opts, data ,document.getElementById('chart'))
                    let $temp=this;
                    this.endGraphTimeSum=0;
                    this.graphTime=0;
                    // this.chart.clear();
                    // this.chart.setOption(this.chartOptions);
                })
            },
        },
        watch :{
            showEchart(n) {
                console.log(n)
                if (!n &&this.chart) {
                    this.chart.off('finished')
                    this.chart.clear()
                    this.chart.dispose()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    #chart {
        height: 400px;
        width: 400px;
    }
</style>
