'use strict';
import { commands, Disposable, ExtensionContext, TextEditor, window } from 'vscode';
import { ActiveEditorTracker } from './activeEditorTracker';
import { TextEditorComparer } from './comparers';
import { WorkspaceState } from './constants';
import { Logger } from './logger';
import { ISavedEditor, SavedEditor } from './savedEditor';

export * from './savedEditor';

export class DocumentManager extends Disposable {

    constructor(private context: ExtensionContext) {
        super(() => this.dispose());
    }

    dispose() { }

    clear() {
        this.context.workspaceState.update('/home/jerry/Github/test/.git/HEAD-MyBranch', undefined);
        this.context.workspaceState.update('/home/jerry/Github/test/.git/HEAD-master', undefined);
    }

    get(key: string): SavedEditor[] {
        const data = this.context.workspaceState.get<ISavedEditor[]>(key);
        return (data && data.map(_ => new SavedEditor(_))) || [];
    }

    async open(key: string, restore: boolean = false) {
        try {
            const editors = this.get(key);

            if (restore) {
                // Close all opened documents
                await commands.executeCommand('workbench.action.closeAllEditors');
            }

            if (!editors.length) return;

            console.log("Opening editors:", editors);

            for (const editor of editors) {
                await editor.open({ preview: false });
            }
        }
        catch (ex) {
            Logger.error(ex, 'DocumentManager.restore');
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
            } while ( !TextEditorComparer.equals(active, editor, { useId: true, usePosition: true }));

            editorTracker.dispose();

            const editors = openEditors
                .filter(_ => _.document !== undefined)
                .map(_ => {
                    return {
                        uri: _.document.uri.fsPath,
                        viewColumn: _.viewColumn
                    } as ISavedEditor;
                });

            console.log("Saved files:", editors);

            this.context.workspaceState.update(key, editors);
        }
        catch (ex) {
            Logger.error(ex, 'DocumentManager.save');
        }
    }
}
