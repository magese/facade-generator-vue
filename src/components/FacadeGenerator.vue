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
      <h1>常用工具</h1>
      <div class="container" :class="{'loading': rsaLoading}">
        <h2>RSA密钥生成</h2>
        <p>
          <label for="rsa-length">密钥长度：</label>
          <input type="number" id="rsa-length" v-model="rsaLength" style="width: 100px">
          <button @click="this.rsaKeyGenerate">生成密钥对</button>
        </p>
        <p>公钥</p>
        <textarea rows="3" style="width: 100%" readonly v-model="rsaPublicKey"/>
        <p>私钥</p>
        <textarea rows="7" style="width: 100%" readonly v-model="rsaPrivateKey"/>
      </div>
      <div class="container" :class="{'loading': fileDownloadLoading}">
        <h2>常用文件下载</h2>
        <div><button class="file-btn" @click="this.fileDownload(fileDown)" v-for="fileDown in fileDownList">{{ fileDown.name }}</button></div>
      </div>
      <div class="container" :class="{'loading': fileUploadLoading}">
        <h2>文件上传</h2>
        <p>选择上传的文件</p>
        <p><input type="file" name="file" ref="uploadFile"></p>
        <p>选择输入上传swift或sftp的文件名</p>
        <p><input type="text" v-model="uploadFileName" style="width: 100%" /></p>
        <p>
          <button @click="this.fileUpload('swift')">上传swift</button>
          <button @click="this.fileUpload('sftp')" style="margin-left: 10px">上传sftp</button>
        </p>
        <p>保存路径</p>
        <p><input type="text" v-model="resFilePath" readonly style="width: 100%" /></p>
      </div>
    </div>
  </div>
  <div class="container" ref="responseContainer">
    <h2>响应数据</h2>
    <p><json-viewer :value="res" :expand-depth="5" copyable boxed/></p>
  </div>
</template>

<script>
import { downloadTemplate, generate, downloadCode, dtoGenerate, rsaGenerate, fileDownload, fileUploadSwift, fileUploadSftp } from '@/api'
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
      ymlFilename: 'lowcode-file-setting.yml',
      rsaLength: 2048,
      rsaPublicKey: '',
      rsaPrivateKey: '',
      fileDownList: [
        {name: '身份证正面-03.jpg', value: '03.jpg', type: 'image/jpg'},
        {name: '身份证反面-70.jpg', value: '70.jpg', type: 'image/jpg'},
        {name: '人脸照-40.jpg', value: '40.jpg', type: 'image/jpg'},
        {name: '客户知情确认书-128.pdf', value: '128.pdf', type: 'application/pdf'},
        {name: '个人征信授权书-129.pdf', value: '129.pdf', type: 'application/pdf'},
        {name: '授信合同-216.pdf', value: '216.pdf', type: 'application/pdf'},
        {name: '借款合同-220.pdf', value: '220.pdf', type: 'application/pdf'},
        {name: '绑卡协议-230.pdf', value: '230.pdf', type: 'application/pdf'},
        {name: '担保合同-273.pdf', value: '273.pdf', type: 'application/pdf'}
      ],
      uploadFileName: '',
      resFilePath: '',
      downloadTemplateLoading: false,
      generateLoading: false,
      downloadCodeLoading: false,
      rsaLoading: false,
      fileDownloadLoading: false,
      fileUploadLoading: false,
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
      }).catch(e => this.onError(e))
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
      }).catch(e => this.onError(e))
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
      }).catch(e => this.onError(e))
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
      }).catch(e => this.onError(e))
    },
    rsaKeyGenerate() {
      this.rsaLoading = true
      const data = {keyLength: this.rsaLength}

      rsaGenerate(data).then(({data, status, headers}) => {
        this.res = {data, status, headers}
        if(data.code !== '000000') {
          alert(data.msg)
          this.rsaLoading = false
          return
        }
        this.rsaPublicKey = data.data.publicKey
        this.rsaPrivateKey = data.data.privateKey
        this.rsaLoading = false
      }).catch(e => this.onError(e))
    },
    fileDownload(fileDown) {
      this.fileDownloadLoading = true
      fileDownload(fileDown.value).then(res => {
        this.res = res
        isBlobResponse(res).then(r => {
          download(r.data, fileDown.name, fileDown.type)
        }).catch(e => {
          alert(e.msg)
          this.res = e
        })
        this.fileDownloadLoading = false
      }).catch(e => this.onError(e))
    },
    fileUpload(type) {
      this.fileUploadLoading = true
      this.resFilePath = ''
      const file = this.$refs.uploadFile.files[0]
      if(!file) {
        alert('请先选择文件')
        this.fileUploadLoading = false
        return
      }

      const data = new FormData()
      data.append('file', file)

      switch(type) {
        case 'swift':
          fileUploadSwift(this.uploadFileName, data).then(({data, status, headers}) => {
            this.res = {data, status, headers}
            if(data.code !== '000000') {
              alert(data.msg)
            }
            this.resFilePath = data.data
            this.fileUploadLoading = false
          }).catch(e => this.onError(e))
          break
        case 'sftp':
          fileUploadSftp(this.uploadFileName, data).then(({data, status, headers}) => {
            this.res = {data, status, headers}
            if(data.code !== '000000') {
              alert(data.msg)
            }
            this.resFilePath = data.data
            this.fileUploadLoading = false
          }).catch(e => this.onError(e))
          break
        default:
          alert('未知的上传文件类型')
          return
      }
    },
    onError(e) {
      console.error(e)
      alert(e.message)
      this.res = e
      this.downloadTemplateLoading = false
      this.generateLoading = false
      this.downloadCodeLoading = false
      this.rsaLoading = false
      this.fileDownloadLoading = false
      this.fileUploadLoading = false
      this.scrollToBottom()
    },
    scrollToBottom() {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }, 500)
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

.file-btn {
  width: 160px;
  margin-right: 5px;
  margin-top: 10px;
}
</style>
