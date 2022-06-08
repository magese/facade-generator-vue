import request from '@/utils/request'

export function downloadTemplate(filename) {
  return request({
    url: `/generator/download/template/${filename}`,
    responseType: 'blob',
    method: 'get'
  })
}

export function generate(data) {
  return request({
    url: '/generator/generate',
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    method: 'post',
    data: data
  })
}

export function downloadCode(fileKey) {
  return request({
    url: `/generator/download/code/${fileKey}`,
    responseType: 'blob',
    method: 'get'
  })
}
