export class StickerModel {
  constructor(
    public number: number,
    public has: boolean,
    public duplicates: number,
    public isPressing: boolean = false
  ) {
  }
}
