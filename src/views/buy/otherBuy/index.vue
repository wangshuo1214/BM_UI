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

    <el-table v-loading="loading" :data="otherDealList" border>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="dealItem" label="支出项" align="center" prop="dealItem" :show-overflow-tooltip="true" />
      <!-- <el-table-column key="dealDate" label="交易时间" align="center" prop="dealDate" :show-overflow-tooltip="true" /> -->
      <el-table-column label="交易时间" align="center" prop="dealDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dealDate) }}</span>
        </template>
      </el-table-column>
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

import { listOtherDeal } from '@/api/otherDeal'

export default {
  name: 'OtherBuy',
  data() {
    return {
      // 支出项下拉框
      otherBuyOptions: [],
      // 列表数据
      otherDealList: [],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: undefined,
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
    this.getList()
    this.getDicts('other_buy').then(response => {
      this.otherBuyOptions = response.data
    })
  },
  methods: {
    /** 查询其他交易列表 */
    getList() {
      this.loading = true
      listOtherDeal(this.queryParams).then(response => {
        this.otherDealList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    }
  }
}
</script>

