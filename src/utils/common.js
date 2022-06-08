/**
 * 下载文件
 * @param res 文件二进制流
 * @param filename 文件名称
 * @param type 文件类型
 */
export function download(res, filename, type) {
  const blob = new Blob([res], {type})
  let url = window.URL.createObjectURL(blob)
  let a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}


export function isBlobResponse(response) {
  return new Promise((resolve, reject) => {
    if(response.headers['content-type'].includes('json')) {
      // 此处拿到的data才是blob
      const {data} = response
      const reader = new FileReader()
      reader.onload = () => {
        const {result} = reader
        const errorInfos = JSON.parse(result)
        reject(errorInfos)
      }
      reader.readAsText(data)
    } else {
      resolve(response)
    }
  })
}
