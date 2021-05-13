import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }
	
	camera(s = 'camera', q = 90, rt = 'uri', ae = false, stg = true) {
	  return Camera.getPhoto({
	    quality: q,
	    allowEditing: ae,
	    resultType: rt == 'uri'? CameraResultType.Uri : rt == 'base64'? CameraResultType.Base64 : CameraResultType.DataUrl,
	    saveToGallery: stg,
	    source: s == 'camera'? CameraSource.Camera : s == 'camera'? CameraSource.Photos : CameraSource.Prompt
	  });
	}
}
