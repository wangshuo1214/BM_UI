<template>
  <div class="app-container">
    <!-- size:用于控制该表单内组件的尺寸,可选值（medium / small / mini）  inline:行内表单模式 设置为true表示在一行展示 -->
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="员工名称" prop="employeeId">
        <!--clearable:是否可清空-->
        <el-select v-model="queryParams.item.employeeId" placeholder="请选择员工">
          <el-option
            v-for="item in employees"
            :key="item.employeeId"
            :label="item.employeeName"
            :value="item.employeeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算日期">
        <el-date-picker
          v-model="queryParams.item.params.salaryDate"
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
      :data="salaryRecordList"
      border
    >
      <el-table-column prop="employeeName" label="员工名称" />
      <el-table-column prop="salary" label="工资" />
      <el-table-column prop="makeRecords" label="生产详情">
        <template slot-scope="scope">
          <span> {{ formatMakeRecordDetails(scope.row.makeRecords) }} </span>
        </template>
      </el-table-column>
      <el-table-column label="结算时间" align="center" prop="salaryDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.salaryDate,"{y}-{m}-{d}") }}</span>
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

    <el-dialog v-dialogDrag :title="'工资记录详情'" :visible.sync="open" append-to-body>
      <!--采购订单-->
      <div>
        <div style="margin-bottom: 20px;">
          排序：
          <el-radio-group v-model="reverse">
            <el-radio :label="false">倒序</el-radio>
            <el-radio :label="true">正序</el-radio>
          </el-radio-group>
        </div>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in makeRecords"
            :key="index"
            :timestamp="activity.completeDate"
          >
            {{ activity.makeRecordDeatil }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSalaryRecord, getSalaryRecord } from '@/api/salaryRecord'
import { getAllEmployee } from '@/api/employee'

export default {
  name: 'SalaryRecord',
  data() {
    return {
      // 详情页排序
      reverse: false,
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 工资记录表格数据
      salaryRecordList: [],
      // 员工下拉树
      employees: [],
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
            salaryDate: undefined
          }
        }
      },
      // 总条数
      total: 0,
      // 生产记录详情 在详情页使用
      makeRecords: []
    }
  },
  created() {
    this.getList()
    this.allEmployee()
  },
  methods: {
    // 表单重置
    reset() {
      this.makeRecords = []
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.item.params.salaryDate = undefined
      this.queryParams.item.employeeId = undefined
      this.handleQuery()
    },
    /** 查询采购订单列表 */
    getList() {
      this.loading = true
      listSalaryRecord(this.queryParams).then(response => {
        this.salaryRecordList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    allEmployee() {
      getAllEmployee().then(response => {
        this.employees = response.data
      })
    },
    moreDetail(row) {
      this.reset()
      const id = row.id
      getSalaryRecord(id).then(response => {
        // debugger
        if (response.data) {
          this.makeRecords = response.data.makeRecords
          this.open = true
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    formatMakeRecordDetails(orginMakeRecord) {
      var result = ''
      if (orginMakeRecord) {
        for (var i = 0; i < orginMakeRecord.length; i++) {
          result = result + orginMakeRecord[i].makeRecordDeatil
        }
      }
      return result
    }
  }
}
</script>
