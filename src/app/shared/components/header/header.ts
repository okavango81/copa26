import { Component } from '@angular/core';
import {StickerService} from '../../../core/service/sticker-service';
import {AsyncPipe} from '@angular/common';
import {MenuModal} from '../menu-modal/menu-modal';

@Component({
  selector: 'app-header',
  imports: [
    MenuModal
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(public service: StickerService) {}
}
