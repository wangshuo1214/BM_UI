<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="其他交易项名称" prop="item.name">
        <el-input
          v-model="queryParams.item.name"
          placeholder="请输入其他交易项名称"
          clearable
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="其他交易项类型" prop="item.type">
        <el-select v-model="queryParams.item.type" size="small">
          <el-option
            v-for="item in otherDealItemTypeOptions"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          />
        </el-select>
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

    <el-table v-loading="loading" :data="otherDealItemList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="name" label="其他交易项名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column key="type" label="其他交易项类型" align="center" prop="type" :formatter="otherDealItemTypeFormat" />
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="其他交易项名称" prop="name" >
              <el-input v-model="form.name" placeholder="请输入其他交易项名称" maxlength="30"  class="inputHeight" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            <el-form-item label="其他交易项类型" prop="type">
              <el-select v-model="form.type" size="small" style="width: 100%;">
                <el-option
                  v-for="item in otherDealItemTypeOptions"
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
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="500" />
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
import { listOtherDealItem, addOtherDealItem, updateOtherDealItem, getOtherDealItem, delOtherDealItem } from '@/api/otherDealItem'

export default {
  name: 'OtherDealItem',
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
      // 其他交易表格数据
      otherDealItemList: [],
      // 交易项字典
      otherDealItemTypeOptions:[],
      // 总条数
      total: 0,
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: 'updateDate',
          orderFlag: 'desc'
        },
        item: {
          name: undefined,
          type: undefined
        }
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '其他交易项名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '其他交易项名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        type: [
            { required: true, message: '其他交易项类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('other_deal').then(response => {
      this.otherDealItemTypeOptions = response.data
    })
  },
  methods: {
    /** 查询员工列表 */
    getList() {
      this.loading = true
      listOtherDealItem(this.queryParams).then(response => {
        this.otherDealItemList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 客户类型字典翻译
    otherDealItemTypeFormat(row, column) {
      return this.selectDictName(this.otherDealItemTypeOptions, row.type)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idsParam = row.id !== undefined ? [row.id] : this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOtherDealItem(idsParam)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
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
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加员工'
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        type: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getOtherDealItem(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改其他交易项信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateOtherDealItem(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addOtherDealItem(this.form).then(response => {
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

<style scoped>
.inputHeight {
    height: 34px !important
}
</style>

