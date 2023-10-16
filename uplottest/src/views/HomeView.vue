<template>
  <div class="home">
    初始数据条数 以及 每条数据的点数 <br/>
    <input v-model="initNum" @change="change('initNum')"/>
    <input v-model="initPoint" @change="change('initPoint')"/>
    <div>
      {{initData}}
      <textarea  v-model="initDataStr"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  data () {
    return {
      initNum: 1,
      initPoint: 240,
      initData: [],
      initDataStr: ''
    }
  },
  computed: {
    getinitNum(state) {
      return this.$store.getters.getinitNum
    },
    getinitPoint(state) {
      return this.$store.getters.getinitPoint
    },
    getinitData() {
      return this.$store.getters.getinitData
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init () {
      console.log(this.getinitNum, this.getinitPoint)
      this.initNum = this.getinitNum
      this.initPoint = this.getinitPoint
      this.initData = this.getinitData
      this.change('initNum')
      console.log(this.initData)
    },
    change(key) {
      console.log(this.initNum, this.initPoint)
      this.$store.commit('setStateKey', {key: key, value: this[key]})
      const initData = this.initData = this.setData()
      this.$store.commit('setStateKey', {key:'initData', value: initData})
    },
    setData () {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ,'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U','V', 'W', 'X','Y','Z']
      const data = []
      let step=1000;//1s一个数据点
      let dateRange=this.initPoint * step;

      let curDate=new Date();
      curDate.setSeconds(curDate.getSeconds() - dateRange);
      let startTime=curDate.getTime();
      for (let i = 0; i< this.initNum; i++) {
        const obj = {
          key: arr[i],
          value: this.createLineData(this.initPoint, startTime)
        }
        data.push(obj)
      }
      return data
    },
   createLineData(dataNum, startTime){
      let step=1000;//1s一个数据点
      let data=[];
      let a,b,c,spike;

      for (let i=0;i<dataNum;i++){
        if (i % 100 === 0) {
          a = 2 * Math.random();
        }
        if (i % 1000 === 0) {
          b = 2 * Math.random();
        }
        if (i % 10000 === 0) {
          c = 2 * Math.random();
        }
        if (i % 50000 === 0) {
          spike = 10;
        } else {
          spike = 0;
        }
        data.push([startTime+i*step,2 * Math.sin(i / 100) + a + b + c + spike + Math.random()])
      }
      return data;
    }
  }
}
</script>
