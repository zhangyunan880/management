<template>
  <div>
    <el-menu
      :default-active="currenPath"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409eff"
      :collapse="isCollapse"
      :unique-opened="true"
      router
    >
      <h3>{{ isCollapse ? "后台" : "后台管理系统" }}</h3>

      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单 -->
        <template slot="title">
          <i :class="iconList[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + subItem.path + ''"
          v-for="subItem in item.children"
          :key="subItem.id"
        
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "CommonAside",
  data() {
    return {
      menulist: [],
      iconList: {
        125: "iconfont icon-haoyou",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpinguanli-jianying",
        102: "iconfont icon-complete-fill",
        145: "iconfont icon-baobiao",
      },
    };
  },
  created() {
    this.getMenuList();
  },
  mounted() {},
  methods: {
    //获取侧边栏接口
    async getMenuList() {
      const { data: res } = await this.$API.reqMenus();

      if (res.meta.status == 200) {
        this.menulist = res.data;
        console.log(this.menulist);
      }
    },

    clickMenu(menulist) {
      this.$router.push({
        name: menulist.name,
      });
      this.$store.commit("slectmenu", this.menulist);
    },
  },

  computed: {
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },

    currenPath() {
      return this.$route.path;
    },
  },
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  height: 100vh;
  border: none;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
  }
}
</style>