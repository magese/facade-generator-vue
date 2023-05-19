<template>
  <div class="page">
    <div class="page-item">
      <h1>代码生成</h1>
      <div class="container" :class="{'loading': downloadTemplateLoading}">
        <h2>模板下载</h2>
        <p>点击下方按钮下载配置Excel模板</p>
        <p>模板文件：
          <select v-model="templateFilename">
            <option v-for="item in filenameList" :value="item.value">{{ item.key }}</option>
          </select>
        </p>
        <p>文件名称：{{ templateFilename }}</p>
        <p><button @click="downloadTemplate">下载模板</button></p>
      </div>
      <div class="container" :class="{'loading': generateLoading}">
        <h2>实体类生成</h2>
        <p>选择上传实体类配置Excel文件生成代码</p>
        <p><input type="file" name="file" ref="dtoUpload"></p>
        <p><button @click="dtoGenerate">生成代码</button></p>
      </div>
      <div class="container" :class="{'loading': generateLoading}">
        <h2>项目生成</h2>
        <p>选择上传项目配置Excel文件生成代码</p>
        <p><input type="file" name="file" ref="projectUpload"></p>
        <p><button @click="generate">生成代码</button></p>
      </div>
      <div class="container" :class="{'loading': downloadCodeLoading}">
        <h2>下载代码</h2>
        <p>生成代码7天内可根据文件Key不限次下载，超过7天将会被清除</p>
        <p>生成文件Key：<input type="text" v-model="fileKey"></p>
        <p><button @click="downloadCode">下载代码</button></p>
      </div>
    </div>
    <div class="page-item">
      <h1>文件配置</h1>
      <div class="container" :class="{'loading': downloadYmlLoading}">
        <h2>当前环境：{{ selectedEnv }}</h2>
        <p><span class="env-label">sit环境：</span><button class="env-btn" @click="this.selectedEnv = env" v-for="env in sitList">{{ env }}</button></p>
        <p><span class="env-label">uat环境：</span><button class="env-btn" @click="this.selectedEnv = env" v-for="env in uatList">{{ env }}</button></p>
        <p><span class="env-label">dc环境：</span><button class="env-btn" @click="this.selectedEnv = env" v-for="env in dcList">{{ env }}</button></p>
        <p><span class="env-label">sit-vke环境：</span><button class="env-btn" @click="this.selectedEnv = env" v-for="env in sitVkeList">{{ env }}</button></p>
        <p><span class="env-label">uat-vke环境：</span><button class="env-btn" @click="this.selectedEnv = env" v-for="env in uatVkeList">{{ env }}</button></p>
        <p><span class="env-label">pre环境：</span><button class="env-btn" @click="this.selectedEnv = env" v-for="env in preList">{{ env }}</button></p>
      </div>
      <div class="container" :class="{'loading': downloadYmlLoading}">
        <h2>下载示例配置</h2>
        <p>点击下方按钮下载配置yml模板</p>
        <p><button @click="downloadYml">下载配置</button></p>
      </div>
      <div class="container" :class="{'loading': uploadYmlLoading}">
        <h2>上传文件配置</h2>
        <p>选择上传的.yml配置文件</p>
        <p><input type="file" name="file" ref="ymlUpload"></p>
        <p><button @click="uploadYml">上传配置</button></p>
      </div>
    </div>
  </div>
  <div class="container">
    <h2>响应数据</h2>
    <p><json-viewer :value="res" expand-depth="5" copyable boxed/></p>
  </div>
</template>

<script>
import { downloadTemplate, generate, downloadCode, dtoGenerate, downloadYml, uploadYml } from '@/api'
import { download, isBlobResponse } from '@/utils/common'
import { JsonViewer } from 'vue-json-viewer/ssr'

export default {
  name: 'FacadeGenerator',
  data() {
    return {
      templateFilename: 'facade-generator-setting.v2.xlsx',
      filenameList: [
        {key: '实体类生成模板', value: 'facade-generator-setting.v2.xlsx'},
        {key: '项目生成模板', value: 'facade-generator-setting.v1.xlsx'}
      ],
      fileKey: '',
      selectedEnv: 'sit',
      sitList: ['sit', 'sit2', 'sit3'],
      uatList: ['uat', 'uat2', 'uat3'],
      dcList: ['uat4', 'dc2'],
      sitVkeList: ['sit1-vke', 'sit2-vke', 'sit3-vke'],
      uatVkeList: ['uat1-vke', 'uat2-vke', 'uat3-vke'],
      preList: ['pre'],
      ymlFilename: 'lowcode-file-setting.yml',
      downloadTemplateLoading: false,
      generateLoading: false,
      downloadCodeLoading: false,
      downloadYmlLoading: false,
      uploadYmlLoading: false,
      res: {}
    }
  },
  methods: {
    downloadTemplate() {
      this.downloadTemplateLoading = true
      downloadTemplate(this.templateFilename).then(res => {
        this.res = res
        isBlobResponse(res).then(r => {
          download(r.data, this.templateFilename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;')
        }).catch(e => {
          alert(e.msg)
          this.res = e
        })
        this.downloadTemplateLoading = false
      }).catch(e => {
        console.error(e)
        this.res = e
        this.downloadTemplateLoading = false
      })
    },
    dtoGenerate() {
      this.generateLoading = true
      const file = this.$refs.dtoUpload.files[0]
      if(!file) {
        alert('请先选择配置文件')
        this.generateLoading = false
        return
      }

      const data = new FormData()
      data.append('file', file)

      dtoGenerate(data).then(({data, status, headers}) => {
        this.res = {data, status, headers}
        if(data.code !== '000000') {
          alert(data.msg)
          this.generateLoading = false
          return
        }
        this.fileKey = data.data.fileKey
        this.generateLoading = false
      }).catch(e => {
        console.error(e)
        this.res = e
        this.generateLoading = false
      })
    },
    generate() {
      this.generateLoading = true
      const file = this.$refs.projectUpload.files[0]
      if(!file) {
        alert('请先选择配置文件')
        this.generateLoading = false
        return
      }

      const data = new FormData()
      data.append('file', file)

      generate(data).then(({data, status, headers}) => {
        this.res = {data, status, headers}
        if(data.code !== '000000') {
          alert(data.msg)
          this.generateLoading = false
          return
        }
        this.fileKey = data.data.fileKey
        this.generateLoading = false
      }).catch(e => {
        console.error(e)
        this.res = e
        this.generateLoading = false
      })
    },
    downloadCode() {
      this.downloadCodeLoading = true
      downloadCode(this.fileKey).then(res => {
        this.res = res
        isBlobResponse(res).then(r => {
          download(r.data, this.fileKey, 'application/zip;')
        }).catch(e => {
          alert(e.msg)
          this.res = e
        })
        this.downloadCodeLoading = false
      }).catch(e => {
        console.error(e)
        this.res = e
        this.downloadCodeLoading = false
      })
    },
    downloadYml() {
      this.downloadYmlLoading = true
      downloadYml(this.selectedEnv).then(res => {
        this.res = res
        isBlobResponse(res).then(r => {
          download(r.data, this.ymlFilename, 'text/yml;charset=utf-8')
        }).catch(e => {
          alert(e.msg)
          this.res = e
        })
        this.downloadYmlLoading = false
      }).catch(e => {
        console.error(e)
        this.res = e
        this.downloadYmlLoading = false
      })
    },
    uploadYml() {
      this.uploadYmlLoading = true
      const file = this.$refs.ymlUpload.files[0]
      if(!file) {
        alert('请先选择yml文件')
        this.uploadYmlLoading = false
        return
      }

      const data = new FormData()
      data.append('file', file)

      uploadYml(this.selectedEnv, data).then(({data, status, headers}) => {
        this.res = {data, status, headers}
        if(data.code !== '000000') {
          alert(data.msg)
          this.uploadYmlLoading = false
          return
        }
        this.uploadYmlLoading = false
      }).catch(e => {
        console.error(e)
        this.res = e
        this.uploadYmlLoading = false
      })
    }
  },
  components: {JsonViewer}
}
</script>

<style scoped>
h2 {
  font-size: 18px;
  margin: 10px 0;
}

.page {
  display: flex;
  justify-content: space-evenly;
}

.page-item {
  padding: 15px 30px;
  border: 2px #364a5f solid;
  border-radius: 10px;
}

.container {
  height: auto;
  width: 500px;
  font-size: 14px;
  margin: 40px auto;
  padding: 15px 20px;
  text-align: left;
  border: 2px #364a5f dashed;
  border-radius: 10px;
}

.loading {
  position: relative;
  filter: blur(1px);
}
.loading:after {
  content: 'loading...';
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #364a5f;
  border-radius: 10px;
  background: rgba(204, 204, 204, 0.30);
}

.env-btn {
  width: 70px;
  margin-right: 7px;
}

.env-label {
  display: inline-block;
  width: 90px;
}
</style>
