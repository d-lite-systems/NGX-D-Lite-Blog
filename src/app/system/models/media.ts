export class Media {
  _id?: string;
  title?: string;
  content?: string;
  createdAt?: Date;
  public?: boolean;
  url?: string;
  published?: boolean;
  start?: Date;
  end?: Date;
  user?: object;
  updated?: Array<any>[]=[];
  comments?: Array<any>[]=[];
  recycled?: boolean;
}