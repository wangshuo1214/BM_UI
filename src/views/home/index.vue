<template>
  <div class="layout">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" style="margin-left: 15px;margin-top: 10px;margin-right: 15px;" class="box-card">
          <div>
            <el-statistic title="今日利润" style="width: 25%; float: left;">
              <template slot="formatter"> 456/2 </template>
            </el-statistic>
            <el-statistic title="本月利润" style="width: 25%; float: left;">
              <template slot="formatter"> 456/2 </template>
            </el-statistic>
            <el-statistic title="本年利润" style="width: 25%; float: left;">
              <template slot="formatter"> 456/2 </template>
            </el-statistic>
            <el-statistic title="累计利润" style="width: 25%; float: left;">
              <template slot="formatter"> 456/2 </template>
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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
          <div v-for="o in 1" :key="o" class="text item">
            {{ '￥ ' + o }}
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

export default {
  name: 'Home',
  mounted() {
    this.sellLine()
    this.costLine()
  },
  methods: {
    sellLine() {
      var myChart = this.$echarts.init(this.$refs.sellChart)
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {
          name: '收入'
        },
        series: [{
          name: '收入',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },
    costLine() {
      var myChart = this.$echarts.init(this.$refs.costChart)
      // 绘制图表
      myChart.setOption({
        legend: {
          icon: 'stack',
          data: ['近7天', '本年'],
          selectedMode: 'single', // 单选
          selected: {
            近7天: true,
            本年: false
          }
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {
          name: '支出'
        },
        series: [{
          name: '近7天',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        },
        {
          name: '本年',
          type: 'line',
          data: [5, 999, 77, 50, 30, 70]
        }
        ]
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
    width: 50%;
    margin-left: auto;
    line-height: 32px;
    /* font-weight:bold; */
    color: rgba(0,0,0,.85)
  }

  .item {
    margin-bottom: 18px;
  }
  .box-card{
    height: 100px;
    opacity: 90%;
  /* background-image: linear-gradient(to bottom right, #f2f6fc, #f5f7fa); */
  }
</style>
