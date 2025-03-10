interface AppConfig {
  /** 是否启用夜间模式 */
  darkMode: boolean;
  /** 程序监测的目录，作为库的输入端口之一 */
  watchDirs: string[];
  /** 库的目录，每一个库的内容独立 */
  workspaces: string[];
}

interface WorkspaceConfig {}
