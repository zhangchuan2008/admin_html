<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学校名称" prop="schoolName">
        <el-input
          v-model="queryParams.schoolName"
          placeholder="请输入学校名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所在地区" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请选择"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学校性质" prop="schoolType">
        <el-select v-model="queryParams.schoolType" placeholder="请选择" clearable size="small">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="schoolStatus">
        <el-select v-model="queryParams.schoolStatus" placeholder="请选择" clearable size="small">
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校类型" prop="schoolGrade">
        <el-select v-model="queryParams.schoolGrade" placeholder="请选择" clearable size="small">
          <el-option
            v-for="item in schoolGrade"
            :key="item.value"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:school:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:school:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:school:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:school:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="schoolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学校名称" align="center" prop="schoolName" />
      <el-table-column label="所在地区" align="center" prop="schoolAddress" />
      <el-table-column label="学校性质" align="center" prop="schoolType" />
      <el-table-column label="审核状态" align="center" prop="schoolStatus" />
      <el-table-column label="学校类型" align="center" prop="schoolGrade" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:school:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:school:remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校名称" prop="schoolName">
          <el-input v-model="form.schoolName" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="学校地址" prop="schoolAddress">
          <el-input v-model="form.schoolAddress" placeholder="请输入学校地址" />
        </el-form-item>
        <el-form-item label="学校校训" prop="schoolMotto">
          <el-input v-model="form.schoolMotto" placeholder="请输入学校校训" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="经度" prop="longitude">
            <el-input v-model="form.longitude" placeholder="请输入经度" />
          </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="维度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="请输入维度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="学校性质" prop="schoolType" style="width:100%">
              <el-select v-model="form.schoolType" placeholder="请选择">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="审核状态" style="width:100%">
              <el-select v-model="form.schoolStatus" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="学校logo" prop="logoPic">
          <!-- <el-input v-model="form.logoPic" placeholder="请输入学校logo" /> -->
          <el-upload
            :action="addressOss"
            list-type="picture-card"
            ref="upload"
            :before-upload="upload"
            :data="dataOss"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="学校图片" prop="schoolPic">
          <el-input v-model="form.schoolPic" placeholder="请输入学校图片" />
        </el-form-item>
        <el-form-item label="招生电话" prop="schoolPhone">
          <el-input v-model="form.schoolPhone" placeholder="请输入学校招生电话" />
        </el-form-item>
        <el-form-item label="固定电话" prop="fixedPhone">
          <el-input v-model="form.fixedPhone" placeholder="请输入固定电话" />
        </el-form-item>
        <el-form-item label="学校介绍" prop="introduce">
          <el-input v-model="form.introduce" placeholder="请输入学校介绍" />
        </el-form-item>
        <el-form-item label="学校类型" prop="schoolGrade">
          <el-select v-model="queryParams.schoolGrade" placeholder="请选择" clearable size="small">
            <el-option
              v-for="item in schoolGrade"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div id="app">
          <!-- <el-button @click="mapVisible=!mapVisible"> 打开 </el-button> -->
          <Map v-on:mapLocationClose="mapLocationClose" v-on:mapLocationSave="mapLocationSave"></Map>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSchool, getSchool, delSchool, addSchool, updateSchool, exportSchool, getUploadData } from "@/api/system/school";
// import ossClient from '@/utils/aliyun/aliyun.oss.client';
import Map from '@/components/map/baiduMap.vue'
export default {
  name: "School",
  components: {
    Map
  },
  data() {
    return {
      mapVisible:false,
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
      schoolList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schoolName: null,
        province: null,
        city: null,
        area: null,
        schoolAddress: null,
        schoolMotto: null,
        longitude: null,
        latitude: null,
        schoolSize: null,
        schoolType: null,
        logoPic: null,
        schoolPic: null,
        schoolStatus: null,
        schoolPhone: null,
        fixedPhone: null,
        introduce: null,
        schoolGrade: null,
      },
      //上传阿里云相关
      region: 'oss-cn-chengdu',//根据你买的那个区的做相应的更改
      bucket: 'shkt',
      id: 'upload',
      percentage: 0,
      url:'',
      urls:[],
      getToken:{
        sign:'',
      },
      //学校类型1民办2公办
      types: [
        {
          value: '1',
          label: '民办'
        },
        {
          value: '2',
          label: '公办'
        }
      ],
      //0未审核 1审核通过-1未通过
      status: [
        {
          value: '0',
          label: '未审核'
        },
        {
          value: '1',
          label: '审核通过'
        },
        {
          value: '-1',
          label: '未通过'
        }
      ],
      //1 幼儿园 2 小学 3 初中4 高中5中专 6 大学7 校外培训机构 8其他机构
      schoolGrade: [
        {
          value: '1',
          label: '幼儿园'
        },
        {
          value: '2',
          label: '小学'
        },
        {
          value: '3',
          label: '初中'
        },
        {
          value: '4',
          label: '高中'
        },
        {
          value: '5',
          label: '中专'
        },
        {
          value: '6',
          label: '大学'
        },
        {
          value: '7',
          label: '校外培训机构'
        },
        {
          value: '8',
          label: '其他机构'
        }
      ],
      addressOss: '',
      dataOss: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        schoolName: [
          { required: true, message: "学校名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    getUploadData().then(response => {
      
    });
  },
  methods: {
    mapLocationClose(){
			this.mapVisible = false
		},
		mapLocationSave(e){
			console.log(e)
		 	this.mapVisible = false
		},
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listSchool(this.queryParams).then(response => {
        this.schoolList = response.rows;
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
        schoolId: null,
        schoolName: null,
        province: null,
        city: null,
        area: null,
        schoolAddress: null,
        schoolMotto: null,
        longitude: null,
        latitude: null,
        schoolSize: null,
        schoolType: null,
        logoPic: null,
        schoolPic: null,
        schoolStatus: 0,
        createTime: null,
        schoolPhone: null,
        fixedPhone: null,
        introduce: null,
        schoolGrade: null,
        updateTime: null
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
      this.ids = selection.map(item => item.schoolId)
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
      const schoolId = row.schoolId || this.ids
      getSchool(schoolId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.schoolId != null) {
            updateSchool(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSchool(this.form).then(response => {
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
      const schoolIds = row.schoolId || this.ids;
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + schoolIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSchool(schoolIds);
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
          return exportSchool(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    //图片上传到阿里云
    async upload(file) {
      let fileName = "devicesource"+file.uid+file.name;//文件名，和后台约定
      let reponse = await this.$store.dispatch({
          type:'img/png',
          data:{
              fileName:fileName
          }
      })//索要签名
      this.addressOss = reponse.data.result.host;//上传地址
      this.dataOss = {
          key:reponse.data.result.key,
          ossAccessKeyId:reponse.data.result.ossAccessKeyId,
          policy:reponse.data.result.policy,
          signature:reponse.data.result.signature,
          callback:reponse.data.result.callback,
      };//上传额外参数
    },
    uploadError(err, file, fileList){
      this.$message.error('图片上传失败！');
    },
    uploadSuccess(err, file, fileList){
      this.$message.success('图片上传成功！');
      this.photos.push(this.addressOss+""+this.dataOss.key)
    }
  }
};
</script>
