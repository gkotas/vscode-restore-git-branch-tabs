'use strict';
import { readFile }  from 'fs';
import { Logger } from './logger';

export function getGitBranch(headPath: string, callback: (branch: string | undefined) => void) {
    readFile(headPath, "utf-8", (err, data) => {
        if (!err) {
            // Parse the HEAD file to get branch name
            const line = data.split(/\r\n|\r|\n/)[0];
            const branch = line.split("/").pop();
            Logger.log(`getGitBranch: Got branch <${branch}>`);
            callback(branch);

        } else {
            Logger.error(err, 'Extension:getGitBranch');
        }
    });
}
