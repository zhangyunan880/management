<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="delgoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SystemGoods",

  data() {
    return {
      //查询参数对象
      queryInfo: {
        query: "",
        //当前页码值
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 10,
      },
      goodslist: [],
      total: 0,
    };
  },

  created() {
    this.getGoodsList();
  },

  methods: {
    async getGoodsList() {
      const { data: res } = await this.$API.reqGoods(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.goodslist = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodslist);
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      console.log(newsize);
      this.getGoodsList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      console.log(newpage);
      this.getGoodsList();
    },
    //删除
    delgoods(id) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$API.reqdelgoods(id);
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    goAddPage() {
      this.$router.push("/goods/add");
    },

    editGoods(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>