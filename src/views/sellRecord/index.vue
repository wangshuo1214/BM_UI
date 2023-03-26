<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            placeholder="请输入客户名称"
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
            :data="clientOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            :default-expanded-keys="expandDefault"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :inline="true">
          <el-form-item label="交易对象" prop="item.params.dealerName">
            <el-input
              placeholder="请输入交易对象"
              clearable
              size="small"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="交易日期">
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
        <el-table v-loading="loading" :data="sellRecordList" border>
          <el-table-column type="selection" align="center" />
          <el-table-column key="orderDate" label="销售日期" align="center" prop="orderDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.orderDate,"{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column key="orderDeatil" label="订单详情" align="center" prop="orderDeatil" :show-overflow-tooltip="true" width="580px" />
          <el-table-column key="dealerMoney" label="销售金额" align="center" prop="dealerMoney" />
          <el-table-column label="修改时间" align="center" prop="updateDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { clientTreeSelect } from '@/api/client'
import { listSellRecord } from '@/api/sellRecord'

export default {
  name: 'SellRecord',
  data() {
    return {
      clientOptions: [],
      // 销售记录表格数据
      sellRecordList: [],
      // 遮罩层
      loading: true,
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: '',
          orderFlag: ''
        },
        item: {
          params: {
            orderDate: undefined,
            clientId: undefined
          }
        }
      },
      // 总条数
      total: 0,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 左侧树默认选中第一个
      expandDefault: []
    }
  },
  watch: {
    expandDefault(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document.querySelector('.el-tree-node__children .el-tree-node__content').click()
        })
      }
    }
  },
  created() {
    this.getCLientTree()
    this.getList()
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /** 查询部门下拉树结构 */
    getCLientTree() {
      clientTreeSelect().then(response => {
        this.clientOptions = response.data
        if (this.clientOptions) {
          this.expandDefault.push(this.clientOptions[0].id)
        }
      })
    },
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      listSellRecord(this.queryParams).then(response => {
        this.sellRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.item.params.clientId = data.id
      this.getList()
    }
  }

}
</script>
