import { useQuery } from "@tanstack/react-query";

import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";

import { AppConfig } from "./config";
import { useJson } from "./hooks";

export const useGlobalConfig = () => {
  const dataDir = useQuery({
    queryKey: ["dataDir"],
    queryFn: async () => {
      try {
        const file = (await appDataDir()) + "/dataFolder.txt";
        const res = await invoke<string>("read_text", { file });
        return res;
      } catch (e) {
        return Promise.reject(`${e}`);
      }
    },
  });
  const config = useJson<AppConfig>(dataDir.data + "/config.json");

  return { config, dataDir };
};

export function clone_and_change<T>(x: T, o: Partial<T>): T {
  return { ...x, ...o };
}

export const time = () => {
  return Date.now();
};
