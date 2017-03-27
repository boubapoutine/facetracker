import { Component, Input, OnDestroy, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FaceTracker } from "./FaceTracker";

@Component({
  selector: 'webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})

export class WebcamComponent implements OnInit, AfterViewInit {

  public track:any;
  public scale:any = 0;
  public rotation:any = 0;
  public posx:any = 0;
  public posy:any = 0;
  private _videosrc: SafeUrl;
  @ViewChild("video") private _videoCamElem: ElementRef;
  @ViewChild("overlay") private _overlay: ElementRef;
  @ViewChild("webgl") private _webgl: ElementRef;
  @ViewChild("mask") private _mask: ElementRef;

  private _constraints: any = {
    video: {
      mandatory: {
        minAspectRatio: 1.333,
        maxAspectRatio: 1.334,
        minFrameRate: 30,
        maxFrameRate: 60,
      }
    }
  };

  constructor(myElement: ElementRef, private sanitizer: DomSanitizer) {

    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    this.startVideo();

  }

  private startVideo() {

    var promise = new Promise<MediaStream>((resolve, reject) => {
      navigator.getUserMedia(this._constraints, (stream) => {
        resolve(stream);
      }, (err) => reject(err));
    }).then((stream) => {
      this._videosrc = this.sanitizer.bypassSecurityTrustResourceUrl( URL.createObjectURL(stream) );
    }).catch(this.logError);

  }

  private ctrack() {
    this.track = new FaceTracker(this._videoCamElem, this._overlay, this._webgl, this._mask, true);
    this.track.startTracke();
  }

  private gotStream(stream: any) {
    stream.getTracks().forEach(function(track: any) {
      track.onended = function() {

      };
    });
  }

  private logError(error: any) {
    console.log(error.name + ": " + error.message);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ctrack();
    this.drawLoop();
  }

  get videosrc(): SafeUrl {
    return this._videosrc;
  }

  set videosrc(videosrc: SafeUrl) {
    this._videosrc = videosrc;
  }

  drawLoop = () =>{
    this.scale = this.track._scale;
    this.rotation = this.track._rotation;
    this.posx = this.track._posx;
    this.posy = this.track._posy;

    requestAnimationFrame(this.drawLoop);
  }

}