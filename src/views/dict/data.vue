<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="字典类型" prop="dictType">
        <el-select size="small" />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          placeholder="请输入字典标签"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select placeholder="数据状态" clearable size="small" />
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

    <el-table v-loading="loading">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编码" align="center" prop="dictCode" />
      <el-table-column label="字典标签" align="center" prop="dictLabel" />
      <el-table-column label="字典键值" align="center" prop="dictValue" />
      <el-table-column label="字典排序" align="center" prop="dictSort" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status" />
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Data',
  data() {
    return {
      // 遮罩层
      loading: true,
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: 'orderNum',
          orderFlag: 'asc'
        },
        item: {
          dictCode: undefined,
          dictName: undefined,
          status: undefined
        }
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
