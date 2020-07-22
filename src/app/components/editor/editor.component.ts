import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DocumentService } from 'src/app/services/document.service';
import { DocumentPreview } from 'src/app/models/DocumentPreview';
import { ModalService } from 'src/app/services/modal.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IDocument } from 'src/app/models/Document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveDocumentDialogComponent } from '../dialogs/remove-document-dialog/remove-document-dialog.component';
import { AddDocumentDialogComponent } from '../dialogs/add-document-dialog/add-document-dialog.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {

  //Text editor
  public editor = ClassicEditor;
  public model = {
    editorData: '',
    isReadOnly: true,
    config: {
      placeholder: 'Type the content here!',
    }
  }

  //University subject
  public subjectId: Number = 0;
  public authorId: Number = 0;

  //Tree
  treeControl = new NestedTreeControl<IDocument>(node => node.children);
  dataSource = new MatTreeNestedDataSource<IDocument>();
  hasChild = (_: number, node: IDocument) => !!node.children && node.children.length > 0;

  //Node
  public currentNodeHasChild = false;
  public currentNodeId: Number = 0;
  public currentDocument: DocumentPreview;

  //Add new document
  public newDocument: DocumentPreview;

  //Search
  public searchField = "";

  constructor(private _bookService: DocumentService, private _modalService: ModalService, public dialog: MatDialog) {}

  ngOnInit() {
    this.subjectId = 1;
    this.newDocument = new DocumentPreview(0, '', '', 0, 0, 0, '');
    this.reloadTree();
  }

  //TREE
  reloadTree() {
    this._bookService.getDocumentTreeBySubjectId(this.subjectId).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  onActivateTreeNodeEvent(node) {
    this._bookService.getContent(node.id).subscribe(doc => {
      this.model.editorData = doc.text;
      this.currentDocument = doc;
    })
    this.currentNodeHasChild = node.children.length > 0;
    this.currentNodeId = node.id;
    this.model.isReadOnly = true;
  }

  // DOCUMENT
  editDocument(event) {
    if(!this.currentNodeHasChild && this.currentNodeId != 0){
      this.model.isReadOnly = false;
    }
  }

  editStructure(document) {
    if(document.id != 0) {
      this.openAddDialog(document);
    }
  }

  saveDocument(event) {
    this.currentDocument.text = this.model.editorData;
    this._bookService.saveDocument(this.currentDocument).subscribe(res => {
      this.reloadTree();
      this.model.isReadOnly = true;
    });
  }

  openRemoveDialog(document = undefined): void {
    const dialogRef = this.dialog.open(RemoveDocumentDialogComponent, {
      data: { id: document.id, name: document.name }
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      this._bookService.removeDocument(newDocument).subscribe(res => {
        this.reloadTree();
      });
    });
  }

  openAddDialog(document?, parentId?): void {
    var data = {};

    if(document) {
      data = {
        id: document.id,
        name: document.name,
        description: document.description,
        text: document.text,
        authorId: document.authorId,
        parentId: document.parentId,
        subjectId: document.subjectId
      };
    }
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      if(newDocument) {
        if(newDocument.id == undefined || newDocument.id == 0) {
          newDocument.id == 0
          newDocument.text = "";
          newDocument.subjectId = this.subjectId;
          newDocument.authorId = this.authorId;
          newDocument.parentId = this.currentNodeId;
        }
        this._bookService.saveDocument(newDocument).subscribe(res => {
          this.reloadTree();
        });;
      }
    });
  }
}
