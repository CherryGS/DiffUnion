import {
  Button,
  Divider,
  Image,
  ImagePreview,
  SideSheet,
  TextArea,
} from "@douyinfe/semi-ui";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { useState } from "react";
export const ImageBoard = () => {
  const [imgList, setImgList] = useState<string[]>([]);
  const [localPath, setLocalPath] = useState("");
  const [visible, setVisible] = useState(false);
  const [imgOnClick, setImgOnClick] = useState("");

  function getImages() {
    const paths = localPath.split("\n");
    invoke<string[]>("find_files_by_ext", {
      paths,
      exts: ["jpg", "jpeg", "png"],
    }).then((res) => setImgList(res));
  }

  return (
    <>
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
        width='30%'
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
        <Divider margin='20px' children='INFO' />
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
              border: `2px solid ${darkMode ? "#fff" : "#000"}`,
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
