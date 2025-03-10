export class WorkspaceConfig implements WorkspaceConfig {}

export class AppConfig implements AppConfig {
  darkMode: boolean = false;
  watchDirs: string[] = [];
  workspaces: string[] = [];
}

/**
 * 一种基于事务的配置管理机制，在一次保存前，所有读取都发生在原始配置上，所有修改都发生在一个原始配置的副本上
 *
 * 根据机制，应该在保存发生时重载设置相关页面
 */
export class ConfigManager<T> {
  latest: T;
  stable: T;

  /**
   * 根据传入数据类型初始化：
   *
   *  `string` -> 调用 `JSON.parse` 解析
   *
   *  `others` -> 先调用 `JSON.stringify` 格式化，再调用 `JSON.parse` 解析
   */
  constructor(a: T) {
    switch (typeof a) {
      case "string": {
        this.latest = JSON.parse(a);
        this.stable = JSON.parse(a);
        break;
      }
      default: {
        const res = JSON.stringify(a);
        this.latest = JSON.parse(res);
        this.stable = JSON.parse(res);
      }
    }
  }

  get<K extends keyof T>(k: K) {
    return this.stable[k];
  }

  set<K extends keyof T>(k: K, v: any) {
    this.latest[k] = v;
  }

  /**
   * 应用修改并返回 JSON 格式化后数据
   */
  save() {
    const res = JSON.stringify(this.latest);
    this.stable = JSON.parse(res);
    return res;
  }
}
