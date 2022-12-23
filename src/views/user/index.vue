<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
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
            default-expand-all
            highlight-current
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status" />
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
            >修改</el-button>
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

        <el-table>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column key="userId" label="用户编号" align="center" prop="userId" />
          <el-table-column key="userName" label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column key="nickName" label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column key="deptName" label="部门" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
          <el-table-column key="phonenumber" label="手机号码" align="center" prop="phonenumber" width="120" />
          <el-table-column key="status" label="状态" align="center">
            <template>
              <el-switch
                active-value="0"
                inactive-value="1"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template>
              <span>{{ }}</span>
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
    <el-dialog width="600px" append-to-body>
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名" prop="nickName">
              <el-input placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect :show-count="true" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="userName">
              <el-input placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="password">
              <el-input placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group>
                <el-radio>{{}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" placeholder="请输入内容" />
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
import { deptTreeSelect } from '@/api/dept'

export default {
  name: 'User',
  components: { },
  data() {
    return {
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDeptTree()
  },
  methods: {
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        debugger
        this.deptOptions = response.data
      })
    }
  }
}
</script>
