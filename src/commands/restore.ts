'use strict';
import { Command, Commands } from '../commands';
import { DocumentManager } from '../documentManager';

export class RestoreCommand extends Command {

    constructor(private documentManager: DocumentManager) {
        super(Commands.Restore);
    }

    execute(key: string) {
        return this.documentManager.open(key, true);
    }
}
