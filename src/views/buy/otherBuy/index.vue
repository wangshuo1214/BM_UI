<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="开支项" prop="item.dealItem">
        <el-select v-model="queryParams.item.dealItem" size="small">
          <el-option
            v-for="item in otherBuyOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间" prop="item.param.dealDate">
        <el-date-picker
          v-model="queryParams.item.params.dealDate"
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

    <el-table v-loading="loading" :data="otherDealList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="dealItem" label="开支项" align="center" prop="dealItem" :show-overflow-tooltip="true" :formatter="dealItemFormat" />
      <!-- <el-table-column key="dealDate" label="交易时间" align="center" prop="dealDate" :show-overflow-tooltip="true" /> -->
      <el-table-column label="交易时间" align="center" prop="dealDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dealDate,"{y}-{m}-{d}") }}</span>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="开支项" prop="dealItem">
              <el-select v-model="form.dealItem" style="width: 280px;">
                <el-option
                  v-for="item in otherBuyOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="交易日期" prop="dealDate">
              <el-date-picker
                v-model="form.dealDate"
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
            <el-form-item label="金额" prop="money">
              <el-input
                v-model="form.money"
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
              <el-input v-model="form.remark" :rows="2" maxlength="500" type="textarea" placeholder="请输入备注" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { listOtherDeal, addOtherDeal, updateOtherDeal, delOtherDeal, getOtherDeal } from '@/api/otherDeal'
import { getOtherDealItemByType } from '@/api/otherDealItem'

export default {
  name: 'OtherBuy',
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '',
      // 多选框
      ids: [],
      // 表单
      form: {
        type: '1'
      },
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
          dealItem: undefined,
          type: '1',
          params: {
            dealDate: undefined
          }
        }
      },
      // 表单校验
      rules: {
        dealItem: [
          { required: true, message: '支出项不能为空', trigger: 'blur' }
        ],
        dealDate: [
          { required: true, message: '交易日期不能为空', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '金额不能为空', trigger: 'blur' },
          { min: 1, max: 7, message: '金额必须介于 0 和 100000 之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getOtherDealItemByType()
  },
  methods: {
    // 初始化其他交易类型
    getOtherDealItemByType(){
      getOtherDealItemByType('1').then(response => {
        this.otherBuyOptions = response.data
      })
      this.getList()
    },
    /** 查询其他交易列表 */
    getList() {
      this.loading = true
      listOtherDeal(this.queryParams).then(response => {
        this.otherDealList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.item.dealItem = undefined
      this.queryParams.item.params.dealDate = undefined
      this.handleQuery()
    },
    // 客户名称翻译
    dealItemFormat(row, column) {
      const dealItemObj = this.otherBuyOptions.find((item) => item.id + '' === row.dealItem + '')
      return dealItemObj.name
    },
    // 表单重置
    reset() {
      this.form = {
        dealItem: undefined,
        dealDate: undefined,
        money: undefined,
        remark: undefined,
        type: '1'
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加其他开支'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateOtherDeal(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addOtherDeal(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const delIds = row.id !== undefined ? [row.id] : this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOtherDeal(delIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getOtherDeal(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改支出信息'
      })
    }
  }
}
</script>

