<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:contacts:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :data="roleList"
          style="font-size: 18px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />

          <el-table-column label="姓名" prop="name" :show-overflow-tooltip="true" width="130" />
          <el-table-column label="手机号" prop="mobile" :show-overflow-tooltip="true" width="130" />

          <el-table-column label="性别" prop="sex" :show-overflow-tooltip="true" width="130" />
          <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" width="150" />

          <el-table-column label="申请时间" prop="update_by" :show-overflow-tooltip="true" width="130">
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.update_by).toLocaleDateString() }}</span>
            </template>
          </el-table-column>

          <el-table-column label="城市" prop="city" :show-overflow-tooltip="true" width="150" />

          <el-table-column label="客户列别" prop="class" :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.class === 1 ? 'success' : 'primary'"
                disable-transitions
              >{{ typeDesc(scope.row.class) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="处理状态" align="center" width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="2"
                inactiv
                e-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:contacts:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
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
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addContacts,
  dataContacts,
  delContacts,
  changeStatus,
  listContacts,
  updateContacts
} from '@/api/contacts/contacts'

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
        type: [
          {
            required: true,
            message: '请选择日期选择',
            trigger: 'change'
          }
        ],
        amount: [
          {
            type: 'number'
          }
        ],
        other_amount: [
          {
            type: 'number'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.statusOptions = [
      {
        label: '买入usdt',
        value: 1
      },
      {
        label: '卖出usdt',
        value: 2
      }
    ]
  },
  methods: {
    typeDesc(row) {
      if (row === 2) {
        return '机构'
      }
      return '个人'
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listContacts(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.roleList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },

    // 状态修改
    handleStatusChange(row) {
      const text = row.status === 1 ? '未处理' : '已处理'
      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return changeStatus(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.status = row.status === 1 ? 1 : 2
        })
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
        // ID: undefined,
        // amount: 0,
        // other_amount: 0,
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
      this.ids = selection.map((item) => item.ID)
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
      dataContacts(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改数据'
        this.isEdit = true
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updateContacts(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addContacts(this.form).then((response) => {
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
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delContacts(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {}
  }
}
</script>
