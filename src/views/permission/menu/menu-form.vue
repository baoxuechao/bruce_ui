<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog :title="!form.id ? '新增' : '修改'" :visible.sync="visible" :modal-append-to-body="false">
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="form.type" size="small">
              <el-radio-button label="0">左菜单</el-radio-button>
              <el-radio-button label="1">按钮</el-radio-button>
              <el-radio-button label="2">顶菜单</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单">
            <treeselect v-model="form.pid"
                        :options="menuOptions"
                        :normalizer="normalizer"
                        :show-count="true"
                        placeholder="选择上级菜单"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="图标" prop="icon" v-if="form.type !== '1'">
        <el-input v-model="form.icon" placeholder="请输入图标名称"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称"/>
      </el-form-item>
      <el-form-item label="路由地址" prop="path" v-if="form.type !== '1'">
        <el-input v-model="form.path" placeholder="请输入路由地址"/>
      </el-form-item>
      <el-form-item label="组件地址" prop="component" v-if="form.type !== '1'">
        <el-input v-model="form.component" placeholder="请输入组件地址,对应前端组件"/>
      </el-form-item>
      <el-form-item label="api接口" prop="uri">
        <el-input v-model="form.uri" placeholder="请输入api接口地址"/>
      </el-form-item>
      <el-form-item label="权限标识" prop="permission" v-if="form.type === '1'">
        <el-input v-model="form.permission" placeholder="请权限标识" maxlength="50"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由缓冲" prop="keepAlive" v-if="form.type !== '1'">
            <el-radio-group v-model="form.keepAlive">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单?" prop="menu" v-if="form.type === '2'">
            <el-radio-group v-model="form.menu">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
            <p style="color: red;">针对顶部菜单;"是：代码为顶部菜单用来切换左侧菜单树使用.否则：直接充当路由使用."</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getTree, addObj } from "@/api/menu"
  import Treeselect from "@riophae/vue-treeselect"
  import "@riophae/vue-treeselect/dist/vue-treeselect.css"
  export default {
    name: "Menu",
    components: { Treeselect },
    data() {
      return {
        // 菜单树选项
        menuOptions: [],
        // 是否显示弹出层
        visible: false,
        form: {
          id: null,
          name: '',
          permission: '',
          path: '',
          component: '',
          uri: '',
          pid: 0,
          icon: '',
          type: '0',
          keepAlive: '0',
          menu: '0',
          sort: 999
        },
        // 表单校验
        rules: {
          name: [
            {required: true, message: "菜单名称不能为空", trigger: "blur"}
          ],
          sort: [
            {required: true, message: "菜单顺序不能为空", trigger: "blur"}
          ],
          path: [
            {required: true, message: "路由地址不能为空", trigger: "blur"}
          ],
          keepAlive: [
            {required: true, message: "路由缓冲不能为空", trigger: "blur"}
          ],
          permission: [
            {required: true, message: "权限标识不能为空", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      // 表单提交
      init(menu) {
        if (menu!==null){
          this.form = menu
        }
        this.visible = true
        this.getTreeselect()
      },
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.form).then(res => {
              if (res.data.code===200){
                this.$message.success(res.data.message)
              } else {
                this.$message.error(res.data.message)
              }
              this.visible = false
              this.$emit('refreshDataList')
            })
          }
        })
      },
      /** 查询菜单下拉树结构 */
      getTreeselect() {
        getTree().then(response => {
          this.menuOptions = [];
          const menu = {key: 0, title: '根菜单', children: []};
          menu.children = response.data.data;
          this.menuOptions.push(menu);
        });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.key,
          label: node.title,
          children: node.children
        };
      },
      cancel() {
        this.visible = false
        this.menuOptions = []
        this.form = {id: null, name: '', permission: '', path: '', component: '', uri: '', pid: '', icon: '', type: '0', keepAlive: '0', menu: '0', sort: 999}
      }
    }
  };
</script>
<style>
  .el-form-item__content {
    line-height: 36px;
  }
</style>
