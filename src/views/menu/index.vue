<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          placeholder="请输入菜单名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- gutter 用来指定每一栏之间的间隔 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
    >
      <el-table-column label="菜单名称" :show-overflow-tooltip="true" width="160" />
      <el-table-column label="图标" align="center" width="100" />
      <el-table-column prop="orderNum" label="排序" width="60" />
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
  </div>
</template>

<script>

export default {
  name: 'Menu',
  components: { },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: []
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
