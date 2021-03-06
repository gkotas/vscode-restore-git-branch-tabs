'use strict';
import { ExtensionContext, RelativePattern, workspace } from 'vscode';
import { existsSync, watch }  from 'fs';
import { join, normalize } from 'path';
import { getGitBranch } from './branch';
import { IConfig, defaultIConfig } from './configuration';
import { DocumentManager } from './documentManager';
import { Logger } from './logger';
import { ClearCommand, LoadCommand, SaveCommand } from './commands';
import { ExtensionKey } from './constants';

export function activate(context: ExtensionContext) {
    Logger.configure(context);

    const documentManager = new DocumentManager(context);

    const workspaceFolders = workspace.workspaceFolders;

    if (workspaceFolders)
    {
        let cfg = workspace.getConfiguration().get<IConfig>(ExtensionKey);
        if (cfg === undefined)
        {
            cfg = defaultIConfig;
        }
        let gitPath = cfg.gitFolderLocation;

        if (gitPath === '')
        {
            // Empty path means to disable extension.
            Logger.log('Empty string passed in. Disabling extension');
            return;
        }
        else if (gitPath === '.')
        {
            Logger.log('Passed in dot, using root. for git path');
            gitPath = workspaceFolders[0].uri.fsPath;
        }
        else
        {
            Logger.log('Using passed in path: ', gitPath);
        }

        // Add .git to path
        gitPath = join(gitPath, ".git");

        if (!existsSync(gitPath))
        {
            Logger.log('Git path doesnt exist. Quitting');
            return;
        }

        const headPath = join(gitPath, "HEAD");

        // Detects branch changes by looking at path of HEAD
        watch(gitPath, (event, filename) => {
            if (filename === 'HEAD') {
                Logger.log(`${filename} file Changed`, event);
                updateTabs(documentManager, headPath)
            }
        });

        updateTabs(documentManager, headPath);

        new ClearCommand(documentManager);
        new LoadCommand(documentManager, headPath);
        new SaveCommand(documentManager, headPath);
    }

}

let lastBranch = "";
let lastHeadPath = "";

async function updateTabs(documentManager: DocumentManager, headPath: string) {
    getGitBranch(headPath, async (branch) => {
        if (!branch) return;

        // Branch change occured, save tabs then load new ones
        if (lastBranch != "") {
            await documentManager.save(ExtensionKey + ":" + lastHeadPath + "-" + lastBranch)
            await documentManager.open(ExtensionKey + ":" + headPath + "-" + branch)
        }

        lastBranch = branch;
        lastHeadPath = headPath;
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
