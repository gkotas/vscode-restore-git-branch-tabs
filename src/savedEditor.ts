'use strict';
import { TextDocumentShowOptions, TextEditor, Uri, ViewColumn, window, workspace } from 'vscode';
import { Logger } from './logger';

export interface ISavedEditor {
    fsPath: string;
    viewColumn: ViewColumn;
}

export class SavedEditor {

    fsPath: string;
    viewColumn: ViewColumn;

    constructor(savedEditor: ISavedEditor) {
        this.fsPath = savedEditor.fsPath;
        this.viewColumn = savedEditor.viewColumn;
    }

    toString = () : string => {
        return `SavedEditor{fsPath:${this.fsPath};viewColumn:${this.viewColumn}}`;
    }

    async open() {
        const defaults: TextDocumentShowOptions = {
            viewColumn: this.viewColumn,
            preserveFocus: true,
            preview: false
        };

        Logger.log(`SavedEditor.open: Opening this <${this}>`);

        openEditor(this.fsPath, defaults);
    }
}

async function openEditor(fsPath: string, options: TextDocumentShowOptions): Promise<TextEditor | undefined> {
    try {
        const document = await workspace.openTextDocument(fsPath);
        return window.showTextDocument(document, options);
    }
    catch (ex) {
        Logger.error(ex, 'openEditor');
        return undefined;
    }
}
