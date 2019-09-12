'use strict';
import { ExtensionContext, RelativePattern, workspace } from 'vscode';
import { join } from 'path';
import { readFile }  from 'fs';
import { DocumentManager } from './documentManager';
import { Logger } from './logger';
import { ClearCommand } from './commands';
import { ExtensionKey} from './constants';

export function activate(context: ExtensionContext) {
	Logger.configure(context);

	const documentManager = new DocumentManager(context);

    const workspaceFolders = workspace.workspaceFolders;

    if (workspaceFolders)
    {
        const gitPath = join(workspaceFolders[0].uri.fsPath, ".git");
        const headPath = join(gitPath, "HEAD");
        const pattern = new RelativePattern(workspaceFolders[0], ".git/HEAD");
        const watcher = workspace.createFileSystemWatcher(pattern);

        // Detects branch changes by looking at path of HEAD
        watcher.onDidChange(e => {
            updateTabs(documentManager, headPath)
		});

		updateTabs(documentManager, headPath);

        new ClearCommand(documentManager);
    }

}

let lastBranch = "";
let lastHeadPath = "";

function updateTabs(documentManager: DocumentManager, headPath: string): void {
    readFile(headPath, "utf-8", async (err, data) => {
        if (!err) {
            // Parse the HEAD file to get branch name
            const line = data.split(/\r\n|\r|\n/)[0];
            const branch = line.split("/").pop();

            if (!branch) return;

			// Branch change occured, save tabs then load new ones
			if (lastBranch != "") {
                await documentManager.save(ExtensionKey + ":" + lastHeadPath + "-" + lastBranch)
				await documentManager.open(ExtensionKey + ":" + headPath + "-" + branch)
            }

			lastBranch = branch;
			lastHeadPath = headPath;
        } else {
            Logger.error(err, 'Extension:updateTabs');
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
