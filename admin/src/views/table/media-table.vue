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
            <el-button size="small" el-button icon="el-icon-refresh" circle @click="getMediaList" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格列表 -->
    <el-table v-loading="listLoading" :data="media" border stripe row-key="id" highlight-current-row>
      <el-table-column type="selection" :reserve-selection="true" align="center" />
      <el-table-column v-if="false" align="center" prop="id" label="媒体ID" sortable />
      <el-table-column v-if="false" align="center" prop="movieId" label="电影ID" sortable />
      <el-table-column align="center" prop="movieName" label="电影名称" width="150px" :show-overflow-tooltip="true" :filters="nameFiltersOptions" filter-placement="bottom-end" :filter-method="filterMovieName">
        <template slot-scope="props">
          <span class="col-cont" v-html="searchKeyColorChange(props.row.movieName)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="媒体类型" sortable width="150px" :filters="typeFiltersOptions" filter-placement="bottom-end" :filter-method="filterTypeName">
        <template slot-scope="props">
          <span class="col-cont" v-html="searchKeyColorChange(props.row.type)" />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="left" prop="siteUrl" label="媒体链接" :show-overflow-tooltip="true">
        <template slot-scope="props">
          <el-link type="info">{{ props.row.siteUrl }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template scope="scope">
          <el-button size="small" icon="el-icon-edit" type="primary" plain @click="showEditForm(scope.row)">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" plain @click="deleteSingleMedia(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增 -->
    <el-dialog title="新增媒体信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="120px">
        <el-form-item label="电影名称" prop="type">
          <el-select v-model="addForm.movieId">
            <el-option v-for="item in options" :key="item.movieId" :label="item.movieName" :value="item.movieId" />
          </el-select>
        </el-form-item>
        <el-form-item label="媒体类型" prop="type">
          <el-input v-model="addForm.type" auto-complete="off" />
        </el-form-item>
        <el-form-item label="媒体链接" prop="siteUrl">
          <el-input v-model="addForm.siteUrl" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible=false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog title="编辑媒体信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="120px">
        <el-form-item label="电影名称" prop="type">
          <el-select v-model="editForm.movieId">
            <el-option v-for="item in options" :key="item.movieId" :label="item.movieName" :value="item.movieId" />
          </el-select>
        </el-form-item>
        <el-form-item label="媒体类型" prop="type">
          <el-input v-model="editForm.type" auto-complete="off" />
        </el-form-item>
        <el-form-item label="媒体链接" prop="siteUrl">
          <el-input v-model="editForm.siteUrl" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible=false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMedia, createMedia, updateMedia, deleteMedia } from '../../api/movie/media.js'
import { getSimpleMap } from '../../api/movie/movie.js'
export default {
  data() {
    return {
      media: [],
      listLoading: false,
      search: '',
      addFormVisible: false,
      addLoading: false,
      addForm: {
        id: 0,
        movieId: 0,
        movieName: '',
        type: '',
        siteUrl: ''
      },
      editFormVisible: false,
      editLoading: false,
      editForm: {
        id: 0,
        movieId: 0,
        movieName: '',
        type: '',
        siteUrl: ''
      },
      options: []
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
    this.getMediaList()
  },
  methods: {
    getMediaList() {
      this.listLoading = true
      getMedia('').then((response) => {
        this.media = response.data
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
        type: '',
        siteUrl: ''
      }
    },
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认添加此条媒体信息吗？', '提示', {}).then(() => {
            const data = Object.assign({}, this.addForm)
            createMedia(data).then((response) => {
              this.addLoading = false
              this.$message({
                message: '媒体信息添加成功!',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getMediaList()
            // eslint-disable-next-line handle-callback-err
            }, (error) => {
              this.addLoading = false
              this.addFormVisible = false
              this.$message.error('新增媒体信息失败!')
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
          this.$confirm('确认修改媒体信息吗？', '提示', {}).then(() => {
            this.editLoading = true
            const data = Object.assign({}, this.editForm)
            console.log(data)
            updateMedia(data).then((response) => {
              this.editLoading = false
              this.$message({
                message: '媒体信息修改成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getMediaList()
            // eslint-disable-next-line handle-callback-err
            }, (error) => {
              this.editLoading = false
              this.editFormVisible = false
              this.$message.error('媒体信息修改失败!')
            })
          })
        }
      })
    },
    deleteSingleMedia: function(rowId) {
      console.log(rowId)
      this.$confirm('确认删除该条媒体信息吗？', '提示', { type: 'warning' }).then(() => {
        this.listLoading = true
        deleteMedia(rowId).then((response) => {
          this.listLoading = false
          this.$message({
            message: '媒体信息删除成功!',
            type: 'success'
          })
          this.getMediaList()
        // eslint-disable-next-line handle-callback-err
        }, (error) => {
          this.listLoading = false
          this.$message.error('删除媒体信息失败')
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
    filterTypeName: function(value, row) {
      return row.type === value
    }
  }
}
</script>
