<template lang="">
    <div>


        <el-container style="height: 100vh;">
            <el-aside width="auto">

                <common-aside></common-aside>

            </el-aside>

            <el-container>
                <el-header>
                    <common-header></common-header>
                </el-header>


                <el-main>
                  
                        <router-view></router-view>

                  
                </el-main>
            </el-container>
        </el-container>


    </div>
</template>
<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";

export default {
  name: "SysHome",
  components: {
    CommonAside,
    CommonHeader,
  },
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: black;
}

/* .el-aside {
   
    color: #333;
    text-align: center;
    line-height: 200px;
  } */

/* .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    padding-top: 0;
  } */
</style>