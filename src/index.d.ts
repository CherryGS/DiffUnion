/** regex patterns for extracting image metadata */
interface Pattern {
  positive: string;
  negative: string;
  sampler: string;
  scheduler: string;
  steps: string;
  cfg: string;
  seed: string;
  clipSkip: string;
  model: string;
  modelHash: string;
  /** 该项在 postive 中匹配 */
  lora: string;
  loraHash: string;
  custom: { [k: string]: string };
}

/** 工作空间设置 */
interface LibConfig {
  /** regex patterns */
  patts: Pattern;
  /** 存储原始图片的目录相对于工作空间的路径 */
  originPath: string;
  /** 存储缩略图的目录相对于工作空间的路径 */
  thumbPath: string;
  /** 存储所有模型的目录相对于工作空间的路径 */
  modelPath: string;
}

/** 应用设置 */
interface AppConfig {
  /** Unix 秒，作为版本标识符 */
  time: number;
  /** 是否启用夜间模式 0/1 */
  darkMode: number;
  /** 程序监测的目录，作为库的输入端口之一 */
  watchDirs: string[];
  /** 工作空间相关的设置 */
  workspace: LibConfig;
}
