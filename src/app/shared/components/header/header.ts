import { Component } from '@angular/core';
import {StickerService} from '../../../core/service/sticker-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(public service: StickerService) {}
}
