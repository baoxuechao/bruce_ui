<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-postcard"></i> 个人信息</span>
          <el-row>
            <el-col :span="16">
              <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="80px">
                <el-form-item>
                  <div class="demo-basic--circle" style="text-align: center">
                    <div class="block"><el-avatar :size="120" :src="userInfo.avatar"></el-avatar></div>
                  </div>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="userInfo.username" disabled="disabled"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="userInfo.phone"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="userInfo.email"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="subUserinfo">提交</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="密码设置">
          <span slot="label"><i class="el-icon-lock"></i> 密码设置</span>
          <el-form ref="password" :model="form" :rules="rules2" label-width="80px">
                <el-form-item label="旧密码" prop="password">
                  <el-input type="password" v-model="form.password"/>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input type="password" v-model="form.newPassword"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input type="password" v-model="form.confirmPassword"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="confirmEdit">确认修改</el-button>
                  <el-button @click="reset">重置</el-button>
                </el-form-item>
              </el-form>
        </el-tab-pane>
    </el-tabs>
    </basic-container>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {editUserInfo, updatePassword} from '@/api/user'
  export default {
    data () {
      const validPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入电话号码'))
        } else if (!this.isvalidPhone(value)) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback()
        }
      }
      const validEmail = (rule, value, callback) => {
        if (!this.isvalidEmail(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (this.form.password !== '') {
          if (value !== this.form.newPassword) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        form: {id: null, password: '', newPassword: '', confirmPassword: ''},
        rules: {
          phone: [
            {required: true, trigger: "blur", validator: validPhone}
          ],
          email: [
            {required: true, trigger: "blur", validator: validEmail}
          ]
        },
        rules2: {
          password: [{required: true, min: 6, message: '原密码不能为空且不少于6位', trigger: 'change'}],
          newPassword: [{required: false, min: 6, message: '不少于6位', trigger: 'change'}],
          confirmPassword: [{required: false, validator: validatePass, trigger: 'blur'}]
        }
      };
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.userInfo
      })
    },
    created () {
      this.initPage()
    },
    methods: {
      initPage() {
        this.form.id = this.userInfo.id
      },
      subUserinfo() {
        this.$refs['userInfo'].validate((valid) => {
          if (valid) {
            editUserInfo(this.userInfo).then(res => {
              const data = res.data
              if (data.code===200) {
                this.$message.success(data.message)
              } else {
                this.$message.error(data.message)
              }
            })
          }
        })
      },
      confirmEdit() {
        this.$refs['password'].validate((valid) => {
          if (valid) {
            updatePassword(this.form).then(res => {
              const data = res.data
              if (data.code===200) {
                this.$message.success(data.message)
              } else {
                this.$message.error(data.message)
              }
            })
          }
        })
      },
      reset() {
        this.form = {id: null, password: '', newPassword: '', confirmPassword: ''}
      },
      isvalidPhone(str) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        return reg.test(str)
      },
      isvalidEmail(str) {
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        return reg.test(str)
      }
    }
  };
</script>
