import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

import { invoke } from "@tauri-apps/api/core";

export function useRaw<T>(
  file: string,
  encode: (v: T) => string,
  decode: (v: string) => T
) {
  const queryClient = useQueryClient();

  // 读取函数
  const fetch = async (): Promise<T> => {
    const v = await invoke<string>("cmd_read_text", { file });
    return decode(v);
  };

  // 保存函数
  const save = async (config: T): Promise<void> => {
    await invoke<string>("cmd_write_text", {
      file,
      cont: encode(config),
    });
  };

  // 查询键
  const QK = [file];

  // 查询数据
  const query = useQuery({
    queryKey: QK,
    queryFn: fetch,
  });

  const mutation = useMutation({
    mutationFn: save,
    // 当修改进行中时启用乐观更新
    onMutate: async (v) => {
      await queryClient.cancelQueries({ queryKey: QK });
      const prev = queryClient.getQueryData(QK);
      queryClient.setQueryData(QK, v);
      return { prev, v };
    },
    // 修改失败时回滚到上一次
    onError: (_err, _v, cont) => {
      queryClient.setQueryData(QK, cont === undefined ? undefined : cont.prev);
    },
    // 成功或是失败后重新获取值
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    },
  });

  // 去抖动保存
  const debouncedSave = useRef(
    debounce((data: T) => {
      mutation.mutate(data);
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    d: query.data,
    q: query,
    m: mutation,
    qc: queryClient,

    update: (newData: T) => {
      debouncedSave(newData);
    },
  };
}

export function useJson<T>(file: string) {
  return useRaw<T>(file, JSON.stringify, JSON.parse);
}
