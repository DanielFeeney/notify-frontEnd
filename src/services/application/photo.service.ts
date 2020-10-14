import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;

export class PhotoService {

  public photo : string

  public async addNewToGallery() {
    // Take a photo
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    this.photo = imageUrl;
  }
}