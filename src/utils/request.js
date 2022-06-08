import axios from 'axios'

const service = axios.create({
  timeout: 30000,
  baseURL: 'http://11.113.0.179:8080'
  // baseURL: 'http://127.0.0.1:8080'
})

export default service
