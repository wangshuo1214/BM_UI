<template>
  <div class="app-container">
    <!-- size:用于控制该表单内组件的尺寸,可选值（medium / small / mini）  inline:行内表单模式 设置为true表示在一行展示 -->
    <el-form size="small" :inline="true">
      <el-form-item label="部门名称" prop="deptName">
        <!--clearable:是否可清空-->
        <el-input
          placeholder="请输入部门名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status" >
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option>0</el-option>
          <el-option>1</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
    <!--plain:是否朴素按钮-->
    <el-button type="primary " plain icon="el-icon-plus" size="small">新增</el-button>

    <!--tree-props:渲染嵌套数据的配置选项-->
    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" label="部门名称" width="260" />
      <el-table-column prop="orderNum" label="排序" width="200" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <!-- <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept } from '@/api/dept'

export default {
  name: 'Dept',
  dicts: [],
  components: {},
  data() {
    return {
    // 遮罩层
      loading: true,
    // 表格树数据
      deptList: [],
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 是否显示弹出层
      open: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true
      listDept(this.queryParams).then(response => {
        debugger
        this.deptList = this.handleTree(response.data, 'deptId')
        this.loading = false
      })
    }
  }
}
</script>
