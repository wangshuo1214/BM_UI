<template>
  <div class="layout">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" style="margin-left: 15px;margin-top: 10px;margin-right: 15px;" class="box-card">
          <div>
            <el-statistic title="今日利润" style="width: 25%; float: left;">
              <template slot="formatter"> {{ daySell - dayCost }} </template>
            </el-statistic>
            <el-statistic title="本月利润" style="width: 25%; float: left;">
              <template slot="formatter"> {{ monthSell - monthCost }} </template>
            </el-statistic>
            <el-statistic title="本年利润" style="width: 25%; float: left;">
              <template slot="formatter"> {{ yearSell - yearCost }} </template>
            </el-statistic>
            <el-statistic title="累计利润" style="width: 25%; float: left;">
              <template slot="formatter"> {{ totalSell - totalCost }} </template>
            </el-statistic>
          </div>
        </el-card>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-left: 15px;margin-top: 10px;margin-bottom: 10px;margin-right: 10px;">
          <div>
            <span class="spanTitle">
              今日收入
              <el-tooltip content="今日客户转账以及其他销售的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </span>
          </div>
          <div class="text item">
            {{ '￥ ' + daySell }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-top: 10px;margin-bottom: 10px;">
          <div>
            <span class="spanTitle">
              本月收入
              <el-tooltip content="本月客户转账以及其他销售的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </span>
          </div>
          <div class="text item">
            {{ '￥ ' + monthSell }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-left: 10px;margin-top: 10px;margin-bottom: 10px;margin-right: 10px;">
          <div>
            <span class="spanTitle">
              本年收入
              <el-tooltip content="本年客户转账以及其他销售的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </span>
          </div>
          <div class="text item">
            {{ '￥ ' + yearSell }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-top: 10px;margin-bottom: 10px;margin-right: 15px;">
          <div>
            <span class="spanTitle">
              累计收入
              <el-tooltip content="所有客户转账以及其他销售的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip></span>
          </div>
          <div class="text item">
            {{ '￥ ' + totalSell }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-left: 15px;margin-bottom: 10px;margin-right: 10px;">
          <div>
            <span class="spanTitle">
              今日支出
              <el-tooltip content="本日采购以及其他采购的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip></span>
          </div>
          <div class="text item">
            {{ '￥ ' + dayCost }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-bottom: 10px;">
          <div>
            <span class="spanTitle">
              本月支出
              <el-tooltip content="本月采购以及其他采购的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip></span>
          </div>
          <div class="text item">
            {{ '￥ ' + monthCost }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-left: 10px;margin-bottom: 10px;;margin-right: 10px;">
          <div>
            <span class="spanTitle">
              本年支出
              <el-tooltip content="本年采购以及其他采购的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip></span>
          </div>
          <div class="text item">
            {{ '￥ ' + yearCost }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="box-card" style="margin-bottom: 10px;margin-right: 15px;">
          <div>
            <span class="spanTitle">
              累计支出
              <el-tooltip content="所有采购以及其他采购的和" placement="top" style="float: right;">
                <i class="el-icon-warning-outline" />
              </el-tooltip></span>
          </div>
          <div class="text item">
            {{ '￥ ' + totalCost }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="margin-top: 25px;">
        <div>
          <div ref="sellChart" style="height:400px" />
        </div>
      </el-col>
      <el-col :span="12" style="margin-top: 25px;">
        <div>
          <div ref="costChart" style="height:400px" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHomePage } from '@/api/homePage'

export default {
  name: 'Home',
  data() {
    return {
      dayCost: 0,
      monthCost: 0,
      yearCost: 0,
      totalCost: 0,
      sevenDayCost: [],
      sevenDayCostX: [],
      twelveMonthCost: [],
      twelveMonthCostX: [],
      dataCostX: [],
      dataCostY: [],
      costFlag: false,
      daySell: 0,
      monthSell: 0,
      yearSell: 0,
      totalSell: 0,
      sevenDaySell: [],
      sevenDaySellX: [],
      twelveMonthSell: [],
      twelveMonthSellX: [],
      dataSellX: [],
      dataSellY: [],
      sellFlag: false
    }
  },
  watch: {
    dataCostX() {
      this.$nextTick(() => {
        this.costLine()
      })
    },
    dataSellX(){
      this.$nextTick(() => {
        this.sellLine()
      })
    }
  },
  created() {
    this.getHomePage()
  },
  // mounted() {
  //   this.sellLine()
  //   this.costLine()
  // },
  methods: {
    getHomePage() {
      getHomePage().then(response => {
        this.dayCost = response.data.dayCost
        this.monthCost = response.data.monthCost
        this.yearCost = response.data.yearCost
        this.totalCost = response.data.totalCost
        const cost7Keys = Object.keys(response.data.sevenDayCost).sort();
        for (var i = 0; i < cost7Keys.length; i++) {
          this.sevenDayCost.push(response.data.sevenDayCost[cost7Keys[i]])
          this.sevenDayCostX.push(cost7Keys[i])
        }
        this.dataCostX = this.sevenDayCostX
        this.dataCostY = this.sevenDayCost
        const cost12Keys = Object.keys(response.data.twelveMonthCost).sort();
        for (var i = 0; i < cost12Keys.length; i++) {
          this.twelveMonthCost.push(response.data.twelveMonthCost[cost12Keys[i]])
          this.twelveMonthCostX.push(cost12Keys[i])
        }
        this.daySell = response.data.daySell
        this.monthSell = response.data.monthSell
        this.yearSell = response.data.yearSell
        this.totalSell = response.data.totalSell
        const sell7Keys = Object.keys(response.data.sevenDaySell).sort();
        for (var i = 0; i < sell7Keys.length; i++) {
          this.sevenDaySell.push(response.data.sevenDaySell[sell7Keys[i]])
          this.sevenDaySellX.push(sell7Keys[i])
        }
        this.dataSellX = this.sevenDaySellX
        this.dataSellY = this.sevenDaySell
        const sell12Keys = Object.keys(response.data.twelveMonthSell).sort();
        for (var i = 0; i < sell12Keys.length; i++) {
          this.twelveMonthSell.push(response.data.twelveMonthSell[sell12Keys[i]])
          this.twelveMonthSellX.push(sell12Keys[i])
        }
      })
    },
    sellLine() {
      var myChart = this.$echarts.init(this.$refs.sellChart)
      // 绘制图表
      myChart.setOption({
        legend: {
          icon: 'stack',
          data: ['近7天', '近12月'],
          selectedMode: 'single', // 单选
          selected: {
            近7天: !this.sellFlag,
            近12月: this.sellFlag
          }
        },
        tooltip: {},
        xAxis: {
          data: this.dataSellX
        },
        yAxis: {
          name: '销售'
        },
        series: [{
          name: '近7天',
          type: 'line',
          data: this.dataSellY
        },
        {
          name: '近12月',
          type: 'line',
          data: this.dataSellY
        }
        ]
      })
      myChart.on('legendselectchanged', obj => {
        if (obj.name === '近7天') {
          this.sellFlag = false
          this.dataSellX = this.sevenDaySellX
          this.dataSellY = this.sevenDaySell
        } else {
          this.sellFlag = true
          this.dataSellX = this.twelveMonthSellX
          this.dataSellY = this.twelveMonthSell
        }
      })
    },
    costLine() {
      var myChart = this.$echarts.init(this.$refs.costChart)
      myChart.setOption({
        legend: {
          icon: 'stack',
          data: ['近7天', '近12月'],
          selectedMode: 'single', // 单选
          selected: {
            近7天: !this.costFlag,
            近12月: this.costFlag
          }
        },
        tooltip: {},
        xAxis: {
          data: this.dataCostX
        },
        yAxis: {
          name: '支出'
        },
        series: [{
          name: '近7天',
          type: 'line',
          data: this.dataCostY
        },
        {
          name: '近12月',
          type: 'line',
          data: this.dataCostY
        }
        ]
      })
      myChart.on('legendselectchanged', obj => {
        if (obj.name === '近7天') {
          this.costFlag = false
          this.dataCostX = this.sevenDayCostX
          this.dataCostY = this.sevenDayCost
        } else {
          this.costFlag = true
          this.dataCostX = this.twelveMonthCostX
          this.dataCostY = this.twelveMonthCost
        }
      })
    }
  }

}
</script>

<style>
  .spanTitle{
    color: rgba(0,0,0,.45);
    font-size: 15px;
    line-height: 22px;
    /* font-weight:bold; */
  }
  .text {
    font-size: 28px;
    width: 70%;
    margin-left: 40%;
    line-height: 32px;
    /* font-weight:bold; */
    color: rgba(0,0,0,.85)
  }

  .item {
    margin-bottom: 18px;
  }
  .box-card{
    height: 100px;
    /* opacity: 90%; */
  /* background-image: linear-gradient(to bottom right, #f2f6fc, #f5f7fa); */
  }
</style>
