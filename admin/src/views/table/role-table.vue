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
            <el-button size="small" el-button icon="el-icon-refresh" circle @click="getRoleList" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格列表 -->
    <el-table v-loading="listLoading" :data="role" border stripe row-key="id" highlight-current-row>
      <el-table-column type="selection" :reserve-selection="true" align="center" />
      <el-table-column v-if="false" align="center" prop="id" label="角色ID" sortable />
      <el-table-column v-if="false" align="center" prop="movieId" label="电影ID" sortable />
      <el-table-column align="center" prop="movieName" label="电影名称" width="150px" :show-overflow-tooltip="true" :filters="nameFiltersOptions" filter-placement="bottom-end" :filter-method="filterMovieName">
        <template slot-scope="props">
          <span class="col-cont" v-html="searchKeyColorChange(props.row.movieName)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="角色名称" width="150px">
        <template slot-scope="props">
          <span class="col-cont" v-html="searchKeyColorChange(props.row.name)" />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="left" prop="intro" label="角色描述" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="操作" fixed="right" width="300">
        <template scope="scope">
          <el-button size="small" icon="el-icon-picture" type="success" plain @click="showDrawer(scope.row)">剧照</el-button>
          <el-button size="small" icon="el-icon-edit" type="primary" plain @click="showEditForm(scope.row)">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" plain @click="deleteSingleMedia(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增 -->
    <el-dialog title="新增角色信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="120px">
        <el-form-item label="电影名称" prop="type">
          <el-select v-model="addForm.movieId">
            <el-option v-for="item in options" :key="item.movieId" :label="item.movieName" :value="item.movieId" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name" required>
          <el-input v-model="addForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色描述" prop="intro" required>
          <el-input v-model="addForm.intro" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible=false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog title="编辑角色信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="120px">
        <el-form-item label="电影名称" prop="type">
          <el-select v-model="editForm.movieId">
            <el-option v-for="item in options" :key="item.movieId" :label="item.movieName" :value="item.movieId" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name" required>
          <el-input v-model="editForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色描述" prop="intro" required>
          <el-input v-model="editForm.intro" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible=false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 剧照 -->
    <el-drawer title="剧照" :visible.sync="drawerVisible" direction="rtl">
      <el-divider content-position="center">
        <el-upload
          ref="uploadCover"
          :action="''"
          :before-upload="beforeUploadCover"
          :show-file-list="false"
        >
          <el-link icon="el-icon-edit">更改剧照</el-link>
        </el-upload>
      </el-divider>
      <el-image style="width:auto; height:30vh; padding:20px;" :src="drawerData.drawerHead" fit="scale-down" :preview-src-list="[drawerData.drawerHead]" />
    </el-drawer>
  </div>
</template>

<script>
import { getRoles, createRole, updateRole, deleteRole, uploadRoleImage } from '../../api/movie/role.js'
import { getSimpleMap } from '../../api/movie/movie.js'
export default {
  data() {
    return {
      role: [],
      listLoading: false,
      search: '',
      addFormVisible: false,
      addLoading: false,
      addForm: {
        id: 0,
        movieId: 0,
        movieName: '',
        name: '',
        intro: '',
        headUrl: ''
      },
      editFormVisible: false,
      editLoading: false,
      editForm: {
        id: 0,
        movieId: 0,
        movieName: '',
        name: '',
        intro: '',
        headUrl: ''
      },
      options: [],
      drawerVisible: false,
      drawerData: {
        drawerRoleId: 0,
        drawerHead: '',
        drawerFile: ''
      }
    }
  },
  computed: {
    nameFiltersOptions() {
      var filters = []
      for (var i = 0; i < this.options.length; i++) {
        filters.push({
          text: this.options[i].movieName,
          value: this.options[i].movieName
        })
      }
      return filters
    },
    typeFiltersOptions() {
      var typeSet = new Set()
      var filters = []
      for (var i = 0; i < this.media.length; i++) {
        typeSet.add(this.media[i].type)
      }
      for (const item of typeSet) {
        filters.push({
          text: item,
          value: item
        })
      }
      return filters
    }
  },
  created() {
    this.getMovieMap()
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.listLoading = true
      getRoles('').then((response) => {
        this.role = response.data
        this.listLoading = false
      })
    },
    getMovieMap() {
      getSimpleMap('').then((response) => {
        this.options = response.data
      })
    },
    showAddForm: function() {
      this.addFormVisible = true
      this.addForm = {
        id: 0,
        movieId: 0,
        movieName: '',
        name: '',
        intro: '',
        headUrl: ''
      }
    },
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认添加此条角色信息吗？', '提示', {}).then(() => {
            const data = Object.assign({}, this.addForm)
            createRole(data).then((response) => {
              this.addLoading = false
              this.$message({
                message: '角色信息添加成功!',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getRoleList()
            // eslint-disable-next-line handle-callback-err
            }, (error) => {
              this.addLoading = false
              this.addFormVisible = false
              this.$message.error('新增角色信息失败!')
            })
          })
        }
      })
    },
    showEditForm: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editForm.runtime = parseInt(this.editForm.runtime)
          this.$confirm('确认修改角色信息吗？', '提示', {}).then(() => {
            this.editLoading = true
            const data = Object.assign({}, this.editForm)
            console.log(data)
            updateRole(data).then((response) => {
              this.editLoading = false
              this.$message({
                message: '角色信息修改成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getRoleList()
            // eslint-disable-next-line handle-callback-err
            }, (error) => {
              this.editLoading = false
              this.editFormVisible = false
              this.$message.error('角色信息修改失败!')
            })
          })
        }
      })
    },
    deleteSingleMedia: function(rowId) {
      console.log(rowId)
      this.$confirm('确认删除该条角色信息吗？', '提示', { type: 'warning' }).then(() => {
        this.listLoading = true
        deleteRole(rowId).then((response) => {
          this.listLoading = false
          this.$message({
            message: '角色信息删除成功!',
            type: 'success'
          })
          this.getRoleList()
        // eslint-disable-next-line handle-callback-err
        }, (error) => {
          this.listLoading = false
          this.$message.error('删除角色信息失败')
        })
      }).catch(() => {
        this.$message({
          message: '取消删除操作!',
          type: 'info'
        })
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
    filterMovieName: function(value, row) {
      return row.movieName === value
    },
    showDrawer: function(row) {
      console.log(row)
      this.drawerData.drawerRoleId = parseInt(row.id)
      this.drawerData.drawerHead = row.headUrl
      this.drawerVisible = true
    },
    beforeUploadCover: function(file) {
      const data = new FormData()
      data.append('roleId', this.drawerData.drawerRoleId)
      data.append('file', file)
      uploadRoleImage(data).then((response) => {
        this.$message.success('上传剧照成功')
        this.drawerData.drawerHead = response.data
        console.log(response.data)
      // eslint-disable-next-line handle-callback-err
      }, (error) => {
        this.$message.error('上传剧照失败')
      })
      return false
    }
  }
}
</script>
