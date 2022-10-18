<template>
  <div>
    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
export default {
  name: "SystemReports",

  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  //   此时 页面上的元素已经渲染好了
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$API.getReports();
    if (res.meta.status !== 200) return this.$message.error("获取数据失败");
    const result = _.merge(res.data, this.options);
    // const obj = this.deepMerge(res.data, this.options);
    // 绘制图表
    myChart.setOption(result);
    // 展示数据
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>