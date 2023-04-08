export interface UnicornType {
  name: string;
  ip: string;
  type: 'cosmic' | 'galactic';
  dataUrl: string | undefined;
  dataRgbaArray: number[] | undefined,
}