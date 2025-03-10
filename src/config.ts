export class WorkspaceConfig implements WorkspaceConfig {}

export class AppConfig implements _AppConfig {
  darkMode: number = 1;
  watchDirs: string[] = [];
  workspaces: string[] = [];
}

/**
 * **请使用内置方法修改值**
 *
 * 一种基于事务的配置管理机制，在一次保存前，所有读取都发生在原始配置上，所有修改都发生在一个原始配置的副本上
 *
 * 请确保在调用 `save` 方法后进行更新或页面重载
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
  constructor(a: any) {
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

  /**
   * 使用 v 的拷贝(`JSON`)
   */
  set<K extends keyof T>(k: K, v: any) {
    this.latest[k] = JSON.parse(JSON.stringify(v));
  }

  /**
   * 应用修改并返回 JSON 格式化后数据
   */
  save() {
    const a = JSON.stringify(this.latest);
    this.stable = JSON.parse(a);
    return a;
  }

  /**
   * 取消应用所有修改
   */
  cancle() {
    const a = JSON.stringify(this.stable);
    this.latest = JSON.parse(a);
  }
}
