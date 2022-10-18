<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddcate">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        class="treetable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateName(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="addcateClose"
    >
      <!--添加分类表单  -->
      <el-form
        :model="addCateFrom"
        :rules="addCateFormRules"
        ref="addCateFromruRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 -->
          <!-- props指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentcateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogColosed"
    >
      <!-- 表单 -->
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateRuleForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SystemCate",

  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前一列使用模板的名称
          template: "isok",
        },
        {
          label: "排序",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前一列使用模板的名称
          template: "order",
        },
        {
          label: "排序",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前一列使用模板的名称
          template: "opt",
        },
      ],
      addCatedialogVisible: false,
      // 添加分类的表单对象
      addCateFrom: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // 任意级别都可选
        checkStrictly: true,
      },
      //选择的父级分类的id的数组
      selectedKeys: [],

      editCateForm: {
        id: "",
        cat_name: "",
      },
      editCateDialogVisible: false,
    };
  },

  created() {
    this.getCateList();
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$API.reqCateList(this.querInfo);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },

    showAddcate() {
      //获取父级分类数据
      this.getParentCateList();
      this.addCatedialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$API.reqParentCateList();
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.parentCateList = res.data;
      console.log(this.parentCateList);
    },
    //选择项发生变化触发这个函数
    parentcateChange() {
      //如果selectedKeys 数组中的length 大于0 证明选中了父级分类
      //反之就说明没有任何父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateFrom.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];

        //为当前分类的等级 赋值
        this.addCateFrom.cat_level = this.selectedKeys.length;
      } else {
        this.addCateFrom.cat_pid = 0;
        //为当前分类的等级 赋值
        this.addCateFrom.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateFromruRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$API.reqAddcate(this.addCateFrom);
        if (res.meta.status !== 201) {
          return this.$message.error("获取数据失败");
        }
        this.$message.success("获取数据成功");
        this.getCateList();
        this.addCatedialogVisible = false;
      });
    },
    //监听对话框的关闭 重置表单
    addcateClose() {
      this.$refs.addCateFromruRef.resetFields();
      this.selectedKeys = [];
      (this.addCateFrom.cat_level = 0), (this.addCateFrom.cat_pid = 0);
    },

    // 修改分类名称
    editCateName(val) {
      console.log(val);
      this.editCateDialogVisible = true;
      this.editCateForm.id = val.cat_id;
      this.editCateForm.cat_name = val.cat_name;
    },
    // 修改分类弹窗关闭事件
    editCateDialogColosed() {
      this.$refs.editCateRuleForm.resetFields();
    },
    // 修改弹窗确定事件
    editCate() {
      this.$refs.editCateRuleForm.validate(async (valid) => {
        if (!valid) return "";
        const { data: res } = await this.$API.editCateGories(
          this.editCateForm.id,
          this.editCateForm.cat_name
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改分类名称失败");
        this.$message.success("修改分类名称成功");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },
    // 删除分类
    async delCate(val) {
      const ress = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (ress === "confirm") {
        const { data: res } = await this.$API.deleteCateGories(val.cat_id);
        if (res.meta.status !== 200) return this.$message.error("删除分类失败");
        this.$message.success("删除分类成功");

        this.getCateList();
      }
    },
  },
};
</script>

<style scoped>
.treetable {
  margin-top: 15px;
}
</style>