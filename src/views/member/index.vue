<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item label="会员名称">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入会员名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="手机号">
            <el-input
              v-model="queryParams.mobile"
              placeholder="请输入会员名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
          <el-button
            :loading="downloadLoading"
            style="margin:0 0 20px 20px;"
            type="primary"
            icon="el-icon-document"
            @click="handleDownload"
          >导出 Excel</el-button>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:member:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="会员名称" prop="username" width="120" />
          <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="手机号" prop="mobile" :show-overflow-tooltip="true" width="150" />

          <el-table-column label="注册时间" align="center" prop="create_at" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:member:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-permisaction="['system:member:remove']"
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

        <!-- 添加或修改会员对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="会员名称" prop="username">
                  <el-input v-model="form.username" placeholder="请输入会员名称" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email" :span="12">
                  <el-input v-model="form.email" />
                </el-form-item>

                <el-form-item label="密码" prop="password" :span="12">
                  <el-input v-model="form.password" />
                </el-form-item>

                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="form.mobile" controls-position="right" />
                </el-form-item>
              </el-col>
            </el-row>
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
import { parseTime } from '@/utils'
import {
  dataMember,
  delMember,
  listMember,
  updateMember
} from '@/api/admin/member'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Member',
  components: {},
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
      memberList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
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
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
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
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      },
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['会员名称', '邮箱', '电话', '注册时间']
        const filterVal = ['username', 'email', 'mobile', 'create_at']
        const data = this.formatJson(filterVal, this.memberList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'create_at') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },

    /** 查询会员列表 */
    getList() {
      this.loading = true
      listMember(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.memberList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.ID)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 转换会员数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.title,
        children: node.children
      }
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: 'M',
        sort: 0,
        action: this.form.menuType === 'A' ? this.form.action : '',
        isFrame: '1',
        visible: '0'
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      dataMember(row.ID).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改会员'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updateMember(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
            // } else {
            // addMenu(this.form).then(response => {
            //     if (response.code === 200) {
            //         this.msgSuccess('新增成功')
            //         this.open = false
            //         this.getList()
            //     } else {
            //         this.msgError(response.msg)
            //     }
            // })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const memberIds = row.ID || this.ids
      this.$confirm(
        '是否确认删除会员编号为"' + memberIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定1',
          cancelButtonText: '取消2',
          type: 'warning'
        }
      )
        .then(function() {
          return delMember(memberIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    }
  }
}
</script>
