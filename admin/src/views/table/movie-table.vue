<template>
  <div class="app-container">
    <!-- 顶端工具栏 -->
    <el-row :gutter="0" type="flex">
      <el-col class="toolbar">
        <el-form :inline="true">
          <el-form-item label="筛选">
            <el-input v-model="search" class="search" size="medium" placeholder="请输入关键字" prefix-icon="el-icon-search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button size="medium" el-button icon="el-icon-plus" plain @click="showAddForm">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="small" el-button icon="el-icon-refresh" circle @click="getMoviesList" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格列表 -->
    <el-table v-loading="listLoading" :data="movies" border stripe highlight-current-row fit row-key="id">
      <el-table-column type="selection" :reserve-selection="true" align="center" />
      <el-table-column v-if="false" align="center" prop="id" label="电影ID" sortable />
      <el-table-column align="center" prop="chName" label="中文名称">
        <template slot-scope="props">
          <span class="col-cont" v-html="searchKeyColorChange(props.row.chName)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="jpName" label="日文名称">
        <template slot-scope="props">
          <span class="col-cont" v-html="searchKeyColorChange(props.row.jpName)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="runtime" label="影片时长/分钟" sortable />
      <el-table-column align="center" prop="releaseDate" label="上映日期" sortable />
      <el-table-column align="center" prop="slogan" label="宣传标语" :show-overflow-tooltip="true" />
      <el-table-column v-if="false" align="center" prop="intro" label="电影简介" />
      <el-table-column align="center" label="操作" fixed="right" width="310">
        <template scope="scope">
          <el-button size="small" icon="el-icon-picture" type="success" plain @click="showDrawer(scope.row)">封面与海报</el-button>
          <el-button size="small" icon="el-icon-edit" type="primary" plain @click="showEditForm(scope.row)">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" plain @click="deleteSingleMovie(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增 -->
    <el-dialog title="新增电影信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="120px" :rules="addFormRules">
        <el-form-item label="中文名称" prop="chName">
          <el-input v-model="addForm.chName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="日文名称" prop="jpName">
          <el-input v-model="addForm.jpName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="影片时长/分钟" prop="runtime">
          <el-input v-model="addForm.runtime" auto-complete="off" @input.native="addIdInputRestrict" />
        </el-form-item>
        <el-form-item label="上映日期" prop="releaseDate">
          <el-date-picker
            v-model="addForm.releaseDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy年MM月dd日"
          />
        </el-form-item>
        <el-form-item label="宣传标语" prop="slogan">
          <el-input v-model="addForm.slogan" auto-complete="off" />
        </el-form-item>
        <el-form-item label="内容介绍" prop="intro">
          <el-input
            v-model="addForm.intro"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="详细内容" prop="plot">
          <el-input
            v-model="addForm.plot"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible=false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑电影信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-form-item label="中文名称" prop="chName">
          <el-input v-model="editForm.chName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="日文名称" prop="jpName">
          <el-input v-model="editForm.jpName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="影片时长/分钟" prop="runtime">
          <el-input v-model="editForm.runtime" auto-complete="off" @input.native="editIdInputRestrict" />
        </el-form-item>
        <el-form-item label="上映日期" prop="releaseDate">
          <el-date-picker
            v-model="editForm.releaseDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy年MM月dd日"
          />
        </el-form-item>
        <el-form-item label="宣传标语" prop="slogan">
          <el-input v-model="editForm.slogan" auto-complete="off" />
        </el-form-item>
        <el-form-item label="内容介绍" prop="intro">
          <el-input
            v-model="editForm.intro"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="详细内容" prop="plot">
          <el-input
            v-model="editForm.plot"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible=false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
    <el-drawer title="封面与海报" :visible.sync="drawerVisible" direction="rtl">
      <el-divider content-position="center">
        <el-upload
          ref="uploadCover"
          :action="''"
          :before-upload="beforeUploadCover"
          :show-file-list="false"
        >
          <el-link icon="el-icon-edit">更改封面</el-link>
        </el-upload>
      </el-divider>
      <el-image style="width:auto; height:30vh; padding:20px;" :src="drawerData.drawerCover" fit="scale-down" :preview-src-list="[drawerData.drawerCover]" :z-index="2" />
      <el-divider content-position="center">
        <el-upload
          ref="uploadPoster"
          action="''"
          :before-upload="beforeUploadPoster"
          :show-file-list="false"
        >
          <el-link icon="el-icon-edit">更改海报</el-link>
        </el-upload>
      </el-divider>
      <el-image style="width:auto; height:30vh; padding:20px" :src="drawerData.drawerPoster" fit="scale-down" :preview-src-list="[drawerData.drawerPoster]" :z-index="1" />
    </el-drawer>
  </div>
</template>
<script>
import { getMovies, createMovie, deleteMovie, updateMovie, uploadCoverImage, uploadPosterImage } from '../../api/movie/movie.js'
import { checkNameInput } from '../../utils/myUtil.js'
export default {
  data() {
    var nameInputRestrict = (rule, value, callback) => {
      if (!checkNameInput(value)) {
        callback(new Error('名称中不可含有数字和特殊字符!'))
      } else {
        callback()
      }
    }
    return {
      movies: [],
      listLoading: false,
      search: '',
      // 新增表格
      addFormVisible: false,
      addLoading: false,
      addForm: {
        id: 0,
        chName: '',
        jpName: '',
        slogan: '',
        intro: '',
        runtime: 0,
        releaseYear: 0,
        releaseDate: '',
        coverUrl: '',
        posterUrl: '',
        plot: ''
      },
      addFormRules: {
        chName: [
          { required: true, message: '请输入电影中文名称', trigger: 'blur' },
          { validator: nameInputRestrict, trigger: 'blur' }
        ],
        jpName: [
          { required: true, message: '请输入电影日文名称', trigger: 'blur' },
          { validator: nameInputRestrict, trigger: 'blur' }
        ],
        runtime: [
          { required: true, message: '请输入电影时长', trigger: 'blur' }
        ],
        releaseDate: [
          { required: true, message: '请选择电影上映日期', trigger: 'blur' }
        ]
      },
      // 编辑表格
      editFormVisible: false,
      editLoading: false,
      editForm: {
        id: 0,
        chName: '',
        jpName: '',
        slogan: '',
        intro: '',
        runtime: 0,
        releaseYear: 0,
        releaseDate: '',
        coverUrl: '',
        posterUrl: '',
        plot: ''
      },
      editFormRules: {
        chName: [
          { required: true, message: '请输入电影中文名称', trigger: 'blur' },
          { validator: nameInputRestrict, trigger: 'blur' }
        ],
        jpName: [
          { required: true, message: '请输入电影日文名称', trigger: 'blur' },
          { validator: nameInputRestrict, trigger: 'blur' }
        ],
        runtime: [
          { required: true, message: '请输入电影时长', trigger: 'blur' }
        ],
        releaseDate: [
          { required: true, message: '请选择电影上映日期', trigger: 'blur' }
        ]
      },
      // 封面与海报
      drawerVisible: false,
      drawerData: {
        drawerMovieId: 0,
        drawerCover: '',
        drawerPoster: '',
        drawerFile: ''
      }
    }
  },
  mounted() {
    this.getMoviesList()
  },
  methods: {
    // 获取电影信息列表
    getMoviesList() {
      this.listLoading = true
      getMovies('').then((response) => {
        this.movies = response.data
        this.listLoading = false
      })
    },
    // 限制时长只能为数字
    addIdInputRestrict() {
      this.$nextTick(() => {
        if (this.addForm.runtime !== null) {
          this.addForm.runtime = this.addForm.runtime.replace(/[^\d]/g, '')
        }
      })
    },
    // 限制时长只能为数字
    editIdInputRestrict() {
      this.$nextTick(() => {
        if (this.editForm.runtime !== null) {
          this.editForm.runtime = this.editForm.runtime.replace(/[^\d]/g, '')
        }
      })
    },
    showAddForm: function() {
      this.addFormVisible = true
      this.addForm = {
        id: 0,
        chName: '',
        jpName: '',
        slogan: '',
        intro: '',
        runtime: '',
        releaseYear: '',
        releaseDate: '',
        coverUrl: '',
        posterUrl: '',
        plot: ''
      }
    },
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认添加此条电影信息吗？', '提示', {}).then(() => {
            this.addForm.releaseDate = this.addForm.releaseDate.toString()
            this.addForm.runtime = parseInt(this.addForm.runtime)
            this.addForm.releaseYear = parseInt(this.addForm.releaseDate.substr(0, 4))
            const data = Object.assign({}, this.addForm)
            console.log(data)
            createMovie(data).then((response) => {
              this.addLoading = false
              this.$message({
                message: '电影信息添加成功!',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getMoviesList()
            // eslint-disable-next-line handle-callback-err
            }, (error) => {
              this.addLoading = false
              this.addFormVisible = false
              this.$message.error('新增电影信息失败!')
            })
          })
        }
      })
    },
    deleteSingleMovie: function(rowId) {
      console.log(rowId)
      this.$confirm('确认删除该条电影信息吗？', '提示', { type: 'warning' }).then(() => {
        this.listLoading = true
        deleteMovie(rowId).then((response) => {
          this.listLoading = false
          this.$message({
            message: '电影信息删除成功!',
            type: 'success'
          })
          this.getMoviesList()
        // eslint-disable-next-line handle-callback-err
        }, (error) => {
          this.listLoading = false
          this.$message.error('删除电影信息失败')
        })
      }).catch(() => {
        this.$message({
          message: '取消删除操作!',
          type: 'info'
        })
      })
    },
    showEditForm: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      console.log(this.editForm)
    },
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editForm.runtime = parseInt(this.editForm.runtime)
          this.$confirm('确认修改电影信息吗？', '提示', {}).then(() => {
            this.editLoading = true
            const data = Object.assign({}, this.editForm)
            console.log(data)
            updateMovie(data).then((response) => {
              this.editLoading = false
              this.$message({
                message: '电影信息修改成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getMoviesList()
            // eslint-disable-next-line handle-callback-err
            }, (error) => {
              this.editLoading = false
              this.editFormVisible = false
              this.$message.error('电影信息修改失败!')
            })
          })
        }
      })
    },
    searchKeyColorChange(val) {
      val = val + ''
      if (val.indexOf(this.search) !== -1 && this.search !== '') {
        return val.replace(this.search, '<font color="#409EFF">' + this.search + '</font>')
      } else {
        return val
      }
    },
    showDrawer: function(row) {
      console.log(row)
      this.drawerData.drawerMovieId = parseInt(row.id)
      this.drawerData.drawerCover = row.coverUrl
      this.drawerData.drawerPoster = row.posterUrl
      this.drawerVisible = true
    },
    beforeUploadCover: function(file) {
      const data = new FormData()
      data.append('movieId', this.drawerData.drawerMovieId)
      data.append('file', file)
      uploadCoverImage(data).then((response) => {
        this.$message.success('上传封面成功')
        console.log(response.data)
        this.drawerData.drawerCover = response.data
      // eslint-disable-next-line handle-callback-err
      }, (error) => {
        this.$message.error('上传封面失败')
      })
      return false
    },
    beforeUploadPoster: function(file) {
      const data = new FormData()
      data.append('movieId', this.drawerData.drawerMovieId)
      data.append('file', file)
      uploadPosterImage(data).then((response) => {
        this.$message.success('上传海报成功')
        console.log(response.data)
        this.drawerData.drawerPoster = response.data
      // eslint-disable-next-line handle-callback-err
      }, (error) => {
        this.$message.error('上传海报失败')
      })
      return false
    }
  }
}
</script>
