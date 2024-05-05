const promiseBatchByChunks = (elems, promise, chunkSize) => {
  const chunks = Array.from({ length: Math.ceil(elems.length / chunkSize) }, (v, i) => {
    return elems.slice(i * chunkSize, i * chunkSize + chunkSize)
  })
  const promises = []
  chunks.forEach((chunk, index) => {
    const chunkRequest = promise(chunk, index)
    promises.push(chunkRequest)
  })

  return promises
}

const sortArrayByProperty = (array, property, order = "asc") => {
  return array.sort(function (a, b) {
    if (a[property] < b[property]) {
      return -1
    }
    if (a[property] > b[property]) {
      return 1
    }
    return 0
  })
}
const currentDate = (params) => {
  if (params) {
    return new Date(params)
  }
  // return new Date(Date.now() + (1000 * 3600 * 24))
  return new Date()
}

export { promiseBatchByChunks, currentDate, sortArrayByProperty }
