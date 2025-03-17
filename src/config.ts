export class WorkspaceConfig implements WorkspaceConfig {}

export class AppConfig implements _AppConfig {
  time: number = 0;
  darkMode: number = 1;
  watchDirs: string[] = [];
  workspaces: string[] = [];
}
