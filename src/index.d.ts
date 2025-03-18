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

interface _Pattern {
  /** 用于匹配正面提示词的 regex patt */
  positivePatt: string;
  /** 用于匹配负面提示词的 regex patt */
  negativePatt: string;
  [patt: string]: string | null;
}

interface _WorkspaceConfig extends _AbsConfig {
  /** regex patterns */
  patts: _Pattern;
  /** 存储原始图片的目录相对于工作空间的路径 */
  originPath: string;
  /** 存储缩略图的目录相对于工作空间的路径 */
  thumbPath: string;
  /** 存储所有模型的目录相对于工作空间的路径 */
  modelPath: string;
}
