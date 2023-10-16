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
    import {chartTimeSeriesLineOption, chartTimeSeriesAreaOption, chartTimeSeriesScatterOption} from './chartTimeSeries'
    import * as echarts from 'echarts'
    export default {
        name: "mychart",
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
                    this.chart = echarts.init(document.getElementById('chart'));
                    let $temp=this;
                    this.chart.on('finished',function(){
                        $temp.graphTime=(new Date().getTime() - $temp.startGraphTime);
                    })
                    this.endGraphTimeSum=0;
                    this.graphTime=0;
                    this.chart.clear();
                    this.chartOptions =  JSON.parse(JSON.stringify(chartTimeSeriesLineOption))
                    console.log(JSON.stringify(this.chartOptions))
                    if (this.textarea) {
                        console.log(JSON.parse(this.textarea))
                        this.chartOptions = {
                            ...this.chartOptions,
                            ...JSON.parse(this.textarea)
                        }
                    }
                    console.log(this.initData)
                    this.chartOptions.series = this.initData.map(item=>{
                        const obj= {
                            ...this.chartOptions.series[0],
                            name: item.key,
                            data: item.value
                        }
                        console.log(obj)
                        return obj
                    })
                    console.log(this.chartOptions)
                    this.chart.setOption(this.chartOptions);
                })
            },
        },
        watch :{
            showEchart(n) {
                console.log(n)
                if (!n &&this.chart) {
                    console.log(this.chart)
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
