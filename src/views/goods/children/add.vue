<template>
  <div>
    <el-card>
      <!-- 提示区 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeindex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeindex"
          :tab-position="'left'"
          :before-leave="beforetableave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_nema">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateobj"
                @change="handleChange"
                style="width: 300px"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cd"
                  v-for="(cd, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--action 表示图片要上传的后台api地址  -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="handlesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor">
            </quill-editor>

            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="add" class="btnadd"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="predialogVisible" width="50%">
      <img :src="previewPath" alt="" width="80%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "SystemAdd",

  data() {
    return {
      activeindex: "0",
      //添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        pics: [],
        //商品的详情描述
        goods_introduce: "",
        attrs: [],
      },

      catelist: [],
      cateobj: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },

      addrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [{ required: true, message: "请选择商品", trigger: "blur" }],
      },
      //动态参数
      manyTableData: [],
      //静态参数
      onlyTableData: [],
      headerobj: {
        //图片上传组建的请求头
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      predialogVisible: false,
    };
  },

  created() {
    this.getcatelist();
  },

  methods: {
    async getcatelist() {
      const { data: res } = await this.$API.reqgoodslist();
      //   if (res.meta.status !== 200) {
      //     return console.error("获取失败");
      //   }
      this.catelist = res.data;
    },
    //级联选择器选中项变化 会触发这个函数
    handleChange() {},
    beforetableave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },

    //封装方法
    async getaddparams(sel) {
      let arr = [];
      const { data: res } = await this.$API.reqcateattr(this.cateid, sel);
      if (sel === "many") {
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
      }

      arr = res.data;
      return arr; //要把数据return出来
    },

    async tabClicked() {
      //证明保存的是动态参数面板
      if (this.activeindex === "1") {
        this.manyTableData = await this.getaddparams("many");
        console.log(this.manyTableData);
      } else if (this.activeindex === "2") {
        this.onlyTableData = await this.getaddparams("only");
        console.log(this.onlyTableData);
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.predialogVisible = true;
    },
    //删除图片
    handleRemove(file) {
      //获取将要删除的图片的临时路径
      const filepath = file.response.data.tmp_path;
      //从pics数组中 找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filepath;
      });
      //调用数组的splice 方法从pics数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //监听图片上传成功的事件
    handlesuccess(response) {
      //1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //2.将图片信息对象 push 到pics数组中
      this.addForm.pics.push(picInfo);
    },
    //添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        //执行添加
        //数组变字符串join
        //loadsh cloneDeep()

        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // this.addForm.goods_cat = this.addForm.goods_cat.join(",");
        //处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        //处理静态参数
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });

        form.attrs = this.addForm.attrs;
        console.log(this.addForm.attrs);
        // console.log(form);

        const { data: res } = await this.$API.addGood(form);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("获取失败");
        }
        this.$message.success("获取成功");
        this.$router.push("/goods");
      });
    },
  },

  computed: {
    cateid() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style  scoped>
.btnadd {
  margin-top: 15px;
}
</style>