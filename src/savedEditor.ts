'use strict';
import { TextDocumentShowOptions, TextEditor, Uri, ViewColumn, window, workspace } from 'vscode';
import { Logger } from './logger';

export interface ISavedEditor {
    uri: Uri;
    viewColumn: ViewColumn;

    toString: () => string;
}

export class SavedEditor {

    uri: Uri;
    viewColumn: ViewColumn;

    constructor(savedEditor: ISavedEditor) {
        this.uri = savedEditor.uri;
        this.viewColumn = savedEditor.viewColumn;
    }

    toString = () : string => {
        return `SavedEditor (${this.uri.fsPath})`;
    }

    async open() {
        const defaults: TextDocumentShowOptions = {
            viewColumn: this.viewColumn,
            preserveFocus: true,
            preview: false
        };

        Logger.log(`SavedEditor.open: Opening this SavedEditor <${this}> which has this uri <${this.uri.toJSON()}> and fspath <${this.uri.fsPath}>`);

        openEditor(this.uri, defaults);
    }
}

async function openEditor(uri: Uri, options: TextDocumentShowOptions): Promise<TextEditor | undefined> {
    try {
        const document = await workspace.openTextDocument(uri);
        return window.showTextDocument(document, options);
    }
    catch (ex) {
        Logger.error(ex, 'openEditor');
        return undefined;
    }
}
