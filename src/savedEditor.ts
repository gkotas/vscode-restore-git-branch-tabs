'use strict';
import { TextDocumentShowOptions, Uri, ViewColumn } from 'vscode';
import { openEditor } from './commands';

export interface ISavedEditor {
    uri: string;
    viewColumn: ViewColumn;
}

export class SavedEditor {

    uri: string;
    viewColumn: ViewColumn | undefined;

    constructor(savedEditor: ISavedEditor);
    constructor(uri: string, viewColumn: ViewColumn);
    constructor(savedEditorOrUri: ISavedEditor | string, viewColumn?: ViewColumn) {
        if (typeof savedEditorOrUri === 'string') {
            this.uri = Uri.parse(savedEditorOrUri).fsPath;
            this.viewColumn = viewColumn;
        }
        else {
            if (typeof savedEditorOrUri.uri === 'string') {
                this.uri = Uri.parse(savedEditorOrUri.uri).fsPath;
            }
            // else if (savedEditorOrUri.uri instanceof Uri) {
            //     this.uri = savedEditorOrUri.uri.fsPath;
            // }
            else {
                // this.uri = new Uri().with(savedEditorOrUri.uri);
                this.uri = Uri.file(savedEditorOrUri.uri).fsPath;
            }
            this.viewColumn = savedEditorOrUri.viewColumn;
        }
    }

    async open(options?: TextDocumentShowOptions) {
        const defaults: TextDocumentShowOptions = {
            viewColumn: this.viewColumn,
            preserveFocus: true,
            preview: true
        };

        openEditor(Uri.file(this.uri), { ...defaults, ...(options || {}) });
    }
}
