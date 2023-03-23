import { Component, OnInit, ViewChild } from '@angular/core';
import { DesktopCapturerSource, SourcesOptions } from 'electron';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sources: DesktopCapturerSource[] = [];
  selectedSource: DesktopCapturerSource | undefined;
  videostream: any;
  @ViewChild('videoElement', { static: true }) videoElement: any;
  video: any;


  title = 'electron-app';
  constructor(private _electronService: ElectronService) { }


  ngOnInit() {
    this.video = this.videoElement.nativeElement;
  }

  async displaySources() {
    if (this._electronService.isElectronApp) {

      const options: SourcesOptions = {
        types: ['window', 'screen'],
        fetchWindowIcons: true
      }
      console.log('this._electronService :>> ', this._electronService.desktopCapturer);
      this.sources = await this._electronService.desktopCapturer
        .getSources(options);
    }
  }

  selectSource(source: DesktopCapturerSource) {
    this.selectedSource = source;
  }

  takeScreenshot() {

    let nav = <any>navigator;

    if (this.selectedSource) {
      nav.webkitGetUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: this.selectedSource.id,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      }, (stream: any) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = (e: any) => this.video.play()

      }, () => {
        console.log('getUserMediaError');
      });
    }

    return;

  }
}
