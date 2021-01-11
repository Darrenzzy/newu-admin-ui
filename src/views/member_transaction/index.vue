<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:transation:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <!--                    <el-col :span="1.5">-->
          <!--                        <el-button-->
          <!--                                v-permisaction="['system:transation:edit']"-->
          <!--                                type="success"-->
          <!--                                icon="el-icon-edit"-->
          <!--                                size="mini"-->
          <!--                                :disabled="single"-->
          <!--                                @click="handleUpdate"-->
          <!--                        >修改-->
          <!--                        </el-button>-->
          <!--                    </el-col>-->
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:transation:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="roleList" style="font-size: 18px" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="实际持有总量" prop="total" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="usdt金额" prop="amount" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="汇率" prop="rate" :show-overflow-tooltip="true" width="60" />
          <el-table-column label="cny金额" prop="other_amount" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="交易类型USDT" prop="type" :show-overflow-tooltip="true" width="130">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type === 1 ? 'danger' : 'success'" disable-transitions>{{ typeDesc(scope.row.type) }}</el-tag>
            </template>

          </el-table-column>
          <el-table-column label="交易时间" prop="create_time" width="150">
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.create_time).toLocaleDateString() }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实时手记 " prop="remark" :show-overflow-tooltip="true" width="200" />

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:transation:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['system:transation:edit']"
                size="mini"
                type="text"
                icon="el-icon-circle-check"
                @click="handleDataScope(scope.row)"
              >数据权限
              </el-button>
              <el-button
                v-permisaction="['system:transation:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
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

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="usdt金额" prop="amount">
              <el-input v-model.number="form.amount" placeholder="usdt金额" :style="{width: '50%'}" />
            </el-form-item>

            <el-form-item label="当前汇率" required prop="rate">
              <el-input v-model.number="form.rate" placeholder="当前汇率" :style="{width: '50%'}" />
            </el-form-item>
            <el-form-item label="cny金额" prop="other_amount">
              <el-input v-model.number="form.other_amount" placeholder="cny金额" :style="{width: '50%'}" />
            </el-form-item>

            <el-form-item label="交易类型" required prop="type">

              <el-radio-group v-model="form.type" placeholder="交易类型">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="交易时间" prop="create_time">
              <el-date-picker v-model="form.create_time" format="yyyy-MM-dd" type="date" :style="{width: '50%'}" placeholder="请选择日期选择" clearable />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :style="{width: '50%'}" />
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

import { addMemberTransaction, dataMemberTransaction, delMemberTransaction, listMemberTransaction, updateMemberTransaction } from '@/api/member_transaction/member_transaction'

export default {
  name: 'Role',
  components: {},
  filters: {
    // dateFormat
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      isEdit: false,
      // 日期范围
      dateRange: [],
      // // 状态数据字典
      statusOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        type: [{
          required: true,
          message: '请选择日期选择',
          trigger: 'change'
        }],
        amount: [{
          type: 'number'
        }],
        other_amount: [{
          type: 'number'

        }]

      }
    }
  },
  created() {
    this.getList()
    this.statusOptions = [{
      'label': '买入usdt',
      'value': 1
    }, {
      'label': '卖出usdt',
      'value': 2
    }]
  },
  methods: {
    typeDesc(row) {
      if (row === 2) {
        return '卖出'
      }
      return '买入'
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listMemberTransaction(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.list
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
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        ID: undefined,
        amount: 0,
        other_amount: 0
        // roleName: undefined,
        // roleKey: undefined,
        // roleSort: 0,
        // status: '0',
        // menuIds: [],
        // deptIds: [],
        // remark: undefined
      }
      this.resetForm('form')
    },
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ID)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加记录'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.ID || this.ids
      dataMemberTransaction(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改数据'
        this.isEdit = true
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updateMemberTransaction(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addMemberTransaction(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
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
      const ids = row.ID || this.ids
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMemberTransaction(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {

    }
  }
}
</script>
