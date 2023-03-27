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
    <el-row>
      <a style="font-size:5px; font-family: cursive; margin-left: 10px; font-size: 15px;">
        截止目前为止，累计开支<font style="color:cornflowerblue; font-size: 20px; color: red; font-weight: bold">{{ totalCostInfo }}</font>元，
        其中本月开支<font style="color:cornflowerblue;  font-size: 20px; color: red; font-weight: bold">{{ monthCostInfo }}</font>元、
        今日开支<font style="color:cornflowerblue;  font-size: 20px; color: red; font-weight: bold">{{ dayCostInfo }}</font>元。
      </a>
    </el-row>
    <el-table v-loading="loading" :data="buyRecordList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column key="orderDate" label="采购日期" align="center" prop="orderDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate,"{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column key="orderDeatil" label="订单详情" align="center" prop="orderDeatil" :show-overflow-tooltip="true" width="680px" />
      <el-table-column key="dealerMoney" label="采购金额" align="center" prop="dealerMoney" />
      <el-table-column label="修改时间" align="center" prop="updateDate" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
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

    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="1000px" append-to-body>
      <!--采购订单-->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="采购日期" prop="orderDate" style="margin-bottom:0" :rules="rules.orderDate">
              <el-date-picker
                v-model="form.orderDate"
                size="mini"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            style="margin-bottom: 5px; margin-top: 8px;"
            @click="addRow()"
          >插入行
          </el-button>
        </el-row>
        <div>
          <el-table border :data="form.params.orderDetails" class="tableClass">
            <el-table-column align="center" prop="name" width="65px" label="操作">
              <template slot-scope="scope">
                <i style="color: red; cursor: pointer;" class="el-icon-delete" @click="delRow(scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="消费项" width="180px">
              <template slot="header">
                <span style="color:red">*</span>
                <span>消费项</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.materialId'" :rules="rules.name" :inline-message="true">
                  <el-select v-model="scope.row.materialId" placeholder="请选择消费项" size="mini">
                    <el-option
                      v-for="item in materialList"
                      :key="item.materialId"
                      :label="item.materialName"
                      :value="item.materialId"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="dealerId" label="供应商" width="180px">
              <template slot="header">
                <span style="color:red">*</span>
                <span>供应商</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.dealerId'" :rules="rules.dealerId" :inline-message="true">
                  <el-select v-model="scope.row.dealerId" placeholder="请选择供应商" size="mini">
                    <el-option
                      v-for="item in supplierList"
                      :key="item.supplierId"
                      :label="item.supplierName"
                      :value="item.supplierId"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="money" label="金额" width="180px">
              <template slot="header">
                <span style="color:red">*</span>
                <span>金额</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.money'" :rules="rules.money" :inline-message="true">
                  <el-input
                    v-model="scope.row.money"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    size="mini"
                  >
                    <span slot="suffix">/ 元 </span>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注">
              <template slot-scope="scope">
                <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.remark'">
                  <el-input v-model="scope.row.remark" :rows="2" maxlength="500" type="textarea" placeholder="请输入备注" clearable />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBuyRecord, addBuyRecord, updateBuyRecord, getBuyRecord, delBuyRecord, getCostInfo } from '@/api/buyRecord'
import { getSuppliers } from '@/api/supplier'
import { getMaterialByType } from '@/api/material'

export default {
  name: 'BuyRecord',
  data() {
    return {
      // 选中数组
      ids: [],
      // 累计开支
      totalCostInfo: '0',
      // 本月开支
      monthCostInfo: '0',
      // 今日开支
      dayCostInfo: '0',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 累计开支
      totalCost: 0,
      // 表单参数
      form: {
        // dealerId: undefined,
        orderDate: this.getCurrentDate(),
        params: {
          orderDetails: [{ sort: 1, materialId: '', dealerId: '', money: '', remark: '' }]
        }
      },
      // 消费下拉框
      supplierList: [],
      // 商品下拉框
      materialList: [],
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
          orderByColumn: '',
          orderFlag: ''
        },
        item: {
          params: {
            dealerName: undefined,
            orderDate: undefined
          }
        }
      },
      rules: {
        orderDate: [{ required: true, message: '请输入订单日期！', trigger: 'blur' }],
        name: [{ required: true, message: '请选择消费项！', trigger: 'blur' }],
        dealerId: [{ required: true, message: '请选择消费对象！', trigger: 'blur' }],
        money: [{ required: true, message: '请输入金额！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getSupplierList()
    this.getMaterials()
  },
  methods: {
    /** 获取指定格式当前日期 */
    getCurrentDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '-' + month + '-' + day
    },
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      listBuyRecord(this.queryParams).then(response => {
        this.buyRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
      getCostInfo().then(response => {
        this.totalCostInfo = response.data.totalCostInfo
        this.monthCostInfo = response.data.monthCostInfo
        this.dayCostInfo = response.data.dayCostInfo
      }
      )
    },
    /** 查询消费对象列表 */
    getSupplierList() {
      getSuppliers().then(response => {
        this.supplierList = response.data
      }
      )
    },
    /** 查询商品列表 */
    getMaterials() {
      getMaterialByType('1').then(response => {
        this.materialList = response.data
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
      this.ids = selection.map(item => item.orderId)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.item.params.orderDate = undefined
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
        orderDate: this.getCurrentDate(),
        params: {
          orderDetails: [{ sort: 1, materialId: '', dealerId: '', money: '', remark: '' }]
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
          for (const item of this.form.params.orderDetails) {
            item.money = this.keepTwoDecimalFull(item.money)
          }
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
      if (this.form.params.orderDetails.length < 10) {
        this.form.params.orderDetails.push({
          sort: this.form.params.orderDetails.length === 0 ? 1 : this.form.params.orderDetails[this.form.params.orderDetails.length - 1].sort + 1,
          materialId: '',
          dealerId: '',
          money: '',
          remark: ''
        })
      } else {
        this.$message({
          type: 'error ',
          message: '最多可添加10条数据！'
        })
      }
    },
    // 删除
    delRow(index) {
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.params.orderDetails.splice(index, 1)
      })
    },
    keepTwoDecimalFull(num) {
      var result = parseFloat(num)
      if (isNaN(result)) {
        return ''
      }
      result = Math.round(num * 100) / 100
      var s_x = result.toString()
      var pos_decimal = s_x.indexOf('.')
      if (pos_decimal < 0) {
        pos_decimal = s_x.length
        s_x += '.'
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0'
      }
      return s_x
    }
  }
}
</script>
<style>
.myClass .el-form-item__content{
  margin-left: 0 !important;
}

tbody .cell .el-form-item {
  margin-bottom: 0 !important;
}

.tableClass th {
  padding-bottom: 5px !important;
  padding-top: 5px !important;
}
.tableClass td {
  padding-bottom: 5px !important;
  padding-top: 5px !important;
}
</style>
