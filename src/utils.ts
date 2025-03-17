import { useQuery } from "@tanstack/react-query";

import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";

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
  return { ...JSON.parse(JSON.stringify(x)), ...o };
}

export const time = () => {
  return Date.now();
};

export const extract_img_metadata = async (file: string) => {
  const command = Command.sidecar(String.raw`bin/exif-tool`, [`${file}`, "-j"]);
  try {
    const res = await command.execute();
    return res.stdout.slice(1, -3);
  } catch (e) {
    console.error(command);
    throw e;
  }
};
