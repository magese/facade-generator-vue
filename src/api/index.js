import request from '@/utils/request'

export function downloadTemplate(filename) {
  return request({
    url: `/generator/download/template/${filename}`,
    responseType: 'blob',
    headers: {'Accept': 'application/octet-stream, application/json, text/plain, */*'},
    method: 'get'
  })
}

export function generate(data) {
  return request({
    url: '/generator/generate',
    method: 'post',
    data: data
  })
}

export function downloadCode(fileKey) {
  return request({
    url: `/generator/download/code/${fileKey}`,
    responseType: 'blob',
    headers: {'Accept': 'application/octet-stream, application/json, text/plain, */*'},
    method: 'get'
  })
}
