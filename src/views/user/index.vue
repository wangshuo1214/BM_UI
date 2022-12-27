<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
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
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="登录名" prop="item.userName">
            <el-input
              v-model="queryParams.item.userName"
              placeholder="请输入登录名"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="真实姓名" prop="item.realName">
            <el-input
              v-model="queryParams.item.realName"
              placeholder="请输入真实姓名"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="item.status">
            <el-select
              v-model="queryParams.item.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
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
            >删除</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="userList">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column key="userName" label="登录名" align="center" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column key="nickName" label="真实姓名" align="center" prop="realName" :show-overflow-tooltip="true" />
          <el-table-column key="deptName" label="部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
          <el-table-column key="status" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
              />
            </template>
          </el-table-column>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入登录名" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictCode"
                  :label="dict.dictCode"
                >{{ dict.dictName }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser } from '@/api/user'
import { deptTreeSelect } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'

export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 用户表格数据
      userList: null,
      // 表单参数
      form: {},
      // 部门名称
      deptName: undefined,
      // 状态数据字典
      statusOptions: [],
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: 'updateDate',
          orderFlag: 'desc'
        },
        item: {
          userName: undefined,
          realName: undefined,
          status: undefined
        }
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '登录名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    this.getDeptTree()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.queryParams).then(response => {
        this.userList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        realName: undefined,
        password: undefined,
        status: '1',
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加用户'
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
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
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.item.deptId = data.id
      this.getList()
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>
