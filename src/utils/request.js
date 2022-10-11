import axios from 'axios'

const service = axios.create({
  timeout: 30000,
  baseURL: 'http://11.113.0.179:8001'
})

export default service
