import { GlobalConfig } from "#bind/GlobalConfig";
import { createContext } from "react";

export const defaultGlobalConfig: GlobalConfig = {
  struc: {
    base: "",
    backup: "",
    config: "",
    database: "",
    media: "",
    model: "",
    thumbnail: "",
  },
};
export const ReadonlyConfig = createContext<GlobalConfig>(defaultGlobalConfig);

export const defaultPattern: Pattern = {
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
