import Jimp from 'jimp'

export default class PhotoService {
  public async compressImage(imagePath) {
    const image = await Jimp.read(imagePath)
    return image.resize(480, 480).quality(60).write(imagePath)
  }
}
