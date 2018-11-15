export class Category {
  _id?: string;
  title?: string;
  content?: string;
  createdAt?: Date;
  public?: boolean;
  published?: boolean;
  start?: Date;
  end?: Date;
  media?: object;
  user?: object;
  updated?: Array<any>[]=[];
  comments?: Array<any>[]=[];
  recycled?: boolean;
}