// export class AppConfig implements _AppConfig {
//   time: number = 0;
//   darkMode: number = 1;
//   watchDirs: string[] = [];
//   workspace: _WorkspaceConfig = WorkspaceConfig;
// }

// class WorkspaceConfig implements _WorkspaceConfig {
//   time: number = 0;
//   patts: _Pattern = {
//     positive: "(?s)^.+?(?=Negative prompt)",
//     negative: "(?ms)(?<=Negative prompt:).+?(?=^[A-Z]+[a-z ]+:)",
//   };
//   originPath: string = "/origin";
//   thumbPath: string = "/thumb";
//   modelPath: string = "/model";
// }

const defaultPattern: Pattern = {
  positive: "(?s)^.+?(?=Negative prompt)",
  negative: "(?ms)(?<=Negative prompt:).+?(?=^[A-Z]+[a-z ]+:)",
  sampler: "(?<=Sampler:).+?}(?=,)",
  scheduler: "(?<=Schedule type:).+?}(?=,)",
  steps: "(?<=Steps:).+?}(?=,)",
  cfg: "(?<=CFG scale:).+?}(?=,)",
  seed: "(?<=Seed:).+?}(?=,)",
  clipSkip: "(?<=Clip skip:).+?}(?=,)",
  model: "(?<=Model:).+?}(?=,)",
  modelHash: "(?<=Model hash:).+?}(?=,)",
  lora: "(?<=<lora:).+?(?=:.+>)",
  loraHash: "",
  custom: {},
};

const defaultLibConfig: LibConfig = {
  patts: defaultPattern,
  originPath: "",
  thumbPath: "",
  modelPath: "",
};
export const defaultAppConfig: AppConfig = {
  time: 0,
  darkMode: 0,
  watchDirs: [],
  workspace: defaultLibConfig,
};
