export class DocumentPreview {
  constructor(
      public id: Number,
      public name: string,
      public text: string,
      public authorId: Number,
      public parentId: Number,
      public subjectId: Number,
      public description: string) {
  }
}
