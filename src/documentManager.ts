'use strict';
import { commands, Disposable, ExtensionContext, TextEditor, window } from 'vscode';
import { ActiveEditorTracker } from './activeEditorTracker';
import { TextEditorComparer } from './comparers';
import { WorkspaceState, BuiltInCommands } from './constants';
import { Logger } from './logger';
import { ISavedEditor, SavedEditor } from './savedEditor';

export class DocumentManager extends Disposable {

    constructor(private context: ExtensionContext) {
        super(() => this.dispose());
    }

    dispose() { }

    clear() {
        let knownBranches = this.context.workspaceState.get<string[]>(WorkspaceState.KnownBranches, []);
        Logger.log('Deleting the known branches:', knownBranches);

        knownBranches.forEach((branch) => {
            this.context.workspaceState.update(branch, undefined);
        });

        this.context.workspaceState.update(WorkspaceState.KnownBranches, undefined);
    }

    get(key: string): SavedEditor[] {
        const data = this.context.workspaceState.get<ISavedEditor[]>(key);
        return (data && data.map(_ => new SavedEditor(_))) || [];
    }

    async open(key: string) {
        try {
            const editors = this.get(key);

            await commands.executeCommand(BuiltInCommands.CloseAllEditors);

            if (!editors.length) return;

            for (const editor of editors) {
                await editor.open();
            }
        }
        catch (ex) {
            Logger.error(ex, 'DocumentManager.open');
        }
    }

    async save(key: string) {
        try {
            const editorTracker = new ActiveEditorTracker();

            let active = window.activeTextEditor;
            let editor = active;
            const openEditors: TextEditor[] = [];
            do {
                if (editor != null) {
                    // If we didn't start with a valid editor, set one once we find it
                    if (active === undefined) {
                        active = editor;
                    }

                    openEditors.push(editor);
                }

                editor = await editorTracker.awaitNext(500);
                if (editor !== undefined && openEditors.some(_ => TextEditorComparer.equals(_, editor, { useId: true, usePosition: true }))) break;
            } while (!TextEditorComparer.equals(active, editor, { useId: true, usePosition: true }));

            editorTracker.dispose();

            const editors = openEditors
                .filter(_ => _.document !== undefined)
                .map(_ => {
                    return {
                        uri: _.document.uri,
                        viewColumn: _.viewColumn
                    } as ISavedEditor;
                });

            this.context.workspaceState.update(key, editors);

            let knownBranches: string[];
            knownBranches = this.context.workspaceState.get<string[]>(WorkspaceState.KnownBranches, []);

            if (knownBranches.indexOf(key) < 0) {
                knownBranches.push(key);
                this.context.workspaceState.update(WorkspaceState.KnownBranches, knownBranches);
            }
        }
        catch (ex) {
            Logger.error(ex, 'DocumentManager.save');
        }
    }
}
