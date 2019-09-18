'use strict';
import { commands, Disposable } from 'vscode';
import { DocumentManager } from './documentManager';
import { ExtensionKey } from './constants';
import { getGitBranch } from './branch';

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
        super('restoreGitBranchTabs.clear');
    }

    execute() {
        return this.documentManager.clear();
    }
}

export class LoadCommand extends Command {

    constructor(private documentManager: DocumentManager, private headPath: string) {
        super('restoreGitBranchTabs.load');
    }

    execute() {
        getGitBranch(this.headPath, (branch) => {
            this.documentManager.open(ExtensionKey + ":" + this.headPath + "-" + branch)
        });
    }
}

export class SaveCommand extends Command {

    constructor(private documentManager: DocumentManager, private headPath: string) {
        super('restoreGitBranchTabs.save');
    }

    execute() {
        getGitBranch(this.headPath, (branch) => {
            this.documentManager.save(ExtensionKey + ":" + this.headPath + "-" + branch)
        });
    }
}
