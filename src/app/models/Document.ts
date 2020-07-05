export class Document {
  constructor(public id: Number, public name: string, public children?: Document[]) {
  }

  hasChild(): boolean {
    return this.children.length > 0;
  }
}
export interface IDocument {
  id: Number;
  name: string;
  children?: IDocument[];
}
