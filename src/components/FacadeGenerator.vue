<template>
  <div class="container" :class="{'loading': downloadTemplateLoading}">
    <h2>模板下载</h2>
    <p>文件名称：<input type="text" v-model="templateFilename"></p>
    <p><button @click="downloadTemplate">下载配置模板</button></p>
  </div>
  <div class="container" :class="{'loading': generateLoading}">
    <h2>代码生成</h2>
    <p><input type="file" name="file" ref="upload"></p>
    <p><button @click="generate">生成代码</button></p>
  </div>
  <div class="container" :class="{'loading': downloadCodeLoading}">
    <h2>下载代码</h2>
    <p>生成文件Key：<input type="text" v-model="fileKey"></p>
    <p><button @click="downloadCode">下载代码</button></p>
  </div>
  <div class="container">
    <h2>响应数据</h2>
    <p><json-viewer :value="res" expand-depth="5" copyable boxed/></p>
  </div>
</template>

<script>
import { downloadTemplate, generate, downloadCode } from '@/api'
import { download, isBlobResponse } from '@/utils/common'
import { JsonViewer } from 'vue-json-viewer/ssr'

export default {
  name: 'FacadeGenerator',
  data() {
    return {
      templateFilename: 'facade-generator-setting.v1.xlsx',
      fileKey: '',
      downloadTemplateLoading: false,
      generateLoading: false,
      downloadCodeLoading: false,
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
    generate() {
      this.generateLoading = true
      const file = this.$refs.upload.files[0]
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

</style>
