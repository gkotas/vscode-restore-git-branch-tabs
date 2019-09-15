'use strict';

export const ExtensionKey = 'restoreGitBranchTabs';
export const ExtensionOutputChannelName = 'RestoreGitBranchTabs';

export type BuiltInCommands = 'workbench.action.closeActiveEditor' | 'workbench.action.nextEditor' | 'workbench.action.closeAllEditors';
export const BuiltInCommands = {
    CloseActiveEditor: 'workbench.action.closeActiveEditor' as BuiltInCommands,
    CloseAllEditors: 'workbench.action.closeAllEditors' as BuiltInCommands,
    NextEditor: 'workbench.action.nextEditor' as BuiltInCommands,
};

export type WorkspaceState = 'restoreGitBranchTabs:knownBranches';
export const WorkspaceState = {
    KnownBranches: 'restoreGitBranchTabs:knownBranches' as WorkspaceState
};
