import { useQuery } from "@tanstack/react-query";

import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";

import { useJson } from "./hooks";

export const useGlobalConfig = () => {
  const dataDir = useQuery({
    queryKey: ["dataDir"],
    queryFn: async () => {
      try {
        const file = (await appDataDir()) + "/dataFolder.txt";
        const res = await invoke<string>("cmd_read_text", { file });
        return res;
      } catch (e) {
        return Promise.reject(`${e}`);
      }
    },
  });
  const config = useJson<AppConfig>(dataDir.data + "/config.json");

  return { config, dataDir };
};

export const useWorkspaceConfig = () => {};

export function clone_and_change<T>(x: T, o: Partial<T>): T {
  return { ...JSON.parse(JSON.stringify(x)), ...o };
}

export const time = () => {
  return Date.now();
};

type ExifJson = Array<
  | { SourceFile: string; Parameters?: string; workflow?: string }
  | { [k: string]: string }
>;

/**
 * 获取给定路径的文件的 metadata
 * @param paths 文件或文件夹名称，对于文件夹会递归获取其内文件
 */
export const extract_metadata = async (paths: string[]): Promise<ExifJson> => {
  const command = Command.sidecar(String.raw`bin/exif-tool`, [
    `${paths.join(" ")}`,
    "-j",
    "-r",
  ]);
  try {
    const res = await command.execute();
    return JSON.parse(res.stdout);
  } catch (e) {
    console.error(command);
    throw e;
  }
};

/**
 * 将文件 `file` 加入到位于 `path` 的工作空间中
 * @param path workspace 路径
 * @param file image 文件路径
 */
export const to_workspace = (path: string, file: string) => {};
