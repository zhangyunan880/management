<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avtar_box">
        <img src="@/assets/images/user.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFromref"
        :model="loginFrom"
        :rules="rules"
        label-width="0px"
        class="login_from"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginFrom.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-unlock"
            show-password
            v-model="loginFrom.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "YnLogin",

  data() {
    return {
      //登录表单的数据绑定队像
      loginFrom: {
        username: "",
        password: "",
      },
      rules: {
        //验证用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        //验证密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    //重置按钮
    resetLoginFrom() {
      this.$refs.loginFromref.resetFields();
    },

    login() {
      this.$refs.loginFromref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$API.login(this.loginFrom);

        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message({ message: "登录成功", type: "success" });
        //将登陆成功之后的token 保存到客户端的 sessionStorage中
        //项目中出现了登录之外的其他API接口 必须在登录之后才能访问
        //token只应在当前网站打开期间生效 所以将token 保存在sessionStroage 中
        window.sessionStorage.setItem("token", res.data.token);
        //通过编程式导航跳转到后台主页 路由地址
        this.$router.push("/users");
      });
    },
  },
};
</script>

<style lang="less"  scoped >
.login_container {
  background-color: rgb(84, 92, 100);
  height: 100vh;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); //页面居中
}

.avtar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.btns {
  display: flex;
  justify-content: center;
}
.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}
</style>