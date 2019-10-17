'use strict';
import { OutputLevel } from './logger';

export interface IConfig {
    newBranchPreserveTabs: boolean;
    debug: boolean;
    outputLevel: OutputLevel;
}
