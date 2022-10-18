<template>
  <div>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightbyId(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightbyId(scope.row, item2.id)"
                    >
                      {{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="success"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightbyId(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleInfo(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleInfo(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRight(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addROleVisible"
      width="50%"
      @close="addRoleClose"
    >
      <!-- 主体 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addROleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addROle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <!-- 修改用户 -->
    <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="50%">
      <!-- 主体 -->
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="50%"
      @close="setRightDialog()"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SystemIndex",

  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      //控制分配权限对话框的显示与隐藏
      setRightdialogVisible: false,

      //所有权限的数据
      rightlist: [],
      //树型控件的绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的节点id值数组
      defkeys: [],
      roleId: "",

      // 添加角色弹出框
      addROleVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },

      // 修改用户弹出框
      editRoleVisible: false,
      editForm: {
        roleName: "",
        roleDesc: "",
      },
      editFormId: "",
    };
  },

  created() {
    this.getRolesList();
  },

  methods: {
    async getRolesList() {
      const { data: res } = await this.$API.reqRolesList();
      if (res.meta.status !== 200) {
        console.error("获取角色列表失败");
      }

      this.rolelist = res.data;
    },
    //根据id删除对应的权限
    removeRightbyId(role, rightId) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$API.reqdelRoles(role.id, rightId);
          //直接赋值防止列表刷新
          role.children = res.data;
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

    async showSetRight(role) {
      this.roleId = role.id;
      //获取所有权限的数据
      const { data: res } = await this.$API.reqRightTree();
      if (res.meta.status !== 200) {
        return console.error("获取失败");
      }

      //获取到的权限数据保存到data中
      this.rightlist = res.data;
      //递归获取三级节点的id
      this.getLeafKeys(role, this.defkeys);
      this.setRightdialogVisible = true;
      console.log(this.rightlist);
    },

    //通过递归的形式 获取角色下所有三级权限的id 并保存到defkeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        //如果当前node不包含children属性 则是三级节点
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },

    setRightDialog() {
      this.defkeys = [];
    },

    //
    async allRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");
      const { data: res } = await this.$API.reqAssign(this.roleId, idStr);
      console.log(keys);
      console.log(idStr);
      console.log(res);
      // if (res.meta.status !== 200) {
      //     console.error('分配失败');
      // }

      this.getRolesList();
      this.setRightdialogVisible = false;
    },

    // 添加角色点击事件
    addRoles() {
      this.addROleVisible = true;
    },
    // 添加角色确定事件
    async addROle() {
      if (!this.addForm.roleName)
        return this.$message.warning("角色名称不能为空");
      const { data: res } = await this.$API.addRole(this.addForm);
      if (res.meta.status !== 201)
        return this.$message.error("获取角色数据失败");
      this.$message.success("添加角色成功");
      this.getRolesList();
      this.addROleVisible = false;
    },
    // 添加角色弹窗关闭
    addRoleClose() {
      this.addForm = {};
    },
    // 修改角色点击事件
    editRoleInfo(val) {
      console.log(val);
      this.editFormId = val.id;
      this.editForm.roleName = val.roleName;
      this.editForm.roleDesc = val.roleDesc;
      this.editRoleVisible = true;
    },
    // 修改角色确定事件
    async ediRole() {
      // console.log(id)
      if (!this.editForm.roleName)
        return this.$message.warning("角色名称不能为空");
      const { data: res } = await this.$API.editRole(
        this.editFormId,
        this.editForm
      );
      if (res.meta.status !== 200) return this.$message.error("修改角色失败");
      this.$message.success("修改角色成功");
      this.getRolesList();
      this.editRoleVisible = false;
    },
    // 删除角色事件
    async removeRoleInfo(id) {
      const ress = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (ress === "confirm") {
        const { data: res } = await this.$API.delRole(id);
        if (res.meta.status !== 200) return this.$message.error("删除角色失败");
        this.$message.success("删除成功");
        this.getRolesList();
      }
    },
  },
};
</script>

<style scoped>
.vcenter {
  display: flex;
  align-items: center;
}
</style>