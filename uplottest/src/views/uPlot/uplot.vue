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
                chartOptions: [],
                color:  [
                    '#3685FF', '#00DCA2', '#00BFD0', '#954Eff',
                    '#FFCB01', '#f65A96', '#FF9094', '#00CCF5',
                    '#FF8BEA', '#4D7693', '#72577C', '#99D750',
                    '#DD8270', '#C475EE', '#7E83FB', '#7EB090',
                    '#CF6684', '#4E55FF', '#FF8D00', '#FF5200'
                ]
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
                function tooltipPlugin(opts) {
                    let over, bound, bLeft, bTop;

                    function syncBounds() {
                        let bbox = over.getBoundingClientRect();
                        bLeft = bbox.left;
                        bTop = bbox.top;
                    }

                    const overlay = document.createElement("div");
                    overlay.id = "overlay";
                    overlay.style.display = "none";
                    overlay.style.position = "absolute";
                    document.body.appendChild(overlay);

                    return {
                        hooks: {
                            init: u => {
                                over = u.over;

                                bound = over;
                                //	bound = document.body;

                                over.onmouseenter = () => {
                                    overlay.style.display = "block";
                                };

                                over.onmouseleave = () => {
                                    overlay.style.display = "none";
                                };
                            },
                            setSize: u => {
                                syncBounds();
                            },
                            setCursor: u => {
                                const { left, top, idx } = u.cursor;
                                const x = u.data[0][idx];
                                const y = u.data[1][idx];
                                const anchor = { left: left + bLeft, top: top + bTop };
                                overlay.textContent = `${x},${y} at ${Math.round(left)},${Math.round(top)}`;
                                console.log(x,y)
                                // placement(overlay, anchor, "right", "start", { bound });
                            }
                        }
                    };
                }
                this.$nextTick(()=>{
                    this.startGraphTime=new Date().getTime();
                    let height = 475;
                    let width = 300;
                    let opts = {
                        title: "uplotTest",
                        width,
                        height,
                        plugins: [
                            tooltipPlugin(),
                        ],
                        legend: {
                            live: false,
                            mode: 'toggle-one',
                            isolate: true
                        },
                        series: [
                            {}, // 时间轴 暂不知有哪些参数
                            // {
                            //     label: "Low",
                            //     stroke: "red",
                            //     fill: "rgba(255, 0, 0, .2)",
                            // },
                        ],
                        axes: [  // 分别 X LY RY
                            {
                                // values: (u, vals, space) => { //
                                //     console.log(vals)
                                //     return vals
                                // },
                            },
                            {
                                scale: "%",
                                values: (u, vals, space) => vals.map(v => +v.toFixed(1) + "%"),
                            },
                            {
                                side: 1,
                                scale: "mb",
                                size: 60,
                                values: (u, vals, space) => vals.map(v => +v.toFixed(2) + " MB"),
                                grid: {show: false},
                            },
                        ],
                    };
                    if (this.textarea) {
                        console.log(JSON.parse(this.textarea))
                        opts = {
                            ...opts,
                            ...JSON.parse(this.textarea)
                        }
                    }
                    const arr = this.initData.map((item, index)=>{
                        const obj= {
                            // ...tempSeries,
                            label: item.key,
                            // dataX: item.value.map(value => value[0] / 1000),
                            // dataY: item.value.map(value => value[1]),
                            stroke: this.color[index] || 'red'
                        }
                        return obj
                    })
                    opts.series.push(...arr)
                    let data = []
                    let time = this.initData[0].value.map(item=> item[0] / 1000)
                    data.push(time)
                    this.initData.forEach(item=>{
                        data.push(item.value.map(value=> value[1]))
                    })
                    console.log(opts, data);
                    this.chart = new uplot(opts, data ,document.getElementById('chart'))
                    let $temp=this;
                    this.endGraphTimeSum=0;
                    this.graphTime=0;
                    Promise.resolve().then(() => {
                        $temp.graphTime=(new Date().getTime() - $temp.startGraphTime);
                    });
                })
            },
        },
        watch :{
            showEchart(n) {
                console.log(n)
                if (!n &&this.chart) {
                    // this.chart.off('finished')
                    // this.chart.clear()
                    // this.chart.dispose()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    #chart {
        height: 400px;
        width: 1000px;
    }
</style>
