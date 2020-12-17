<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机构名称" prop="organizationName">
        <el-input
          v-model="queryParams.organizationName"
          placeholder="请输入机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构账户" prop="organizationAccount">
        <el-input
          v-model="queryParams.organizationAccount"
          placeholder="请输入机构账户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构密码" prop="organizationPassword">
        <el-input
          v-model="queryParams.organizationPassword"
          placeholder="请输入机构密码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入位置"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务电话" prop="serveMobile">
        <el-input
          v-model="queryParams.serveMobile"
          placeholder="请输入服务电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input
          v-model="queryParams.longitude"
          placeholder="请输入经度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维度" prop="latitude">
        <el-input
          v-model="queryParams.latitude"
          placeholder="请输入维度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="0:未审核 1:审核通过 -1:审核不通过 " prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择0:未审核 1:审核通过 -1:审核不通过 " clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="主图片" prop="mainPic">
        <el-input
          v-model="queryParams.mainPic"
          placeholder="请输入主图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="内景图片" prop="innerPic">
        <el-input
          v-model="queryParams.innerPic"
          placeholder="请输入内景图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外景图片" prop="outterPic">
        <el-input
          v-model="queryParams.outterPic"
          placeholder="请输入外景图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总评分" prop="totalScore">
        <el-input
          v-model="queryParams.totalScore"
          placeholder="请输入总评分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参加总次数" prop="joinNum">
        <el-input
          v-model="queryParams.joinNum"
          placeholder="请输入参加总次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="第几次申报" prop="term">
        <el-input
          v-model="queryParams.term"
          placeholder="请输入第几次申报"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上线时间" prop="onlineTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.onlineTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择上线时间">
        </el-date-picker>
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
          v-hasPermi="['system:organization:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:organization:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:organization:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:organization:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="organizationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="机构Id" align="center" prop="organizationId" />
      <el-table-column label="机构名称" align="center" prop="organizationName" />
      <el-table-column label="机构账户" align="center" prop="organizationAccount" />
      <el-table-column label="机构密码" align="center" prop="organizationPassword" />
      <el-table-column label="位置" align="center" prop="location" />
      <el-table-column label="服务电话" align="center" prop="serveMobile" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="维度" align="center" prop="latitude" />
      <el-table-column label="0:未审核 1:审核通过 -1:审核不通过 " align="center" prop="auditStatus" />
      <el-table-column label="主图片" align="center" prop="mainPic" />
      <el-table-column label="内景图片" align="center" prop="innerPic" />
      <el-table-column label="外景图片" align="center" prop="outterPic" />
      <el-table-column label="总评分" align="center" prop="totalScore" />
      <el-table-column label="参加总次数" align="center" prop="joinNum" />
      <el-table-column label="第几次申报" align="center" prop="term" />
      <el-table-column label="上线时间" align="center" prop="onlineTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.onlineTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:organization:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:organization:remove']"
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
        <el-form-item label="机构名称" prop="organizationName">
          <el-input v-model="form.organizationName" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构账户" prop="organizationAccount">
          <el-input v-model="form.organizationAccount" placeholder="请输入机构账户" />
        </el-form-item>
        <el-form-item label="机构密码" prop="organizationPassword">
          <el-input v-model="form.organizationPassword" placeholder="请输入机构密码" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="服务电话" prop="serveMobile">
          <el-input v-model="form.serveMobile" placeholder="请输入服务电话" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="0:未审核 1:审核通过 -1:审核不通过 ">
          <el-radio-group v-model="form.auditStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主图片" prop="mainPic">
          <el-input v-model="form.mainPic" placeholder="请输入主图片" />
        </el-form-item>
        <el-form-item label="内景图片" prop="innerPic">
          <el-input v-model="form.innerPic" placeholder="请输入内景图片" />
        </el-form-item>
        <el-form-item label="外景图片" prop="outterPic">
          <el-input v-model="form.outterPic" placeholder="请输入外景图片" />
        </el-form-item>
        <el-form-item label="总评分" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="请输入总评分" />
        </el-form-item>
        <el-form-item label="参加总次数" prop="joinNum">
          <el-input v-model="form.joinNum" placeholder="请输入参加总次数" />
        </el-form-item>
        <el-form-item label="第几次申报" prop="term">
          <el-input v-model="form.term" placeholder="请输入第几次申报" />
        </el-form-item>
        <el-form-item label="上线时间" prop="onlineTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.onlineTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上线时间">
          </el-date-picker>
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
import { listOrganization, getOrganization, delOrganization, addOrganization, updateOrganization, exportOrganization } from "@/api/system/organization";

export default {
  name: "Organization",
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
      organizationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        organizationName: null,
        organizationAccount: null,
        organizationPassword: null,
        location: null,
        serveMobile: null,
        longitude: null,
        latitude: null,
        auditStatus: null,
        mainPic: null,
        innerPic: null,
        outterPic: null,
        totalScore: null,
        joinNum: null,
        term: null,
        onlineTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        organizationName: [
          { required: true, message: "机构名称不能为空", trigger: "blur" }
        ],
        organizationAccount: [
          { required: true, message: "机构账户不能为空", trigger: "blur" }
        ],
        organizationPassword: [
          { required: true, message: "机构密码不能为空", trigger: "blur" }
        ],
        location: [
          { required: true, message: "位置不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
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
      listOrganization(this.queryParams).then(response => {
        this.organizationList = response.rows;
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
        organizationId: null,
        organizationName: null,
        organizationAccount: null,
        organizationPassword: null,
        location: null,
        serveMobile: null,
        longitude: null,
        latitude: null,
        auditStatus: 0,
        mainPic: null,
        innerPic: null,
        outterPic: null,
        totalScore: null,
        joinNum: null,
        term: null,
        createTime: null,
        updateTime: null,
        onlineTime: null
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
      this.ids = selection.map(item => item.organizationId)
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
      const organizationId = row.organizationId || this.ids
      getOrganization(organizationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.organizationId != null) {
            updateOrganization(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrganization(this.form).then(response => {
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
      const organizationIds = row.organizationId || this.ids;
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + organizationIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrganization(organizationIds);
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
          return exportOrganization(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
