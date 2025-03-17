import { LRUCache } from "lru-cache";
import { useEffect, useState } from "react";

import {
  Card,
  Divider,
  Image,
  ImagePreview,
  JsonViewer,
  SideSheet,
} from "@douyinfe/semi-ui";

import { convertFileSrc, invoke } from "@tauri-apps/api/core";

import "./ImageBoard.css";
import { extract_img_metadata, useGlobalConfig } from "./utils";

const cache = new LRUCache<string, string[]>({
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: () => {
    return 1;
  },

  // how long to live in ms
  ttl: 1000 * 60 * 5,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
});

export const ImageBoard = () => {
  const [imgList, setImgList] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [imgOnClick, setImgOnClick] = useState("");
  const { config, dataDir: _ } = useGlobalConfig();
  const [imgJson, setImgJson] = useState(`{"unknown": "unknown"}`);

  useEffect(() => {
    const k = JSON.stringify(config.d?.watchDirs);
    const v = cache.get(k);
    if (cache.has(k) && v !== undefined) {
      setImgList(v);
      return;
    }

    console.log(`获取 watchDirs 内图片中\n ${config.d?.watchDirs}`);
    // console.log(`↓ ${Date.now()}`);
    invoke<string[]>("find_files_by_ext", {
      paths: config.d?.watchDirs,
      exts: ["jpg", "jpeg", "png"],
    }).then((res) => {
      setImgList(res);
      cache.set(k, res);
      // console.log(`↑ ${Date.now()}`);
    });
  }, [config.d?.watchDirs]);

  return (
    <>
      <SideSheet
        visible={visible}
        onCancel={() => setVisible(false)}
        width="30%"
        closeOnEsc={true}
      >
        <Card>
          <Image
            src={imgOnClick}
            style={{
              width: "100%",
              textAlign: "center",
              aspectRatio: "1/1",
              background: `url(${imgOnClick}) no-repeat center center`,
              border: `2px solid ${config.d?.darkMode ? "#fff" : "#000"}`,
            }}
            imgStyle={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              backdropFilter: "blur(8px)",
            }}
          />
          <Divider margin="20px" children="INFO" />
          <JsonViewer
            options={{ autoWrap: true }}
            value={imgJson}
            width={"100%"}
          />
        </Card>
      </SideSheet>

      {/* 这里不能直接调用 `style` 所以用 `class+css` */}
      <ImagePreview className={"ImageBoard"}>
        {imgList.map((path) => (
          <Image
            key={path}
            src={convertFileSrc(path)}
            preview={false}
            onClick={async (e) => {
              setImgOnClick(e.target.currentSrc);
              setVisible(true);
              const json = await extract_img_metadata(path);
              await invoke("extract_img_info", { file: path });
              console.log(json);
              setImgJson(json);
            }}
            style={{
              width: "15%",
              // width: "128px",
              aspectRatio: "1/1",
              margin: 8,
              background: `url(${convertFileSrc(
                path
              )}) no-repeat center center`,
              border: `2px solid ${config.d?.darkMode ? "#fff" : "#000"}`,
            }}
            imgStyle={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              backdropFilter: "blur(8px)",
            }}
          />
        ))}
      </ImagePreview>
    </>
  );
};
