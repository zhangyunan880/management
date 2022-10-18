<template>
  <div>
    <el-card>
      <el-alert
        title="注意:只允许为第三级分裂设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectcatekeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
            class="size"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="adddialogVisible = true"
            >添加参数
          </el-button>
          <el-table :data="manyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag
                </el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showedit(scope.row.attr_id)"
                  >编辑
                </el-button>
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delparams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="adddialogVisible = true"
            >添加属性
          </el-button>
          <el-table :data="onlytabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showedit(scope.row.attr_id)"
                  >编辑
                </el-button>
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delparams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加（封装）  -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addclose"
    >
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addFormref"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editclose"
    >
      <el-form
        :model="editForm"
        :rules="editrules"
        ref="editFormref"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SystemParams",

  data() {
    return {
      catelist: [],
      //级联选择框配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选择框双向绑定到的数组
      selectcatekeys: [],
      //被激活的页签的名称
      activeName: "many",
      manyTabData: [],
      onlytabData: [],
      adddialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      addrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      editdialogVisible: false,
      editForm: {},
      editrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      //控制按钮与文本框的切换显示
      inputVisible: false,
      inputValue: "",
    };
  },

  mounted() {
    this.getCateList();
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$API.reqgoodslist();
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.catelist = res.data;
      console.log(this.catelist);
    },
    handleChange() {
      this.getParamsDate();
    },
    //tab页标签点击事件的处理函数
    handleClick() {
      this.getParamsDate();
    },
    //获取参数的列表数据
    async getParamsDate() {
      (this.manyTabData = []), (this.onlytabData = []);
      const { data: res } = await this.$API.reqcateattr(
        this.cateId,
        this.activeName
      );
      if (res.meta.status !== 200) {
        // return this.$message.error('获取失败')
      }
      //把字符串转换成数组
      if (res.data) {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []; //用空格分隔
          //控制文本框的显示与隐藏
          (item.inputVisible = false),
            //文本框中输入的值
            (item.inputValue = "");
        });
      }
      console.log(res);
      if (this.activeName === "many") {
        this.manyTabData = res.data;
      } else {
        this.onlytabData = res.data;
      }
    },
    //监听添加对话框的关闭事件
    addclose() {
      this.$refs.addFormref.resetFields();
    },
    addParams() {
      this.$refs.addFormref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$API.reqAddparams(
          this.cateId,
          this.addForm.attr_name,
          this.activeName
        );
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.adddialogVisible = false;
        this.$message.success("添加成功");
        this.getParamsDate();
      });
    },

    async showedit(id) {
      const { data: res } = await this.$API.reqprop(
        this.cateId,
        id,
        this.activeName
      );
      if (res.meta.status != 200) return this.$message.error("获取失败");

      this.$message.success("获取成功");
      this.editForm = res.data;

      this.editdialogVisible = true;
    },
    // 重置修改表单
    editclose() {
      this.$refs.editFormref.resetFields();
    },
    //点击按钮修改参数信息
    editParams() {
      this.$refs.editFormref.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$API.reqConfirm(
          this.cateId,
          this.editForm.attr_id,
          this.editForm.attr_name,
          this.activeName
        );
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("获取失败");

        this.$message.success("获取成功");
        this.getParamsDate();
        this.editdialogVisible = false;
      });
    },

    // 删除
    delparams(id) {
      this.$confirm("死否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$API.reqdelparams(this.cateId, id);
          this.getParamsDate();
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

    //文本框失去焦点 或按回车
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //如果没有retuen 则证明输入内容 需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;

      this.saveAttrval(row);
    },

    async saveAttrval(row) {
      const { data: res } = await this.$API.reqAddTag(
        this.cateId,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(" ")
      );
      if (res.meta.status !== 200) {
        // return this.$message.error("添加参数失败");
      }
      console.log(res);
      //   this.$message.success("添加参数成功");
    },

    showInput(row) {
      (row.inputVisible = true),
        //$nextTick 当页面被重新渲染之后才会指定回调函数中的代码
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //删除对应参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrval(row);
    },
  },
  computed: {
    //如果按钮需要被禁用则返回true 否则返回false
    isBtnDisable() {
      if (this.selectcatekeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectcatekeys.length === 3) {
        return this.selectcatekeys[2];
      }
      return null;
    },

    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>

<style scoped>
.cat-opt {
  margin: 15px 0;
}

.size {
  width: 20%;
}
</style>