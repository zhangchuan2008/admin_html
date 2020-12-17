<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学校Id" prop="schoolId">
        <el-input
          v-model="queryParams.schoolId"
          placeholder="请输入学校Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1生效 -1 删除" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择1生效 -1 删除" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级一级分类" prop="oneGrade">
        <el-input
          v-model="queryParams.oneGrade"
          placeholder="请输入班级一级分类"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级二级分类名称" prop="twoGradeName">
        <el-input
          v-model="queryParams.twoGradeName"
          placeholder="请输入班级二级分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1未毕业-1已经毕业" prop="isGraduate">
        <el-input
          v-model="queryParams.isGraduate"
          placeholder="请输入1未毕业-1已经毕业"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班级名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input
          v-model="queryParams.comment"
          placeholder="请输入备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1为普通班级2全体教师组" prop="classType">
        <el-select v-model="queryParams.classType" placeholder="请选择1为普通班级2全体教师组" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级码" prop="classCode">
        <el-input
          v-model="queryParams.classCode"
          placeholder="请输入班级码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:class:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:class:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:class:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:class:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级Id" align="center" prop="classId" />
      <el-table-column label="学校Id" align="center" prop="schoolId" />
      <el-table-column label="1生效 -1 删除" align="center" prop="auditStatus" />
      <el-table-column label="班级一级分类" align="center" prop="oneGrade" />
      <el-table-column label="班级二级分类名称" align="center" prop="twoGradeName" />
      <el-table-column label="1未毕业-1已经毕业" align="center" prop="isGraduate" />
      <el-table-column label="班级名称" align="center" prop="className" />
      <el-table-column label="备注" align="center" prop="comment" />
      <el-table-column label="1为普通班级2全体教师组" align="center" prop="classType" />
      <el-table-column label="班级码" align="center" prop="classCode" />
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
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:class:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

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
        schoolId: null,
        auditStatus: null,
        oneGrade: null,
        twoGradeName: null,
        isGraduate: null,
        className: null,
        comment: null,
        classType: null,
        classCode: null
      },
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
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listClass(this.queryParams).then(response => {
        this.classList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.classId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
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
    handleDelete(row) {
      const classIds = row.classId || this.ids;
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + classIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delClass(classIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
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
