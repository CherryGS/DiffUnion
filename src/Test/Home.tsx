import { useState } from "react";

import { Button, CodeHighlight, Dropdown, Space, Tag } from "@douyinfe/semi-ui";
import { Image } from "@douyinfe/semi-ui";

import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import { extract_metadata } from "../utils";

export const Home = () => {
  const [path, setPath] = useState<string[]>([]);
  const [code, setCode] = useState("{}");
  const [dropdVis, setDropdVis] = useState(false);
  const [loc, setLoc] = useState([0, 0]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState("");
  // 右键点击处理
  const handleContextMenu = (e: React.MouseEvent, imagePath: string) => {
    e.preventDefault();
    setSelectedImage(imagePath);
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
  };
  return (
    <>
      <Button
        onClick={async () => {
          let res = await open({
            multiple: true,
            filters: [
              {
                name: "Image",
                extensions: ["jpg", "jpeg", "png", "gif", "webp", "apng"],
              },
            ],
          });
          res = res ? res : [];
          setPath(res);
          const a = (await extract_metadata(res)).map((d) =>
            d.Parameters ? d.Parameters : ""
          );

          const r = await invoke("cmd_use_regex", {
            src: a,
            patts: [
              `(?s)^.+?(?=Negative prompt)`,
              `(?ms)(?<=Negative prompt:).+?(?=^[A-Z]+[a-z ]+:)`,
            ],
          });
          setCode(JSON.stringify(r));
          console.log(res);
          console.log(a);
          console.log(r);
        }}
      >
        Test
      </Button>
      <Space vertical>
        {path.map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
      </Space>
      <CodeHighlight language="json" code={code} />
      <div>{code}</div>

      {menuVisible && (
        <div
          className="dropdown-location"
          style={{
            position: "fixed",
            left: menuPos.x,
            top: menuPos.y,
            zIndex: 1000,
          }}
        >
          <Dropdown
            key={`${menuPos}`}
            render={<Dropdown.Item>1</Dropdown.Item>}
            trigger="custom"
            visible={menuVisible}
            onClickOutSide={() => {
              setMenuVisible(false);
            }}
            position="right"
          ></Dropdown>
        </div>
      )}

      <div style={{ width: "fit-content" }}>
        <img
          src={convertFileSrc(path[0])}
          onContextMenu={(e) => {
            console.log(e);
            handleContextMenu(e, path[0]);
          }}
        ></img>
      </div>
    </>
  );
};
