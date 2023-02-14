<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--员工数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            placeholder="请输入员工名称"
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
            :data="employeeOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :inline="true" label-width="68px">
          <el-form-item label="完成日期">
            <el-date-picker
              v-model="queryParams.item.params.completeDate"
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
              @click="handleAdd"
            >新增</el-button>
          </el-col>
        </el-row>

        <el-table border>
          <el-table-column type="selection" align="center" />
          <el-table-column key="completeDate" label="完成日期" align="center" prop="completeDate" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.completeDate,"{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column key="makeRecordDeatil" label="生产记录详情" align="center" prop="makeRecordDeatil" :show-overflow-tooltip="true" />
          <el-table-column key="totalWage" label="总工费" align="center" prop="totalWage" :show-overflow-tooltip="true" />
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
                icon="el-icon-delete"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
              >重置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="1000px" append-to-body>
      <!--采购订单-->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="完成日期" prop="completeDate" style="margin-bottom:0" :rules="rules.completeDate">
              <el-date-picker
                v-model="form.completeDate"
                size="mini"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工名称" prop="completeDate" style="margin-bottom:0" :rules="rules.completeDate">
              <el-select v-model="form.employeeId" disabled placeholder="请选择" size="mini">
                <el-option
                  v-for="item in allEmployeeOptions"
                  :key="item.employeeId"
                  :label="item.employeeName"
                  :value="item.employeeId"
                />
              </el-select>
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
          <el-table border :data="form.params.bmMakeRecordDetails" class="tableClass">
            <el-table-column align="center" prop="name" width="65px" label="操作">
              <template slot-scope="scope">
                <i style="color: red; cursor: pointer;" class="el-icon-delete" @click="delRow(scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="materialId" label="生产项" width="180px">
              <template slot="header">
                <span style="color:red">*</span>
                <span>生产项</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="myClass" :prop="'params.bmMakeRecordDetails.' + scope.$index + '.materialId'" :rules="rules.materialId" :inline-message="true">
                  <el-select v-model="scope.row.materialId" placeholder="请选择生产项" size="mini">
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
                <el-form-item class="myClass" :prop="'params.bmMakeRecordDetails.' + scope.$index + '.num'" :rules="rules.num" :inline-message="true">
                  <el-input-number v-model="scope.row.num" size="mini" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="wage" label="工费" width="180px">
              <template slot="header">
                <span style="color:red">*</span>
                <span>工费</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="myClass" :prop="'params.bmMakeRecordDetails.' + scope.$index + '.wage'" :rules="rules.wage" :inline-message="true">
                  <el-input
                    v-model="scope.row.wage"
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
                <el-form-item class="myClass" :prop="'params.bmMakeRecordDetails.' + scope.$index + '.remark'">
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
import { listMakeRecord, addMakeRecord, updateMakeRecord, getMakeRecord, delMakeRecord, payWage } from '@/api/makeRecord'
import { getMaterialByType } from '@/api/material'
import { employeeTreeSelect, getAllEmployee } from '@/api/employee'

export default {
  name: 'MakeRecord',
  data() {
    return {
    // 员工树选项
      employeeOptions: undefined,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 采购记录表格数据
      makeRecordList: [],
      // 商品下拉框
      materialList: [],
      // 员工下拉框
      allEmployeeOptions: [],
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: '',
          orderFlag: ''
        },
        item: {
          employeeId: undefined,
          params: {
            completeDate: undefined
          }
        }
      },
      // 总条数
      total: 0,
      // 表单参数
      form: {
        employeeId: undefined,
        completeDate: this.getCurrentDate(),
        params: {
          bmMakeRecordDetails: [{ sort: 1, materialId: '', num: '', wage: '', remark: '' }]
        }
      },
      rules: {
        completeDate: [{ required: true, message: '请输入完成日期！', trigger: 'blur' }],
        materialId: [{ required: true, message: '请选择消费项！', trigger: 'blur' }],
        num: [{ required: true, message: '请输入生产数量！', trigger: 'blur' }],
        wage: [{ required: true, message: '请输入工费！', trigger: 'blur' }]
      },

      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getEmployeeTree()
    this.getMaterials()
    this.getEmployeeList()
  },
  methods: {
    /** 查询员工下拉树结构 */
    getEmployeeTree() {
      employeeTreeSelect().then(response => {
        this.employeeOptions = response.data
        this.getList()
      })
    },
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      this.queryParams.item.employeeId = this.queryParams.item.employeeId ? this.queryParams.item.employeeId : this.employeeOptions[0].id
      listMakeRecord(this.queryParams).then(response => {
        this.makeRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    getEmployeeList() {
      getAllEmployee().then(response => {
        this.allEmployeeOptions = response.data.rows
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.item.employeeId = data.id
      this.getList()
    },
    // 新增
    addRow() {
      if (this.form.params.bmMakeRecordDetails.length < 10) {
        this.form.params.bmMakeRecordDetails.push({
          sort: this.form.params.bmMakeRecordDetails.length === 0 ? 1 : this.form.params.bmMakeRecordDetails[this.form.params.bmMakeRecordDetails.length - 1].sort + 1,
          materialId: '',
          num: '',
          wage: '',
          remark: ''
        })
      } else {
        this.$message({
          type: 'error ',
          message: '最多可添加10条数据！'
        })
      }
    },
    // 表单重置
    reset() {
      this.form = {
        completeDate: this.getCurrentDate(),
        params: {
          bmMakeRecordDetails: [{ sort: 1, materialId: '', num: '', wage: '', remark: '' }]
        }
      }
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加生产记录'
      this.form.employeeId = this.queryParams.item.employeeId
    },
    /** 查询商品列表 */
    getMaterials() {
      getMaterialByType('2').then(response => {
        this.materialList = response.data
      }
      )
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          for (const item of this.form.params.bmMakeRecordDetails) {
            item.wage = this.keepTwoDecimalFull(item.wage)
          }
          if (this.form.id !== undefined) {
            updateMakeRecord(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMakeRecord(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 获取指定格式当前日期 */
    getCurrentDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '-' + month + '-' + day
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
