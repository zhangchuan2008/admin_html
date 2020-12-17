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
        <el-cascader
          expand-trigger="hover"
          :options="allAddress"
          v-model="queryParams.province">
        </el-cascader>    
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
            icon="el-icon-date"
            @click="toManage(scope.row)"
            v-hasPermi="['system:school:date']"
          >管理</el-button>
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
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校名称" prop="schoolName">
          <el-input v-model="form.schoolName" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="学校地址" prop="schoolAddress">
          <!-- <el-input v-model="form.schoolAddress" placeholder="请输入学校地址" /> -->
          <el-cascader
            expand-trigger="hover"
            :options="allAddress"
            v-model="form.schoolArea">
          </el-cascader>
        </el-form-item>
        <el-form-item label="学校校训" prop="schoolMotto">
          <el-input v-model="form.schoolMotto" placeholder="请输入学校校训" />
        </el-form-item>
        <!-- <el-row :gutter="20">
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
        </el-row> -->
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
          <!-- <el-upload
            class="upload"
            action="https://shkt.oss-cn-chengdu.aliyuncs.com"
            :drag="true"
            :multiple="true"
            :file-list="images"
            :http-request="uploadHttp"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            list-type="picture">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
          </el-upload> -->
          <el-upload
            class="upload-demo"
            action="https://shkt.oss-cn-chengdu.aliyuncs.com"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList2"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
          <Map v-on:mapLocationClose="mapLocationClose" v-on:mapLocationSave="mapLocationSave" @getPosition="getPosition" :areaDetail="areaDetail"></Map>
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
import { listSchool, getSchool, delSchool, addSchool, updateSchool, exportSchool, getUploadData,getPositionData } from "@/api/system/school";
import ossClient from '@/utils/aliyun/aliyun.oss.client';
import Map from '@/components/map/baiduMap.vue'
export default {
  name: "School",
  components: { Map },
  data() {
    return {
      fileList2:[],
      mapVisible:false,
      images: [],
      uploadConf: {
        region: null,
        accessKeyId: null,
        accessKeySecret: null,
        bucket: null,
        stsToken: null
      },
      selectImg: "",
      loading: false,
      arr:[],
      num:0,
      value1:[],
      card: {
        id: 0,
        name: "",
        price:0,
        desc:'',
        items:[],
        imgUrl:'',
      },
      aliyun:{},
      allAddress: [],//省市区
      areaDetail: {},
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
      // 表格数据
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
    this.getCityData();
  },
  methods: {
    // beforeAvatarUpload(file) {
    //     const isJPG = file.type === 'image/jpeg';
    //     const isLt2M = file.size / 1024 / 1024 < 2;

    //     if (!isJPG) {
    //       this.$message.error('上传头像图片只能是 JPG 格式!');
    //     }
    //     if (!isLt2M) {
    //       this.$message.error('上传头像图片大小不能超过 2MB!');
    //     }
    //     return isJPG && isLt2M;
    //   },
    //   handleRemove(file, fileList) {
    //     console.log(file, fileList);
    //   },
      handlePreview(file) {
        console.log(file);
      },
    mapLocationClose(){
			this.mapVisible = false
		},
		mapLocationSave(e){
			console.log(e)
		 	this.mapVisible = false
		},
    /** 查询列表 */
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
        schoolStatus: '',
        createTime: null,
        schoolPhone: null,
        fixedPhone: null,
        introduce: null,
        schoolGrade: null,
        updateTime: null,
        schoolArea: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //获取省市区数据
    getCityData() {
      getPositionData().then(response => {
        this.allAddress = response
      });
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
      this.title = "添加";
      // this.uploadInit()
    },
    //管理
    toManage(row){
      this.$router.push({ path: "/class/manage", query: { schoolId: row.schoolId}})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const schoolId = row.schoolId || this.ids
      getSchool(schoolId).then(response => {
        this.form = response.data;
        this.form.schoolType = this.form.schoolType += '';
        this.form.schoolStatus = this.form.schoolStatus += '';
        this.open = true;
        this.title = "修改";
        this.areaDetail = {
          longitude: response.data.longitude,
          latitude: response.data.latitude,
          address: response.data.schoolAddress
        }
      });
      // this.uploadInit()
    },
    /** 提交按钮 */
    submitForm() {
      console.log('123',this.$children)
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
      this.$confirm('是否确认删除编号为"' + schoolIds + '"的数据项?', "警告", {
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
      this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSchool(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    //接受位置信息
    getPosition(val){
      this.form.schoolAddress = val.address;
      console.log('2345',this.form.schoolAddress)
      this.form.longitude = val.longitude;
      this.form.latitude = val.latitude;
    },
    //上传--初始化
    async uploadInit () {
      getUploadData().then(response => {
        console.log('ccccc',response)
        //获取阿里云token  这里是后台返回来的数据
        const aliyun = {
          Region: 'oss-cn-chengdu',
          AccessKeyId: response.accessid,
          AccessKeySecret: 'v2g63zJhYZ2Z6Glua5RVn2fsx9VYAe',
          Bucket: 'shkt',
          SecurityToken: response.signature
        };
        const {Region, AccessKeyId, AccessKeySecret, Bucket, SecurityToken} = aliyun;
        this.uploadConf.region = Region;
        this.uploadConf.accessKeyId = AccessKeyId;
        this.uploadConf.accessKeySecret = AccessKeySecret;
        this.uploadConf.bucket = Bucket;
        this.uploadConf.stsToken = SecurityToken;
        this.aliyun = aliyun
      });
    },
    //图片上传到阿里云
    
    uploadHttp({ file }) {
      // const { imgName } = 'ALIOSS_IMG_';
      const point = file.name.lastIndexOf(".");
      let fileName = file.name.substr(0, point);
      // let date = '202012171130'
      // let fileNames = `${fileName}_${date}${suffix}`
        console.log('3333',fileName)
      // const fileName = `${imgName}/${Date.parse(new Date())}`;  //定义唯一的文件名
      ossClient(this.uploadConf).put(fileName, file, {
        'ContentType': 'image/jpeg'
      }).then(({res, url, name}) => {
        if (res && res.status == 200) {
          console.log(`阿里云OSS上传图片成功回调`, res, url, name);
        }
      }).catch((err) => {
        console.log(`阿里云OSS上传图片失败回调`, err);
      });
    },
    beforeAvatarUpload (file) {
      console.log('22222',file)
            const isJPEG = file.name.split('.')[1] === 'jpeg';
            const isJPG = file.name.split('.')[1] === 'jpg';
            const isPNG = file.name.split('.')[1] === 'png';
            const isLt500K = file.size / 1024 / 500 < 2;
            if (!isJPG && !isJPEG && !isPNG) {
                this.$message.error('上传图片只能是 JPEG/JPG/PNG 格式!');
            }
            if (!isLt500K) {
                this.$message.error('单张图片大小不能超过 500KB!');
            }
            return (isJPEG || isJPG || isPNG) && isLt500K;
        },
    handleRemove (file, fileList) {
            console.log(`移除图片回调`, fileList);
        }

  }
};
</script>
