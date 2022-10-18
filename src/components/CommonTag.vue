<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, i) in breadcrumbList"
      :key="i"
      :to="item.path"
      >{{ item.title }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>
 
<script>
export default {
  data() {
    return {
      breadcrumbList: [],
    };
  },

  methods: {
    caleBreadcrumb() {
      const temp = [];
      this.$route.matched.forEach((item) => {
        if (item.name && item.path) {
          temp.push({ path: item.path, title: item.name });
        }
      });
      this.breadcrumbList = temp;
      console.log(this.breadcrumbList);
    },
  },
  created() {
    this.caleBreadcrumb(); //初始化渲染面包屑导航
  },
  watch: {
    // 写法 一 :
    // '$route.path'() {
    //   this.caleBreadcrumb() //路由变化后重新进行计算
    // }

    // 写法二 :
    "$route.path": {
      handler() {
        this.caleBreadcrumb();
      },
      immediate: true,
    },
  },
};
</script>
 
<style lang="scss" scoped></style>