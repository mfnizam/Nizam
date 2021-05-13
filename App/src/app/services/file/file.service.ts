import { Injectable } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private fileChooser: FileChooser) {}

  file(mime){
  	return this.fileChooser.open({ mime: mime })
  }
}
