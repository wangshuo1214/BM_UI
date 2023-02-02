<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="商品名称" prop="item.materialName">
        <el-input
          v-model="queryParams.item.materialName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="商品类型" prop="item.materialType">
        <el-select v-model="queryParams.item.materialType" size="small">
          <el-option
            v-for="item in materialTypeOptions"
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

    <el-table v-loading="loading" :data="materialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="materialName" label="商品名称" align="center" prop="materialName" :show-overflow-tooltip="true" />
      <el-table-column key="materialType" label="商品类型" align="center" prop="materialType" :formatter="materialTypeFormat" />
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="materialName">
              <el-input v-model="form.materialName" placeholder="请输入商品名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品类型" prop="materialType">
              <el-select v-model="form.materialType" size="small">
                <el-option
                  v-for="item in materialTypeOptions"
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
import { listMaterial, addMaterial, updateMaterial, getMaterial, delMaterial } from '@/api/material'

export default {
  name: 'Material',
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
      // 商品表格数据
      materialList: [],
      // 商品类型列表
      materialTypeOptions: [],
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
          materialName: undefined,
          phone: undefined,
          address: undefined
        }
      },
      // 表单校验
      rules: {
        materialName: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '商品名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        materialType: [
          { required: true, message: '商品类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('material_type').then(response => {
      this.materialTypeOptions = response.data
    })
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true
      listMaterial(this.queryParams).then(response => {
        this.materialList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const materialIds = row.materialId !== undefined ? [row.materialId] : this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMaterial(materialIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    // 客户类型字典翻译
    materialTypeFormat(row, column) {
      return this.selectDictName(this.materialTypeOptions, row.materialType)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.materialId)
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
      this.title = '添加商品'
    },
    // 表单重置
    reset() {
      this.form = {
        materialName: undefined,
        phone: undefined,
        address: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const materialId = row.materialId
      getMaterial(materialId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改商品信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.materialId !== undefined) {
            updateMaterial(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMaterial(this.form).then(response => {
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

