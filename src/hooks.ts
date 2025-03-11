import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

import { invoke } from "@tauri-apps/api/core";

export function useRaw<T>(
  file: string | undefined,
  encode: (v: T) => string,
  decode: (v: string) => T
) {
  const queryClient = useQueryClient();

  // 读取函数
  const fetchConfig = async (): Promise<T> => {
    return invoke<string>("read_text", { file }).then((v) => decode(v));
  };

  // 保存函数
  const saveConfig = async (config: T): Promise<void> => {
    return invoke<string>("write_text", {
      file,
      cont: encode(config),
    }).then();
  };

  const QK = ["config", file];
  // 查询数据
  const query = useQuery({
    queryKey: QK,
    queryFn: fetchConfig,
  });

  const mutation = useMutation({
    mutationFn: saveConfig,
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
    v: query.data,
    q: query,
    m: mutation,

    updateData: (newData: T) => {
      debouncedSave(newData);
    },
  };
}

export function useJson<T>(file: string | undefined) {
  return useRaw<T>(file, JSON.stringify, JSON.parse);
}
