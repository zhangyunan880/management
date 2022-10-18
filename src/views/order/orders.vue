<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="是否付款" width="100px" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.is_send === "否" ? "否" : "是" }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="170px" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="">
            <el-tooltip
              content="修改地址"
              placement="bottom-start"
              effect="light"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editOrder"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="查看物流"
              placement="bottom-start"
              effect="light"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="opeprogress"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 修改地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editLoactionVisible"
      width="50%"
      @close="editClose"
    >
      <el-form
        ref="editFormRef"
        :rules="editFormRules"
        :model="editRuleForm"
        label-width="80px"
      >
        <el-form-item label="省市区/县" prop="adress1" label-width="85px">
          <el-cascader
            v-model="editRuleForm.adress1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="editRuleForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editLoactionVisible = false">取 消</el-button>
        <el-button type="primary" @click="isEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流 -->
    <el-dialog
      title="查看物流状态"
      :visible.sync="showProgressVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progress"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "@/views/order/citydata";

export default {
  name: "SystemOrders",

  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,

      editLoactionVisible: false,

      editRuleForm: {
        adress1: [],
        adress2: "",
      },
      citydata,

      editFormRules: {
        adress1: [{ required: true, message: "请选择地区", trigger: "change" }],
        adress2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },

      showProgressVisible: false,
      progress: [],
    };
  },

  created() {
    this.getOrder();
  },

  methods: {
    async getOrder() {
      const { data: res } = await this.$API.getOrdersList(this.queryInfo);
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("请求订单列表失败");
      console.log(res.data);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },

    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;

      this.getOrder();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;

      this.getOrder();
    },

    editOrder() {
      this.editLoactionVisible = true;
    },
    editClose() {
      this.$refs.editFormRef.resetFields();
    },
    isEdit() {
      this.$message.success("修改成功");
      this.editLoactionVisible = false;
    },

    opeprogress() {
      this.showProgressVisible = true;
      this.showProgress();
    },
    // 查看物流进度
    async showProgress() {
      this.showProgressVisible = true;
      const { data: res } = await this.$API.showKuaidi();
      if (res.meta.status !== 200) return this.$message.error("查询失败");
      this.progress = res.data;
      console.log(this.progress);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>