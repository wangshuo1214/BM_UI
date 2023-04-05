<template>
  <div class="app-container">
    <!-- size:用于控制该表单内组件的尺寸,可选值（medium / small / mini）  inline:行内表单模式 设置为true表示在一行展示 -->
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="客户名称" prop="clientId">
        <!--clearable:是否可清空-->
        <el-select v-model="queryParams.item.clientId" placeholder="请选择客户">
          <el-option
            v-for="item in clients"
            :key="item.clientId"
            :label="item.clientName"
            :value="item.clientId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算日期">
        <el-date-picker
          v-model="queryParams.item.params.transferDate"
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="transferRecordList"
      border
    >
      <el-table-column prop="clientId" label="客户名称" :formatter="clientNameFormat" />
      <el-table-column prop="transferMoney" label="转账金额" />
      <el-table-column prop="transferWay" label="转账方式" :formatter="transferWayFormat" />
      <el-table-column label="转账日期" align="center" prop="salaryDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transferDate,"{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="moreDetail(scope.row)"
          >详情</el-button>
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
    <el-dialog v-dialogDrag :title="'汇款详情'" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户" prop="currentClientName">
              <el-input v-model="form.clientName" placeholder="请输入用户名称" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="汇款日期" prop="transferDate">
              <el-date-picker
                v-model="form.transferDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 280px;"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="汇款方式" prop="transferWay">
              <el-select v-model="form.transferWay" style="width: 280px;" :disabled="true">
                <el-option
                  v-for="item in transferWayOptions"
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
            <el-form-item label="汇款金额" prop="transferMoney">
              <el-input
                v-model="form.transferMoney"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                :disabled="true"
              >
                <span slot="suffix">/ 元 </span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" :rows="2" maxlength="500" type="textarea" placeholder="请输入备注" :disabled="true" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTransferRecord, getTransferRecord } from '@/api/transferRecord'
import { getAllClient } from '@/api/client'

export default {
  name: 'TransferRecord',
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 转账记录表格数据
      transferRecordList: [],
      // 客户下拉树
      clients: [],
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: '',
          orderFlag: ''
        },
        item: {
          clientId: undefined,
          params: {
            transferDate: undefined
          }
        }
      },
      // 总条数
      total: 0,
      // 汇款方式字典
      transferWayOptions: [],
      // 表单
      form: {}
    }
  },
  created() {
    this.getList()
    this.allClient()
    this.getDicts('transfer_way').then(response => {
      this.transferWayOptions = response.data
    })
  },
  methods: {
    // 表单重置
    reset() {
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.item.params.transferDate = undefined
      this.queryParams.item.clientId = undefined
      this.handleQuery()
    },
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      listTransferRecord(this.queryParams).then(response => {
        this.transferRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    allClient() {
      getAllClient().then(response => {
        this.clients = response.data
      })
    },
    moreDetail(row) {
      this.reset()
      const id = row.id
      getTransferRecord(id).then(response => {
        this.form = response.data
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 汇款方式字典翻译
    transferWayFormat(row, column) {
      return this.selectDictName(this.transferWayOptions, row.transferWay)
    },
    // 客户名称翻译
    clientNameFormat(row, column) {
      const clientObj = this.clients.find((item) => item.clientId + '' === row.clientId + '')
      return clientObj.clientName
    }
  }
}
</script>

