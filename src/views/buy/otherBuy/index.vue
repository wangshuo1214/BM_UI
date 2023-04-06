<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="开支项" prop="item.clientName">
        <el-select v-model="queryParams.item.otherItem" size="small">
          <el-option
            v-for="item in otherBuyOptions"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间" prop="item.param.otherDate">
        <el-date-picker
          v-model="queryParams.item.params.otherDate"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table border>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="otherItem" label="支出项" align="center" prop="otherItem" :show-overflow-tooltip="true" />
      <el-table-column key="otherDate" label="交易时间" align="center" prop="otherDate" :show-overflow-tooltip="true" />
      <el-table-column key="money" label="金额" align="center" prop="money" :show-overflow-tooltip="true" />
      <el-table-column key="remark" label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'OtherBuy',
  data() {
    return {
      otherBuyOptions: [],
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: 'otherDate',
          orderFlag: 'desc'
        },
        item: {
          otherItem: undefined,
          type: '1',
          params: {
            otherDate: undefined
          }
        }
      }
    }
  },
  created() {
    this.getDicts('other_buy').then(response => {
      this.otherBuyOptions = response.data
    })
  }
}
</script>

