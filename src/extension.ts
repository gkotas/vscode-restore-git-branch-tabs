// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { DocumentManager } from './documentManager';
import { Logger } from './logger';
import { ClearCommand, OpenCommand, RestoreCommand, SaveCommand } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "git-branch-tabs" is now active!');

	Logger.configure(context);

	const documentManager = new DocumentManager(context);

    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders)
    {
        const gitPath = path.join(workspaceFolders[0].uri.fsPath, ".git");
        const headPath = path.join(gitPath, "HEAD");
        const pattern = new vscode.RelativePattern(workspaceFolders[0], ".git/HEAD");
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);
        // Detects branch changes by looking at path of HEAD
        watcher.onDidChange(e => {
            console.log(".git/HEAD change detected");
            updateTabs(documentManager, headPath)
		});

		updateTabs(documentManager, headPath);
    }
    else
    {
        console.log("No workspace");

	}

	new RestoreCommand(documentManager);
    new SaveCommand(documentManager);
    new ClearCommand(documentManager);
}

let lastBranch = "";
let lastHeadPath = "";

function updateTabs(documentManager: DocumentManager, headPath: string): void {
    fs.readFile(headPath, "utf-8", (err, data) => {
        if (!err) {
            const line = data.split(/\r\n|\r|\n/)[0];
			const branch = line.split("/").pop();
			if (!branch) {
				console.log("Git branch undefined");
				return;
			}
			console.log("Moved to branch " + branch);

			// Branch change occured, save tabs then load new ones
			if (lastBranch != "") {
				console.log("Saving tabs for branch:", lastHeadPath + "-" + lastBranch);
				// stuff

				documentManager.save(lastHeadPath + "-" + lastBranch)
					.then(function () {
						console.log("Loading tabs for branch:", headPath + "-" + branch);
						documentManager.open(headPath + "-" + branch, true)
					})
				// vscode.commands.executeCommand('restoreEditors.save', lastHeadPath + "-" + lastBranch)





				// documentManager.open(headPath + "-" + branch, true)
				// vscode.commands.executeCommand('restoreEditors.restore', headPath + "-" + branch)

			}




			lastBranch = branch;
			lastHeadPath = headPath;
        } else {
            console.log("Error getting git branch");
            console.log(err);
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
