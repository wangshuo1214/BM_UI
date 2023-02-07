<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="交易对象" prop="item.params.dealerName">
        <el-input
          v-model="queryParams.item.params.dealerName"
          placeholder="请输入交易对象"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="采购日期">
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
      <el-table-column key="orderDate" label="采购日期" align="center" prop="orderDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column key="dealerName" label="交易对象" align="center" prop="dealerName" :show-overflow-tooltip="true" />
      <el-table-column key="dealerMoney" label="采购金额" align="center" prop="dealerMoney" />
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

    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="1300px" append-to-body>
      <!--采购订单-->
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="6" :gutter="24">
            <el-form-item label="供应商" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="请输入供应商名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购日期" prop="orderDate">
              <el-input v-model="form.orderDate" placeholder="采购日期" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="addRow()"
          >插入行
          </el-button>
        </el-row>
        <div>
          <el-table border :data="form.orderDetails">
            <el-table-column align="center" prop="name" label="名称">
              <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.name'" :rules="rules.name">
                  <el-input v-model="scope.row.name" size="mini" placeholder="请输入" clearable />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="num" label="数量">
              <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.num'" :rules="rules.num">
                  <el-input v-model="scope.row.num" size="mini" placeholder="请输入" clearable />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="money" label="金额">
              <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.money'" :rules="rules.money">
                  <el-input v-model="scope.row.money" size="mini" placeholder="请输入" clearable />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注">
              <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.remark'">
                  <el-input v-model="scope.row.remark" size="mini" placeholder="请输入" clearable />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
      form: {
        // 表格数据
        orderDetails: [{ name: '', num: '', money: '', remark: '' }]
      },
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
          params: {
            dealerName: undefined,
            orderDate: undefined
          }
        }
      },
      rules: {
        name: [{ required: true, message: '请输入名称！', trigger: 'blur' }],
        num: [{ required: true, message: '请输入数量！', trigger: 'blur' }],
        money: [{ required: true, message: '请输入金额！', trigger: 'blur' }]
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
        params: {
          dealerName: undefined,
          orderDate: undefined
        }
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
    },
    // 新增
    addRow() {
      this.form.list.push({
        name: '',
        num: '',
        money: '',
        remark: ''
      })
    }
  }
}
</script>
