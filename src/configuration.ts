'use strict';
import { OutputLevel } from './logger';

export interface IConfig {
    newBranchPreserveTabs: boolean;
    gitFolderLocation: string;
    debug: boolean;
    outputLevel: OutputLevel;
}

export const defaultIConfig: IConfig = {
    newBranchPreserveTabs: false,
    gitFolderLocation: '',
    debug: false,
    outputLevel: 'silent'
}
