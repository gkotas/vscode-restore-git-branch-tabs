'use strict';
import { TextDocumentShowOptions, TextEditor, Uri, ViewColumn, window, workspace } from 'vscode';
import { Logger } from './logger';

export interface ISavedEditor {
    uri: Uri;
    viewColumn: ViewColumn;
}

export class SavedEditor {

    uri: Uri;
    viewColumn: ViewColumn;

    constructor(savedEditor: ISavedEditor) {
        this.uri = savedEditor.uri;
        this.viewColumn = savedEditor.viewColumn;
    }

    async open(options?: TextDocumentShowOptions) {
        const defaults: TextDocumentShowOptions = {
            viewColumn: this.viewColumn,
            preserveFocus: true,
            preview: true
        };

        openEditor(this.uri, { ...defaults, ...(options || {}) });
    }
}

export async function openEditor(uri: Uri, options?: TextDocumentShowOptions): Promise<TextEditor | undefined> {
    try {
        const defaults: TextDocumentShowOptions = {
            preserveFocus: false,
            preview: true,
            viewColumn: (window.activeTextEditor && window.activeTextEditor.viewColumn) || 1
        };

        const document = await workspace.openTextDocument(uri);
        return window.showTextDocument(document, { ...defaults, ...(options || {}) });
    }
    catch (ex) {
        Logger.error(ex, 'openEditor');
        return undefined;
    }
}
