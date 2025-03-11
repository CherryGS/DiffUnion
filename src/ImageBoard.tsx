import { useEffect, useState } from "react";

import {
  Button,
  Divider,
  Image,
  ImagePreview,
  SideSheet,
  TextArea,
} from "@douyinfe/semi-ui";

import { convertFileSrc, invoke } from "@tauri-apps/api/core";

import { useGlobalConfig } from "./utils";

let k: string = "";
let v: string[] = [];

export const ImageBoard = () => {
  const [imgList, setImgList] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [imgOnClick, setImgOnClick] = useState("");
  const { config, dataDir: _ } = useGlobalConfig();

  useEffect(() => {
    if (k === JSON.stringify(config.d?.watchDirs)) {
      setImgList(v);
      return;
    }
    console.log(`获取 watchDirs 内图片中\n ${config.d?.watchDirs}`);
    // console.log(`↓ ${Date.now()}`);
    invoke<string[]>("find_files_by_ext", {
      paths: config.d?.watchDirs,
      exts: ["jpg", "jpeg", "png"],
    }).then((res) => {
      v = res;
      setImgList(res);
      k = JSON.stringify(config.d?.watchDirs);
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
        <Image
          src={imgOnClick}
          style={{ width: "100%", textAlign: "center" }}
          imgStyle={{
            width: "100%",
            maxWidth: 512,
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
        <Divider margin="20px" children="INFO" />
      </SideSheet>

      <ImagePreview>
        {imgList.map((path) => (
          <Image
            key={path}
            src={convertFileSrc(path)}
            preview={false}
            onClick={(e) => {
              setImgOnClick(e.target.currentSrc);
              setVisible(true);
            }}
            style={{
              width: "10%",
              aspectRatio: "1/1",
              margin: 16,
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
