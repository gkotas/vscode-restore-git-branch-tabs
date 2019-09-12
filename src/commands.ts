'use strict';
import { commands, Disposable } from 'vscode';
import { DocumentManager } from './documentManager';

export abstract class Command extends Disposable {

    private _disposable: Disposable;

    constructor(command: string) {
        super(() => this.dispose());
        this._disposable = commands.registerCommand(command, this.execute, this);
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    abstract execute(...args: any[]): any;
}

export class ClearCommand extends Command {

    constructor(private documentManager: DocumentManager) {
        super('restoreEditors.clear');
    }

    execute() {
        return this.documentManager.clear();
    }
}
