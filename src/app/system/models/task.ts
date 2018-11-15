export class Task {
  _id?: string;
  actions?: Array<any>[]=[];
  categories?: Array<any>[]=[];
  color?: object;
  comments?: Array<any>[]=[];
  content?: string;
  createdAt?: Date;
  draggable?: boolean;
  end?: Date;
  media?: object;
  public?: boolean;
  published?: boolean;
  recycled?: boolean;
  resizable?: object;
  start?: Date;
  title?: string;
  updated?: Array<any>[]=[];
  user?: object;
}