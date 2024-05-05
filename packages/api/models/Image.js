
module.exports = class Image {
  constructor (state) {
    if (state) {
      Object.assign(this, state)
    }
  }

  getUrl (imageSize) {
    if (this[imageSize]) {
      return this[imageSize]
    } else if (this.original) {
      return this.original
    } else {
      return null
    }
  }
}
