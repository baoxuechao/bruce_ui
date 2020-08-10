<template>
    <basic-container>
        <div class="avue-crud">
            <el-form :inline="true">
                <el-form-item>
                  <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle">
                    添加
                  </el-button>
                </el-form-item>
              </el-form>
            <el-table :data="tableData" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" v-loading="loading" style="width: 100%;margin-bottom: 20px;" border>
                <el-table-column prop="name" label="菜单名称" width="180"/>
                <el-table-column prop="icon" label="图标" align="center" width="80">
                    <template scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center"/>
                <el-table-column prop="path" label="组件地址" align="center"/>
                <el-table-column prop="type" label="类型" align="center">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.type === '0'">左菜单</el-tag>
                        <el-tag type="success" v-if="scope.row.type === '2'">顶菜单</el-tag>
                        <el-tag type="info" v-if="scope.row.type === '1'">按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="keepAlive" label="缓冲" align="center">
                    <template slot-scope="scope">
                        <el-tag type="info" v-if="scope.row.keepAlive === '0'">关闭</el-tag>
                        <el-tag type="success" v-if="scope.row.keepAlive === '1'">开启</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="permission" label="权限标识" align="center"/>
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <el-button size="small"
                           type="text"
                           icon="el-icon-edit"
                           @click="addOrUpdateHandle(scope.row)"
                           v-if="permission.sys_menu_edit">修改
                        </el-button>
                        <el-button
                          size="small"
                          type="text"
                          icon="el-icon-delete"
                          @click="handleDelete(scope.row.id)"
                          v-if="permission.sys_menu_del">删除
                        </el-button>
                    </template>
                </el-table-column>
              </el-table>
             <TableForm v-if="addOrUpdateVisible" ref="addOrUpdate"></TableForm>
        </div>
  </basic-container>
</template>

<script>
    import { getList, delMenu } from "@/api/menu"
    import {mapGetters} from 'vuex'
    import TableForm from './menu-form'
    export default {
        components: {TableForm},
        data() {
          return {
              loading: true,
              tableData: [],
              addOrUpdateVisible: false
          }
        },
        computed: {
          ...mapGetters(['permission']),
        },
        created() {
            this.$nextTick(() => {
              this.initData()
            })
        },
        methods: {
            initData() {
                getList().then(res => {
                    this.tableData = res.data.data
                    this.loading = false
                })
            },
            handleDelete(id) {
                this.$confirm('是否确认删除?', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(function () {
                    delMenu(id)
                }).then(() => {
                  this.initData();
                  this.$message.success('删除成功')
                })
            },
            addOrUpdateHandle(menu) {
                console.log(menu)
                this.addOrUpdateVisible = true
                this.$refs.addOrUpdate.visible = true
                // this.$refs.addOrUpdate.form = menu
            }
        }
  }
</script>

<style scoped>

</style>
