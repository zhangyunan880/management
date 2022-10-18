<template lang="">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>

      <el-table :data="rightsList"  border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level ==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>

          </template>
        </el-table-column>
      </el-table>

    </el-card>





  </div>
</template>
<script>
  export default {
    name: "SysHome",
    data() {
      return {
        //权限列表
        rightsList: []
      };
    },

    created() {
      this.getRightsList()
    },
    methods: {
      //获取权限列表
      async getRightsList() {
        const { data: res } = await this.$API.reqRightsList()
        if (res.meta.status !== 200) {
          return console.error('获取失败');

        }
        this.rightsList = res.data
        console.log(this.rightsList);
      }
    },
  };
</script>
<style scope>
</style>