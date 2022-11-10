<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-input
          placeholder="请输入字典名称"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入字典类型"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select placeholder="字典状态" size="small" style="width: 240px" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
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
        <el-button icon="el-icon-search" size="mini">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col>
        <el-button
          icon="el-icon-plus"
          size="mini"
        >新增</el-button>
      </el-col>
      <el-col>
        <el-button
          icon="el-icon-delete"
          size="mini"
        >删除</el-button>
      </el-col>
      <right-toolbar />
    </el-row>

    <el-table v-loading="loading" :data="typeList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编号" align="center" />
      <el-table-column label="字典名称" align="center" />
      <el-table-column label="字典类型" align="center" />
      <el-table-column label="状态" align="center" />
      <el-table-column label="备注" align="center" />
      <el-table-column label="创建时间" align="center" />
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
    <el-dialog append-to-body>
      <el-form>
        <el-form-item label="字典名称">
          <el-input placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型">
          <el-input placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" />
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
  name: 'Dict',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script >
