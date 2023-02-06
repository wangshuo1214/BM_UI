<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="订单名称" prop="item.orderName">
        <el-input
          v-model="queryParams.item.orderName"
          placeholder="请输入订单名称"
          clearable
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="交易对象" prop="item.params.dealerName">
        <el-input
          v-model="queryParams.item.params.dealerName"
          placeholder="请输入交易对象"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="订单日期">
        <el-date-picker
          v-model="queryParams.item.params.orderDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="buyRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="orderName" label="订单名称" align="center" prop="orderName" :show-overflow-tooltip="true" />
      <el-table-column key="orderDate" label="订单日期" align="center" prop="orderDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column key="dealerName" label="交易对象" align="center" prop="dealerName" :show-overflow-tooltip="true" />
      <el-table-column key="dealerMoney" label="交易金额" align="center" prop="dealerMoney" />
      <el-table-column key="orderDeatil" label="订单详情" align="center" prop="orderDeatil" :show-overflow-tooltip="true" />
      <el-table-column key="remark" label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="修改时间" align="center" prop="updateDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
import { listBuyRecord, addBuyRecord, updateBuyRecord, getBuyRecord, delBuyRecord } from '@/api/buyRecord'

export default {
  name: 'BuyRecord',
  data() {
    return {
      // 选中数组
      ids: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 遮罩层
      loading: true,
      // 采购记录表格数据
      buyRecordList: [],
      // 总条数
      total: 0,
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: 'orderDate',
          orderFlag: 'desc'
        },
        item: {
          orderName: undefined,
          params: {
            dealerName: undefined,
            orderDate: undefined
          }
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      listBuyRecord(this.queryParams).then(response => {
        this.buyRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId !== undefined ? [row.orderId] : this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBuyRecord(orderIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.orderIdId)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加采购订单'
    },
    // 表单重置
    reset() {
      this.form = {
        orderName: undefined,
        params: undefined
      }
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const orderId = row.orderId
      getBuyRecord(orderId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改采购订单'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.orderId !== undefined) {
            updateBuyRecord(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBuyRecord(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    }
  }
}
</script>
