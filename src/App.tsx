import { useState } from "react";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { Button, Image } from "@douyinfe/semi-ui";

function App() {
  const [imgList, setImgList] = useState<string[]>([]);
  const [localPath, setLocalPath] = useState("");

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

      {imgList.map((path) => (
        <Image width={360} height={200} src={convertFileSrc(path)} />
      ))}
    </>
  );
}

export default App;
