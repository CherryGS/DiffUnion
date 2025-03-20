import { extract_metadata, useGlobalConfig } from "#/utils";
import { LRUCache } from "lru-cache";
import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Descriptions,
  Divider,
  Image,
  ImagePreview,
  SideSheet,
  Space,
  Tag,
  Typography,
} from "@douyinfe/semi-ui";

import { convertFileSrc, invoke } from "@tauri-apps/api/core";

import "./ImageBoard.css";

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
  const [imgJson, setImgJson] = useState([[""]]);
  const { Text } = Typography;

  useEffect(() => {
    const k = JSON.stringify(config.d?.watchDirs);
    const v = cache.get(k);
    if (cache.has(k) && v !== undefined) {
      setImgList(v);
      return;
    }

    console.log(`获取 watchDirs 内图片中\n ${config.d?.watchDirs}`);
    // console.log(`↓ ${Date.now()}`);
    invoke<string[]>("cmd_find_files_by_ext", {
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
          <Divider margin="20px" children="Action" />
          <Space vertical>
            <Button theme="borderless">
              添加到 {`${config.d?.workspace}`}
            </Button>
          </Space>
          <Divider
            margin="20px"
            children={<Button theme="borderless">Positive</Button>}
          />
          <Text size="normal">{imgJson}</Text>
          <Divider margin="20px" children="Negative" />
          <Divider margin="20px" children="INFO" />
          <Card>
            <Descriptions>
              <Descriptions.Item itemKey="LoRa">
                <Space vertical>
                  <Tag>
                    {
                      "<lora:[Illust][Shiiro0][C][Style] Artist_ma1ma1helmes_b:0.8>"
                    }
                  </Tag>
                  <Tag>
                    {
                      "<lora:[Illust][Shiiro0][C][Style] Artist_ma1ma1helmes_b:0.8>"
                    }
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item itemKey="Steps">10</Descriptions.Item>
            </Descriptions>
          </Card>
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
              const json = await extract_metadata([path]);
              const data = await invoke<Array<Array<string>>>("cmd_use_regex", {
                src: [json[0].Parameters],
                patts: [
                  `(?s)^.+?(?=Negative prompt)`,
                  // `(?ms)(?<=Negative prompt:).+?(?=^[A-Z]+[a-z ]+:)`,
                ],
              });
              setImgJson(data);
              console.log(json, data);
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
