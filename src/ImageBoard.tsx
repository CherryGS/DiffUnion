/* eslint-disable react/no-children-prop */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Divider,
  Image,
  ImagePreview,
  SideSheet,
  TextArea,
} from "@douyinfe/semi-ui";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { useState } from "react";
export const ImageBoard = ({ darkMode }: { darkMode: boolean }) => {
  const [_, setThemeMode] = useState("dark");
  const [imgList, setImgList] = useState<string[]>([]);
  const [localPath, setLocalPath] = useState("");
  const [visible, setVisible] = useState(false);
  const [imgOnClick, setImgOnClick] = useState("");


  const switchMode = () => {
    const body = document.body;
    if (body.hasAttribute("theme-mode")) {
      body.removeAttribute("theme-mode");
      setThemeMode("light");
    } else {
      body.setAttribute("theme-mode", "dark");
      setThemeMode("dark");
    }
  };

  function getImages() {
    const paths = localPath.split("\n");
    invoke<string[]>("find_files_by_ext", {
      paths,
      exts: ["jpg", "jpeg", "png"],
    }).then((res) => setImgList(res));
  }

  return (
    <>
      <Button onClick={switchMode}>Switch Mode</Button>
      <Button onClick={getImages}>Get Images</Button>

      <TextArea
        autosize
        rows={1}
        onChange={(v) => setLocalPath(v)}
        value={localPath}
      />

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
              border: `2px solid ${!darkMode
                ? "#fff"
                : "#000"
                }`
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
