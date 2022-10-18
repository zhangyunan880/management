<template >
  <div>
    

    <!-- 卡片试图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList"
            @keyup.enter.native="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <!-- 序列 -->
        <el-table-column label="序列" type="index" align="center"></el-table-column>
        <el-table-column label="姓名" prop="username" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
        <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <!-- 可以获得该行的所有数据 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
  <!-- 修改按钮 -->
  <el-button
    type="primary"
    icon="el-icon-edit"
    size="mini"
    @click="showEdit(scope.row.id)"
  ></el-button>
  <!-- 删除按钮 -->
  <el-button
    type="danger"
    icon="el-icon-delete"
    size="mini"
    @click="removeUser(scope.row.id)"
  ></el-button>
  <!-- 鼠标停留提示 -->
  <el-tooltip
    class="item"
    effect="dark"
    content="分配角色"
    placement="top"
    :enterable="false"
  >
    <!-- 分配角色按钮 -->
    <el-button
      type="warning"
      icon="el-icon-setting"
      size="mini"
      @click="setRole(scope.row)"
    ></el-button>
  </el-tooltip>
</template>
        </el-table-column>


      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addClose">
      <!-- 内容主体区 -->

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="30%" @close="editclose">

      <el-form :model="editFrom" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoledialogVisible" width="30%" @close="setroleclose">
      <div>
        <p>当前的用户:{{usersinfo.username}}</p>
        <p>当前的角色:{{usersinfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script>
export default {
  name: "SysUser",
  data() {
    return {
      //控制用户对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改对话框的显示与隐藏
      editdialogVisible: false,
      //控制分配角色对话框的显示与隐藏
      setRoledialogVisible: false,

      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2,
      },

      userlist: [],
      total: 0,

      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "你输入手机格式不正确",
            trigger: "blur",
          },
        ],
      },
      //查询用户信息
      editFrom: {
        id: "",
        email: "",
        mobile: "",
      },

      //需要被分配角色的用户信息
      usersinfo: {},
      //所有角色的数据列表
      rolesList: [],
      //已选中的角色id
      selectRole: "",
    };
  },
  created() {
    this.getUserList();
  },

  computed: {},
  methods: {
    //获取用户数据
    async getUserList() {
      const { data: res } = await this.$API.reqUserList(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$$message.error("获取失败");
      }
      this.userlist = res.data.users;
      console.log(this.userlist);
      this.total = res.data.total;
    },

    //监听pagesize改变的事件  显示多少条
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //修改状态
    async userStateChanged(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$API.reqUserState(
        userInfo.id,
        userInfo.mg_state
      );
      console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    //监听添加用户对话框的事件
    addClose() {
      this.$refs.addFormRef.resetFields(); //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    },
    //添加用户
    adduser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发起添加用户的网络请求
        const { data: res } = await this.$API.reqAddUser(this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");

        //隐藏添加对话框
        this.addDialogVisible = false;
        //重新获取用户列表数据
        this.getUserList();
      });
    },
    //展示用户编辑
    async showEdit(id) {
      this.editdialogVisible = true;
      const { data: res } = await this.$API.requserInfo(id);
      if (res.meta.status !== 200) return this.$message.error("查询失败");
      this.$message.success("查询成功");
      this.editFrom = res.data;
    },
    //监听修改用户对话框的事件
    editclose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$API.reqeditInfo(
          this.editFrom.id,
          this.editFrom
        );
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("修改失败");
        }

        //隐藏添加对话框
        this.editdialogVisible = false;
        //重新获取用户列表数据
        this.getUserList();
        this.$message.success("修改成功");
      });
    },

    //删除用户
    removeUser(id) {
      console.log(id);
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$API.reqdelUser(id);
          this.getUserList();

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

    //展示分配角色对话框
    async setRole(usersinfo) {
      this.usersinfo = usersinfo;
      //在展示对话框之前 获取所有角色的列表
      const { data: res } = await this.$API.reqsetRole();
      if (res.meta.status !== 200) {
        return console.error("获取失败");
      }
      this.rolesList = res.data;
      this.setRoledialogVisible = true;
    },

    //点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectRole) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$API.reqRole(
        this.usersinfo.id,
        this.selectRole
      );
      console.log(this.usersinfo.id);
      console.log(res);
      console.log(this.selectRole);
      if (res.meta.status !== 200) return this.$message.error("更新失败");

      this.$message.success("更新成功");
      this.getUserList();
      this.setRoledialogVisible = false;
    },

    setroleclose() {
      this.selectRole = "";
      this.usersinfo = {};
    },
  },
};
</script>
<style lang=""></style>