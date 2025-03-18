export class AppConfig implements _AppConfig {
  time: number = 0;
  darkMode: number = 1;
  watchDirs: string[] = [];
  workspaces: string[] = [];
}

export class WorkspaceConfig implements _WorkspaceConfig {
  time: number = 0;
  patts: _Pattern = {
    positivePatt: "(?s)^.+?(?=Negative prompt)",
    negativePatt: "(?ms)(?<=Negative prompt:).+?(?=^[A-Z]+[a-z ]+:)",
  };
  originPath: string = "/origin";
  thumbPath: string = "/thumb";
  modelPath: string = "/model";
}
