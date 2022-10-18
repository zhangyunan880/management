<template>
  <header>
    <div class="l-content">
      <el-button
        icon="el-icon-menu"
        size="mini"
        @click="handleMenu()"
      ></el-button>
      <div class="bread">
        <CommonTag></CommonTag>
      </div>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <img :src="imgurl" class="user" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>
<script>
// 拿数据
import CommonTag from "@/components/CommonTag";
export default {
  name: "CommonHeader",
  components: {
    CommonTag,
  },
  data() {
    return {
      imgurl: require("../assets/images/user.png"),
    };
  },

  mounted() {},
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    handleMenu() {
      this.$store.commit("CollapseMenu");
    },
  },
  computed: {},
};
</script>
<style lang="less" scoped>
header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.el-breadcrumb /deep/ .el-breadcrumb__inner {
  color: #ccc !important;
}

.bread {
  margin-top: 14px;
}
</style>