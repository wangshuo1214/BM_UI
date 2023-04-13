<template>
  <div class="layout">
    <el-row>
      <el-col :span="8">
        <el-card shadow="hover" class="box-card" style="margin-left: 15px;margin-top: 10px;margin-bottom: 10px;margin-right: 10px;">
          <div>
            <span class="spanTitle">今日销售</span>
          </div>
          <div v-for="o in 1" :key="o" class="text item">
            {{ '元 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="box-card" style="margin-top: 10px;margin-bottom: 10px;">
          <div>
            <span class="spanTitle">本月销售</span>
          </div>
          <div v-for="o in 1" :key="o" class="text item">
            {{ '元 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="box-card" style="margin-left: 10px;margin-top: 10px;margin-bottom: 10px;margin-right: 15px;">
          <div>
            <span class="spanTitle">本年销售</span>
          </div>
          <div v-for="o in 1" :key="o" class="text item">
            {{ '元 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-card shadow="hover" class="box-card" style="margin-left: 15px;margin-bottom: 10px;margin-right: 10px;">
          <div>
            <span class="spanTitle">今日支出</span>
          </div>
          <div v-for="o in 1" :key="o" class="text item">
            {{ '元 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="box-card" style="margin-bottom: 10px;">
          <div>
            <span class="spanTitle">本月支出</span>
          </div>
          <div v-for="o in 1" :key="o" class="text item">
            {{ '元 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="box-card" style="margin-left: 10px;margin-bottom: 10px;;margin-right: 15px;">
          <div>
            <span class="spanTitle">本年支出</span>
          </div>
          <div v-for="o in 1" :key="o" class="text item">
            {{ '元 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Home'
}
</script>

<style>
  .spanTitle{
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
</style>
