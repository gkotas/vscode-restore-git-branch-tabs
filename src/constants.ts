'use strict';

export const ExtensionKey = 'gitBranchTabs';
export const ExtensionOutputChannelName = 'GitBranchTabs';

export type BuiltInCommands = 'workbench.action.closeActiveEditor' | 'workbench.action.nextEditor' | 'workbench.action.closeAllEditors';
export const BuiltInCommands = {
    CloseActiveEditor: 'workbench.action.closeActiveEditor' as BuiltInCommands,
    CloseAllEditors: 'workbench.action.closeAllEditors' as BuiltInCommands,
    NextEditor: 'workbench.action.nextEditor' as BuiltInCommands,
};

export type WorkspaceState = 'gitBranchTabs:knownBranches';
export const WorkspaceState = {
    KnownBranches: ExtensionKey + ':knownBranches' as WorkspaceState
};
