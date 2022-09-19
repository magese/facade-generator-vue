import request from '@/utils/request'

export function downloadTemplate(filename) {
  return request({
    url: `/generator/download/template/${filename}`,
    responseType: 'blob',
    headers: {'Accept': 'application/octet-stream, application/json, text/plain, */*'},
    method: 'get'
  })
}

export function dtoGenerate(data) {
  return request({
    url: '/generator/dto/generate',
    method: 'post',
    data: data
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

export function downloadYml(env) {
  return request({
    url: `/lcd/${env}/config/template-download`,
    responseType: 'blob',
    headers: {'Accept': 'application/octet-stream, application/json, text/plain, */*'},
    method: 'get'
  })
}

export function uploadYml(env, data) {
  return request({
    url: `/lcd/${env}/upload`,
    method: 'post',
    data: data
  })
}
