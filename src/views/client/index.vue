<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="客户名称" prop="item.clientName">
        <el-input
          v-model="queryParams.item.clientName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="电话" prop="item.phone">
        <el-input
          v-model="queryParams.item.phone"
          placeholder="请输入电话"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="地址" prop="item.address">
        <el-input
          v-model="queryParams.item.address"
          placeholder="请输入地址"
          clearable
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="客户类型" prop="item.clientType">
        <el-select
          v-model="queryParams.item.clientType"
          placeholder="请选择客户类型"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in clientTypeOptions"
            :key="dict.dictCode"
            :label="dict.dictName"
            :value="dict.dictCode"
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

    <el-table v-loading="loading" :data="clientList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="clientName" label="客户名称" align="center" prop="clientName" :show-overflow-tooltip="true" />
      <el-table-column key="clientType" label="客户类型" align="center" prop="clientType" :formatter="clientTypeFormat" />
      <el-table-column key="phone" label="手机号" align="center" prop="phone" :show-overflow-tooltip="true" />
      <el-table-column key="address" label="地址" align="center" prop="address" :show-overflow-tooltip="true" />
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户名称" prop="clientName">
              <el-input v-model="form.clientName" placeholder="请输入客户名称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户类型" prop="clientType">
              <el-radio-group v-model="form.clientType">
                <el-radio
                  v-for="dict in clientTypeOptions"
                  :key="dict.dictCode"
                  :label="dict.dictCode"
                >{{ dict.dictName }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" maxlength="30" />
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
import { listClient, addClient, updateClient, getClient, delClient } from '@/api/client'

export default {
  name: 'Client',
  data() {
    // var checkPhone = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入绑定的手机号码'))
    //   } else if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
    //     callback(new Error('请输入正确的手机号码'))
    //   } else {
    //     callback()
    //   }
    // }
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
      // 客户表格数据
      clientList: [],
      // 客户类型字典
      clientTypeOptions: [],
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
          clientName: undefined,
          clientType: undefined,
          phone: undefined,
          address: undefined
        }
      },
      // 表单校验
      rules: {
        clientName: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '客户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('client_type').then(response => {
      this.clientTypeOptions = response.data
    })
  },
  methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true
      listClient(this.queryParams).then(response => {
        this.clientList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const clientIds = row.clientId !== undefined ? [row.clientId] : this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delClient(clientIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.clientId)
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
    // 客户类型字典翻译
    clientTypeFormat(row, column) {
      return this.selectDictName(this.clientTypeOptions, row.clientType)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加客户'
    },
    // 表单重置
    reset() {
      this.form = {
        clientName: undefined,
        clientType: '0',
        phone: undefined,
        address: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const clientId = row.clientId
      getClient(clientId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改客户信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.clientId !== undefined) {
            updateClient(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addClient(this.form).then(response => {
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
