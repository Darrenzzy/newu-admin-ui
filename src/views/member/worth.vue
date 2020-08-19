<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">

        <el-form ref="form" :model="form" label-width="80px">

          <el-form-item label="基金代码">
            <el-input v-model="form.code" />
          </el-form-item>
          <el-form-item label="基金名称">
            <el-input v-model="form.wond_name" />
          </el-form-item>
          <el-form-item label="单位净值">
            <el-input v-model="form.unit_worth" />
          </el-form-item>
          <el-form-item label="累计净值">
            <el-input v-model="form.net_worth" />
          </el-form-item>
          <el-form-item label="近三个月(%)">
            <el-input v-model="form.three_muoth" />
          </el-form-item>
          <el-form-item label="近六个月(%)">
            <el-input v-model="form.six_mouth" />
          </el-form-item>
          <el-form-item label="近一年(%)">
            <el-input v-model="form.last_year" />
          </el-form-item>
          <el-form-item label="今年以来(%)">
            <el-input v-model="form.now_year" />
          </el-form-item>
          <el-form-item label="成立以来(%)">
            <el-input v-model="form.build_before" />
          </el-form-item>

          <el-form-item label="上次更新时间" align="center" prop="create_at" width="80">
            <el-input :aria-placeholder="parseTime(form.create_by)" :disabled="true" />

          </el-form-item>

          <el-form-item label="即时配送">
            <el-switch v-model="form.delivery" />
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="美食/餐厅线上活动" name="type" />
              <el-checkbox label="地推活动" name="type" />
              <el-checkbox label="线下主题活动" name="type" />
              <el-checkbox label="单纯品牌曝光" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源">
            <el-radio-group v-model="form.resource">
              <el-radio label="线上品牌商赞助" />
              <el-radio label="线下场地免费" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
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
  created() {
    this.getData()
  },
  methods: {

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
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updateWorth(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getData()
              } else {
                this.msgError(response.msg)
              }
            })
            // } else {
            // addMenu(this.form).then(response => {
            //     if (response.code === 200) {
            //         this.msgSuccess('新增成功')
            //         this.open = false
            //         this.getData()
            //     } else {
            //         this.msgError(response.msg)
            //     }
            // })
          }
        }
      })
    }

  }
}
</script>
