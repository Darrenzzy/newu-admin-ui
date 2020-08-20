<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="基金代码">
            <el-input v-model="form.code" style="width: 200px;" type="number" />
          </el-form-item>
          <el-form-item label="基金名称">
            <el-input v-model="form.wond_name" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="单位净值">
            <el-input v-model="form.unit_worth" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="累计净值">
            <el-input v-model="form.net_worth" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="近三个月(%)">
            <el-input v-model="form.three_muoth" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="近六个月(%)">
            <el-input v-model="form.six_mouth" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="近一年(%)">
            <el-input v-model="form.last_year" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="今年以来(%)">
            <el-input v-model="form.now_year" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="成立以来(%)">
            <el-input v-model="form.build_before" style="width: 200px;" />
          </el-form-item>

          <el-form-item label="上次更新时间" width="80">
            <el-input style="width: 200px;" :placeholder="formCreate_by(form.update_by)" :disabled="true" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
            <el-button type="danger" size="mini" @click="close">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-card>

    </template>
  </BasicLayout>
</template>

<script>
import { dataWorth, updateWorth } from '@/api/admin/member'
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
      }
    }
  },
  watch: {
    'create_by': function(time) {
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
    this.getData()
  },
  methods: {
    formCreate_by(d) {
      return new Date(d).toLocaleString()
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.code = parseInt(this.form.code)
          updateWorth(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('更新成功')
            } else {
              this.msgError(response.msg)
            }
          })
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
      dataWorth().then(
        response => {
          this.worth = response.data
          this.form = response.data
          this.loading = false
        }
      )
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ID)
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
      this.getData()
    }

  }
}
</script>
