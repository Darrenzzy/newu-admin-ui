
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="基金代码" prop="code"><el-input
            v-model="queryParams.code"
            placeholder="请输入基金代码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="基金名称" prop="wondName"><el-input
            v-model="queryParams.wondName"
            placeholder="请输入基金名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="单位净值" prop="unitWorth"><el-input
            v-model="queryParams.unitWorth"
            placeholder="请输入单位净值"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="净值" prop="netWorth"><el-input
            v-model="queryParams.netWorth"
            placeholder="请输入净值"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="近三个月(%)" prop="threeMuoth"><el-input
            v-model="queryParams.threeMuoth"
            placeholder="请输入近三个月(%)"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="近六个月(%)" prop="sixMouth"><el-input
            v-model="queryParams.sixMouth"
            placeholder="请输入近六个月(%)"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="近一年(%)" prop="lastYear"><el-input
            v-model="queryParams.lastYear"
            placeholder="请输入近一年(%)"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:netWorth:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:netWorth:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:netWorth:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="netWorthList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="基金代码"
            align="center"
            prop="code"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="基金名称"
            align="center"
            prop="wondName"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="单位净值"
            align="center"
            prop="unitWorth"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                slot="reference"
                v-permisaction="['admin:netWorth:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要删除吗?"
                confirm-button-text="删除"
                @confirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['admin:netWorth:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item v-show="false" label="" prop="id">
              <el-input v-model="form.id" placeholder="" />
            </el-form-item>
            <el-form-item label="基金代码" prop="code">
              <el-input v-model="form.code" placeholder="基金代码" />
            </el-form-item>
            <el-form-item label="基金名称" prop="wondName">
              <el-input v-model="form.wondName" placeholder="基金名称" />
            </el-form-item>
            <el-form-item label="单位净值" prop="unitWorth">
              <el-input v-model="form.unitWorth" placeholder="单位净值" />
            </el-form-item>
            <el-form-item label="净值" prop="netWorth">
              <el-input v-model="form.netWorth" placeholder="净值" />
            </el-form-item>
            <el-form-item label="近三个月(%)" prop="threeMuoth">
              <el-input v-model="form.threeMuoth" placeholder="近三个月(%)" />
            </el-form-item>
            <el-form-item label="近六个月(%)" prop="sixMouth">
              <el-input v-model="form.sixMouth" placeholder="近六个月(%)" />
            </el-form-item>
            <el-form-item label="近一年(%)" prop="lastYear">
              <el-input v-model="form.lastYear" placeholder="近一年(%)" />
            </el-form-item>
            <el-form-item label="简介" prop="intro">
              <el-input v-model="form.intro" placeholder="简介" />
            </el-form-item>
            <el-form-item label="今年以来(%)" prop="nowYear">
              <el-input v-model="form.nowYear" placeholder="今年以来(%)" />
            </el-form-item>
            <el-form-item label="成立以来(%)" prop="buildBefore">
              <el-input v-model="form.buildBefore" placeholder="成立以来(%)" />
            </el-form-item>
            <el-form-item label="是否限制" prop="isLimit">
              <el-input v-model.number="form.isLimit" placeholder="是否限制" />
            </el-form-item>
            <el-form-item label="净值日期" prop="dateWorth">
              <el-date-picker v-model="form.dateWorth" type="datetime" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="简介2" prop="intro2">
              <el-input v-model="form.intro2" placeholder="简介2" />
            </el-form-item>
            <el-form-item label="产品开放日" prop="openDay">
              <el-input v-model="form.openDay" placeholder="产品开放日" />
            </el-form-item>
            <el-form-item label="管理费" prop="manageFee">
              <el-input v-model="form.manageFee" placeholder="管理费" />
            </el-form-item>
            <el-form-item label="业绩报酬" prop="resultsReward">
              <el-input v-model="form.resultsReward" placeholder="业绩报酬" />
            </el-form-item>
            <el-form-item label="最小买入" prop="minBuy">
              <el-input v-model="form.minBuy" placeholder="最小买入" />
            </el-form-item>
            <el-form-item label="管理人" prop="manageName">
              <el-input v-model="form.manageName" placeholder="管理人" />
            </el-form-item>
            <el-form-item label="净值描述" prop="worthDesc">
              <el-input v-model="form.worthDesc" placeholder="净值描述" />
            </el-form-item>
            <el-form-item label="排序" prop="sortby">
              <el-input v-model.number="form.sortby" placeholder="排序" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addNetWorth, delNetWorth, getNetWorth, listNetWorth, updateNetWorth } from '@/api/admin/net-worth'
export default {
  name: 'NetWorth',
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      netWorthList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        code: undefined,
        wondName: undefined,
        unitWorth: undefined,
        netWorth: undefined,
        threeMuoth: undefined,
        sixMouth: undefined,
        lastYear: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { code: [{ required: true, message: '基金代码不能为空', trigger: 'blur' }],
        wondName: [{ required: true, message: '基金名称不能为空', trigger: 'blur' }],
        unitWorth: [{ required: true, message: '单位净值不能为空', trigger: 'blur' }],
        netWorth: [{ required: true, message: '净值不能为空', trigger: 'blur' }],
        threeMuoth: [{ required: true, message: '近三个月(%)不能为空', trigger: 'blur' }],
        sixMouth: [{ required: true, message: '近六个月(%)不能为空', trigger: 'blur' }],
        lastYear: [{ required: true, message: '近一年(%)不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listNetWorth(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.netWorthList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        code: undefined,
        wondName: undefined,
        unitWorth: undefined,
        netWorth: undefined,
        threeMuoth: undefined,
        sixMouth: undefined,
        lastYear: undefined,
        intro: undefined,
        nowYear: undefined,
        buildBefore: undefined,
        isLimit: undefined,
        dateWorth: undefined,
        intro2: undefined,
        openDay: undefined,
        manageFee: undefined,
        resultsReward: undefined,
        minBuy: undefined,
        manageName: undefined,
        worthDesc: undefined,
        sortby: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加NetWorth'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const ID = row.id || this.ids
      getNetWorth(ID).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改NetWorth'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateNetWorth(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addNetWorth(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delNetWorth({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    }
  }
}
</script>

