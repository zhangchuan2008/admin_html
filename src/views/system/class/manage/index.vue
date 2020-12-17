<template>
  <div class="app-container class-manage">
    <div class="left">
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-document"></i>
                    <span>班级列表</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">新建单个班级</el-menu-item>
                    <el-menu-item index="1-2">下载【批量导入班级】模板</el-menu-item>
                    <el-menu-item index="1-3">导入【批量导入班级】模板</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-rank"></i>
                    <span>创建班级</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">新建单个班级</el-menu-item>
                    <el-menu-item index="1-2">下载【批量导入班级】模板</el-menu-item>
                    <el-menu-item index="1-3">导入【批量导入班级】模板</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="3">
                <i class="el-icon-menu"></i>
                <span slot="title">添加老师</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-document"></i>
                <span slot="title">添加学生</span>
            </el-menu-item>
            <el-menu-item index="5">
                <i class="el-icon-setting"></i>
                <span slot="title">导出学生信息</span>
            </el-menu-item>
        </el-menu>
    </div>
    <div class="right">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="姓名/账号" label-width="90px">
                <el-input
                v-model="queryParams.phonenumber"
                placeholder="请输入姓名/账号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="审核状态">
                <el-select v-model="queryParams.auditStatus" placeholder="请选择">
                    <el-option
                    v-for="item in applyStatus"
                    :key="item.value"
                    :label="item.label"
                    clearable
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="queryParams.roleId" placeholder="请选择">
                    <el-option
                    v-for="item in roles"
                    :key="item.value"
                    clearable
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="classList" stripe border>
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="ID" align="center" prop="classId" />
            <el-table-column label="身份" align="center" prop="schoolId" />
            <el-table-column label="姓名" align="center" prop="auditStatus" />
            <el-table-column label="性别" align="center" prop="oneGrade" />
            <el-table-column label="账号" align="center" prop="twoGradeName" />
            <el-table-column label="生日" align="center" prop="isGraduate" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:class:edit']"
                >修改</el-button>
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="resetPassword(scope.row)"
                    v-hasPermi="['system:class:remove']"
                >重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"/>
    </div>
    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校Id" prop="schoolId">
          <el-input v-model="form.schoolId" placeholder="请输入学校Id" />
        </el-form-item>
        <el-form-item label="1生效 -1 删除">
          <el-radio-group v-model="form.auditStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班级一级分类" prop="oneGrade">
          <el-input v-model="form.oneGrade" placeholder="请输入班级一级分类" />
        </el-form-item>
        <el-form-item label="班级二级分类名称" prop="twoGradeName">
          <el-input v-model="form.twoGradeName" placeholder="请输入班级二级分类名称" />
        </el-form-item>
        <el-form-item label="1未毕业-1已经毕业" prop="isGraduate">
          <el-input v-model="form.isGraduate" placeholder="请输入1未毕业-1已经毕业" />
        </el-form-item>
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="form.comment" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="1为普通班级2全体教师组" prop="classType">
          <el-select v-model="form.classType" placeholder="请选择1为普通班级2全体教师组">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级码" prop="classCode">
          <el-input v-model="form.classCode" placeholder="请输入班级码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listClass, getClass, delClass, addClass, updateClass, exportClass } from "@/api/system/class";

export default {
  name: "Class",
  components: {
  },
  data() {
    return {
        type: '1',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      classList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: null,
        auditStatus: null,
        phonenumber: null
      },
      applyStatus:[{
          value: '0',
          label: '待审核'
        },
        {
          value: '1',
          label: '审核通过'
        },
        {
          value: '-2',
          label: '未通过'
        }],
        //66  学生  88 家长  200 老师
        roles:[{
          value: '0',
          label: '全部'
        },
        {
          value: '66',
          label: '学生'
        },
        {
          value: '88',
          label: '家长'
        },{
          value: '200',
          label: '老师'
        }],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        schoolId: [
          { required: true, message: "学校Id不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        className: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.schoolId = this.$route.query.schoolId || ''
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
        this.loading = true;
        console.log(this.queryParams.roleId == 0)
        if(this.queryParams.roleId == 0){
            this.queryParams.roleId = ''
        }
        listClass(this.queryParams).then(response => {
            this.classList = response.rows;
            this.total = response.total;
            this.loading = false;
        });
    },
    handleOpen(key, keyPath) {
     console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
     console.log(key, keyPath);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        classId: null,
        schoolId: null,
        createTime: null,
        auditStatus: 0,
        oneGrade: null,
        twoGradeName: null,
        isGraduate: null,
        className: null,
        comment: null,
        classType: null,
        classCode: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.classId)
    //   this.single = selection.length!==1
    //   this.multiple = !selection.length
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const classId = row.classId || this.ids
      getClass(classId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.classId != null) {
            updateClass(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClass(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    resetPassword(row) {
      const classIds = row.classId || this.ids;
      this.$confirm('确定重置该用户密码', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delClass(classIds);
        }).then(() => {
          this.msgSuccess("重置成功!");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportClass(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
<style>
    .class-manage{
        display: flex;
    }
    .class-manage .left{
        width: 15%;
        margin: 0 3% 0 2%;
    }
    .class-manage .right{
        width: 75%;
        margin-right: 5%;
    }
    .class-manage .el-menu{
        border: solid 1px #e6e6e6;
    }
</style>
