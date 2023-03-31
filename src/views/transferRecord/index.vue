<template>
  <div class="app-container">
    <!-- size:用于控制该表单内组件的尺寸,可选值（medium / small / mini）  inline:行内表单模式 设置为true表示在一行展示 -->
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="客户名称" prop="clientId">
        <!--clearable:是否可清空-->
        <el-select v-model="queryParams.item.clientId" placeholder="请选择客户">
          <el-option
            v-for="item in clients"
            :key="item.clientId"
            :label="item.clientName"
            :value="item.clientId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算日期">
        <el-date-picker
          v-model="queryParams.item.params.transferDate"
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
    <el-table
      v-loading="loading"
      :data="transferRecordList"
      border
    >
      <el-table-column prop="clientName" label="客户名称" />
      <el-table-column prop="transferMoney" label="转账金额" />
      <el-table-column prop="transferWay" label="转账方式" :formatter="transferWayFormat" />
      <el-table-column label="转账日期" align="center" prop="salaryDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transferDate,"{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="moreDetail(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page.pageNum"
      :limit.sync="queryParams.page.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listTransferRecord, getTransferRecord } from '@/api/transferRecord'
import { getAllClient } from '@/api/client'

export default {
  name: 'TransferRecord',
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 转账记录表格数据
      transferRecordList: [],
      // 客户下拉树
      clients: [],
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: '',
          orderFlag: ''
        },
        item: {
          clientId: undefined,
          params: {
            transferDate: undefined
          }
        }
      },
      // 总条数
      total: 0,
      // 汇款方式字典
      transferWayOptions: []
    }
  },
  created() {
    this.getList()
    this.allClient()
    this.getDicts('transfer_way').then(response => {
      this.transferWayOptions = response.data
    })
  },
  methods: {
    // 表单重置
    reset() {
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.item.params.salaryDate = undefined
      this.queryParams.item.employeeId = undefined
      this.handleQuery()
    },
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      listTransferRecord(this.queryParams).then(response => {
        this.transferRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    allClient() {
      getAllClient().then(response => {
        this.clients = response.data
      })
    },
    moreDetail(row) {
      this.reset()
      const id = row.id
      getTransferRecord(id).then(response => {
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 汇款方式字典翻译
    transferWayFormat(row, column) {
      return this.selectDictName(this.transferWayOptions, row.transferWay)
    }
  }
}
</script>

