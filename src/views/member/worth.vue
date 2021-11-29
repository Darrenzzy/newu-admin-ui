<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:worth:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:worth:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="worthList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="基金名称" prop="wond_name" width="120" />
          <el-table-column label="首页显示权重" prop="sortby" width="120" />
          <el-table-column label="净值日期" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.date_worth | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位净值" prop="unit_worth" width="120" />
          <el-table-column label="累计净值" prop="net_worth" width="120" />
          <el-table-column label="成立以来(%)" prop="build_before" width="120" />
          <el-table-column label="今年以来(%)" prop="now_year" width="120" />
          <el-table-column label="近1年(%)" prop="last_year" width="120" />
          <el-table-column label="近2年(%)" prop="three_muoth" width="120" />
          <el-table-column label="近3年(%)" prop="six_mouth" width="120" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:worth:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-permisaction="['system:worth:remove']"
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
        <el-dialog :title="title" :visible.sync="open" width="800px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="基金名称">
              <el-input v-model="form.wond_name" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="净值日期">
              <el-date-picker
                v-model="form.date_worth"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期选择"
                clearable
              />
            </el-form-item>

            <el-form-item label="单位净值">
              <el-input v-model="form.unit_worth" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="累计净值">
              <el-input v-model="form.net_worth" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="成立以来(%)">
              <el-input v-model="form.build_before" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="今年以来(%)">
              <el-input v-model="form.now_year" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="近1年(%)">
              <el-input v-model="form.last_year" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="近2年(%)">
              <el-input v-model="form.three_muoth" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="近3年(%)">
              <el-input v-model="form.six_mouth" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="是否为精选" prop="is_limit">
              <el-radio-group v-model="form.is_limit" size="medium">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="最低认购金">
              <el-input v-model="form.min_buy" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="管理费">
              <el-input v-model="form.manage_fee" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="产品开放日">
              <el-input v-model="form.open_day" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="基金经理">
              <el-input v-model="form.manage_name" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="业绩报酬">
              <el-input v-model="form.results_reward" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="首页显示顺序">
              <el-input v-model.number="form.sortby" style="width: 200px;" />
            </el-form-item>

            <el-form-item label="简介">
              <el-input v-model="form.intro" type="textarea" style="width: 200px;" :autosize="{minRows: 5, maxRows: 5}" />
            </el-form-item>

            <el-form-item label="上次更新时间" width="80">
              <el-input
                style="width: 200px;"
                :placeholder="formCreate_by(form.update_by)"
                :disabled="true"
              />
            </el-form-item>
            <div class="button-style">
              <el-form-item>
                <el-button type="primary" size="mini" @click="submit">保存</el-button>
                <el-button type="danger" size="mini" @click="close">关闭</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addWorth,
  dataWorth,
  delWorth,
  listWorth,
  updateWorth
} from '@/api/admin/member'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Worth',
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
      worth: [],
      worthList: [],
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
      statusOptions: [{
        key: '1',
        label: '是'
      }, {
        key: '0',
        label: '否'
      }],
      // 表单参数
      form: {
        field101: 333
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单校验
      rules: {
        is_limit: [{
          required: true,
          message: '单选框组不能为空',
          trigger: 'change'
        }],
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    create_by: function(time) {
      this.create_by = 123
      const values = (time || '').split(':')
      if (values.length >= 2) {
        const hours = parseInt(values[0], 10)
        const minutes = parseInt(values[1], 10)

        return {
          hours,
          minutes
        }
      }
      /* istanbul ignore next */
      return null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formCreate_by(d) {
      return new Date(d).toLocaleString()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      dataWorth(row.id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改记录'
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加记录'
      this.isEdit = false
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            // this.form.code = parseInt(this.form.code)
            updateWorth(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('更新成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addWorth(this.form).then((response) => {
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

    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/index' })
    },
    /** 查询会员列表 */
    getData() {
      this.loading = true
      dataWorth().then((response) => {
        this.worth = response.data
        this.form = response.data
        this.loading = false
      })
    },
    getList() {
      this.loading = true
      listWorth(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.worthList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
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
        code: ''
      }
      this.resetForm('form')
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delWorth(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getData()
    }
  }
}
</script>
<style lang="scss">
  @import './index.scss';
</style>
