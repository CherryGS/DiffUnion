interface _AbsConfig {
  /** Unix 秒，作为版本标识符 */
  time: number;
}
interface _AppConfig extends _AbsConfig {
  /** 是否启用夜间模式 0/1 */
  darkMode: number;
  /** 程序监测的目录，作为库的输入端口之一 */
  watchDirs: string[];
  /** 库的目录，每一个库的内容独立 */
  workspaces: string[];
}

interface WorkspaceConfig {}
