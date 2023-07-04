<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="clientName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            node-key="id"
            :data="clientOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            :default-expanded-keys="expandDefault"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="销售日期">
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
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-money"
              size="mini"
              @click="handleTransfer"
            >客户汇款</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-check"
              size="mini"
              @click="clientClearMoney"
            >清账</el-button>
          </el-col>
        </el-row>
        <el-row>
          <a style="font-size:6px; font-family: cursive; margin-left: 10px; font-size: 15px;">
            截止目前为止，<font style="color:cornflowerblue; font-size: 20px; color: red; font-weight: bold">{{ currentClientName }}</font>
            现欠款<font style="color:cornflowerblue; font-size: 20px; color: red; font-weight: bold">{{ currentDebt }}</font>元，
            总共汇款<font style="color:cornflowerblue;  font-size: 20px; color: red; font-weight: bold">{{ totalSellMoney }}</font>元。
          </a>
        </el-row>
        <el-table v-loading="loading" :data="sellRecordList" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" />
          <el-table-column key="orderDate" label="销售日期" align="center" prop="orderDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.orderDate,"{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column key="orderDeatil" label="订单详情" align="center" prop="orderDeatil" :show-overflow-tooltip="true" width="550px" />
          <el-table-column key="dealerMoney" label="销售金额" align="center" prop="dealerMoney" />
          <el-table-column label="修改时间" align="center" prop="updateDate">
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
                v-if="scope.row.clearFlag === '0'"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.clearFlag === '0'"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                v-if="scope.row.clearFlag === '1'"
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

        <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="1000px" append-to-body>
          <!--销售订单-->
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="销售日期" prop="orderDate" style="margin-bottom:0" :rules="rules.orderDate">
                  <el-date-picker
                    v-model="form.orderDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width: 180px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户" prop="currentClientName" style="margin-bottom:0">
                  <el-input
                    v-model="currentClientName"
                    placeholder="请输入内容"
                    :disabled="true"
                    size="mini"
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
                    <span>销售项</span>
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
                <el-table-column align="center" prop="num" label="数量" width="180px">
                  <template slot="header">
                    <span style="color:red">*</span>
                    <span>数量</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.num'" :rules="rules.num" :inline-message="true">
                      <el-input-number v-model="scope.row.num" size="mini" :min="1" />
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

        <el-dialog v-dialogDrag :title="title" :visible.sync="detailOpen" width="1000px" append-to-body>
          <!--销售订单-->
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="销售日期" prop="orderDate" style="margin-bottom:0" :rules="rules.orderDate">
                  <el-date-picker
                    v-model="form.orderDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width: 180px;"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户" prop="currentClientName" style="margin-bottom:0">
                  <el-input
                    v-model="currentClientName"
                    placeholder="请输入内容"
                    :disabled="true"
                    size="mini"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div>
              <el-table border :data="form.params.orderDetails" class="tableClass">
                <el-table-column align="center" prop="name" label="消费项" width="180px">
                  <template slot="header">
                    <span style="color:red">*</span>
                    <span>销售项</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.materialId'" :rules="rules.name" :inline-message="true">
                      <el-select v-model="scope.row.materialId" placeholder="请选择消费项" size="mini" :disabled="true">
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
                <el-table-column align="center" prop="num" label="数量" width="180px">
                  <template slot="header">
                    <span style="color:red">*</span>
                    <span>数量</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.num'" :rules="rules.num" :inline-message="true">
                      <el-input-number v-model="scope.row.num" size="mini" :min="1" :disabled="true" />
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
                        :disabled="true"
                      >
                        <span slot="suffix">/ 元 </span>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="remark" label="备注">
                  <template slot-scope="scope">
                    <el-form-item class="myClass" :prop="'params.orderDetails.' + scope.$index + '.remark'">
                      <el-input v-model="scope.row.remark" :rows="2" maxlength="500" type="textarea" placeholder="请输入备注" clearable :disabled="true" />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="detailCancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog v-dialogDrag :title="transferTitle" :visible.sync="transferOpen" width="400px" append-to-body>
          <el-form ref="transferForm" :model="transferForm" :rules="transferRules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="客户" prop="currentClientName">
                  <el-input v-model="currentClientName" placeholder="请输入用户名称" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="汇款日期" prop="transferDate">
                  <el-date-picker
                    v-model="transferForm.transferDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width: 280px;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="汇款方式" prop="transferWay">
                  <el-select v-model="transferForm.transferWay" style="width: 280px;">
                    <el-option
                      v-for="item in transferOptions"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="汇款金额" prop="transferMoney">
                  <el-input
                    v-model="transferForm.transferMoney"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  >
                    <span slot="suffix">/ 元 </span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="transferForm.remark" :rows="2" maxlength="500" type="textarea" placeholder="请输入备注" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitTransferForm">确 定</el-button>
            <el-button @click="transferCancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { clientTreeSelect, getClient } from '@/api/client'
import { listSellRecord, updateSellRecord, addSellRecord, getSellRecord, delSellRecord, payMoney, getSellInfo, clearMoney } from '@/api/sellRecord'
import { getMaterialByType } from '@/api/material'

export default {
  name: 'SellRecord',
  data() {
    return {
      // 选中数组
      ids: [],
      clientOptions: [],
      // 销售记录表格数据
      sellRecordList: [],
      // 遮罩层
      loading: true,
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
            orderDate: undefined,
            clientId: undefined
          }
        }
      },
      // 总条数
      total: 0,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 左侧树默认选中第一个
      expandDefault: [],
      // 客户树筛选
      clientName: undefined,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 转账弹出层
      transferOpen: false,
      // 详情弹出层
      detailOpen: false,
      // 表单参数
      form: {
        orderDate: this.getCurrentDate(),
        params: {
          clientId: undefined,
          orderDetails: [{ sort: 1, materialId: '', money: '', remark: '' }]
        }
      },
      // 转账表单
      transferForm: {
        clientId: undefined,
        transferWay: undefined,
        transferMoney: undefined,
        transferDate: undefined,
        remark: undefined
      },
      rules: {
        orderDate: [{ required: true, message: '请输入订单日期！', trigger: 'blur' }],
        name: [{ required: true, message: '请选择消费项！', trigger: 'blur' }],
        num: [{ required: true, message: '请输入数量！', trigger: 'blur' }],
        money: [{ required: true, message: '请输入金额！', trigger: 'blur' }]
      },
      transferRules: {
        transferWay: [{ required: true, message: '请选择转账方式！', trigger: 'blur' }],
        transferMoney: [{ required: true, message: '请输入转账金额！', trigger: 'blur' }],
        transferDate: [{ required: true, message: '请选择转账日期！', trigger: 'blur' }]
      },
      // 商品下拉框
      materialList: [],
      // 左侧树点击的客户ID
      currentClientId: undefined,
      // 左侧树点击的客户名称
      currentClientName: undefined,
      // 汇款方式字典
      transferOptions: [],
      // 汇款表单title
      transferTitle: undefined,
      // 现欠款
      currentDebt: 0,
      // 累计汇款金额
      totalSellMoney: 0
    }
  },
  watch: {
    expandDefault(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document.querySelector('.el-tree-node__content').click()
        })
      }
    },
    // 根据名称筛选部门树
    clientName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getCLientTree()
    this.getMaterials()
    this.getDicts('transfer_way').then(response => {
      this.transferOptions = response.data
    })
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /** 查询部门下拉树结构 */
    getCLientTree() {
      clientTreeSelect().then(response => {
        this.clientOptions = response.data
        if (this.clientOptions && this.clientOptions.length > 0) {
          this.expandDefault.push(this.clientOptions[0].id)
        }else{
          this.loading = false
        }
      })
    },
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      listSellRecord(this.queryParams).then(response => {
        this.sellRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
      getSellInfo(this.currentClientId).then(response => {
        this.currentDebt = response.data.currentDebt
        this.totalSellMoney = response.data.totalSellMoney
      }
      )
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.item.params.clientId = data.id
      this.currentClientId = data.id
      this.getCurrentClientName()
      this.getList()
    },
    // 获取客户名称
    getCurrentClientName() {
      getClient(this.currentClientId).then(response => {
        this.currentClientName = response.data.clientName
      }
      )
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
    /** 获取指定格式当前日期 */
    getCurrentDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '-' + month + '-' + day
    },
    // 新增
    addRow() {
      if (this.form.params.orderDetails.length < 10) {
        this.form.params.orderDetails.push({
          sort: this.form.params.orderDetails.length === 0 ? 1 : this.form.params.orderDetails[this.form.params.orderDetails.length - 1].sort + 1,
          materialId: '',
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
          clientId: this.currentClientId,
          orderDetails: [{ sort: 1, materialId: '', num: '', money: '', remark: '' }]
        }
      }
      this.resetForm('form')
    },
    /** 客户汇款操作 */
    handleTransfer() {
      this.transferReset()
      this.transferOpen = true
      this.transferTitle = '客户汇款'
    },
    // 表单重置
    transferReset() {
      this.transferForm = {
        clientId: this.currentClientId,
        transferWay: undefined,
        transferMoney: undefined,
        transferDate: this.getCurrentDate(),
        remark: undefined
      }
      this.resetForm('transferForm')
    },
    /** 查询商品列表 */
    getMaterials() {
      getMaterialByType('0').then(response => {
        this.materialList = response.data
      }
      )
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          for (const item of this.form.params.orderDetails) {
            item.money = this.keepTwoDecimalFull(item.money)
          }
          if (this.form.orderId !== undefined) {
            updateSellRecord(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addSellRecord(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 汇款提交按钮 */
    submitTransferForm: function() {
      this.$refs['transferForm'].validate(valid => {
        if (valid) {
          this.transferForm.transferMoney = this.keepTwoDecimalFull(this.transferForm.transferMoney)
          payMoney(this.transferForm).then(response => {
            this.msgSuccess('修改成功')
            this.transferOpen = false
            this.getList()
          })
        }
      })
    },
    // 汇款取消按钮
    transferCancel() {
      this.transferOpen = false
      this.transferReset()
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
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    detailCancel() {
      this.detailOpen = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.orderId
      getSellRecord(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改销售记录'
      })
    },
    moreDetail(row) {
      this.reset()
      const id = row.orderId
      getSellRecord(id).then(response => {
        this.form = response.data
        this.detailOpen = true
        this.title = '销售记录详情'
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId !== undefined ? [row.orderId] : this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSellRecord(orderIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 删除按钮操作 */
    clientClearMoney() {
      const cId = this.currentClientId
      this.$confirm('客户还欠款' + this.currentDebt + '元，是否确认清账?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return clearMoney(cId)
      }).then(() => {
        this.getList()
        this.msgSuccess('清账成功')
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.orderId)
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
