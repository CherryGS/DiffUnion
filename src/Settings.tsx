import { cloneDeep } from "lodash";
import { useContext, useMemo, useState } from "react";

import { IconMinus, IconPlusCircle } from "@douyinfe/semi-icons";
import {
  Button,
  Card,
  Divider,
  Input,
  List,
  Space,
  Switch,
  Typography,
} from "@douyinfe/semi-ui";
import { CardProps } from "@douyinfe/semi-ui/lib/es/card";
import { SpaceProps } from "@douyinfe/semi-ui/lib/es/space";

import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import { ConfigContext } from "./context";
import { useGlobalConfig } from "./utils";

interface SettingCardProps {
  card?: CardProps;
  space?: SpaceProps;
  cont: (() => JSX.Element)[];
}

const SettingLine = ({
  left,
  right,
}: {
  left: JSX.Element;
  right: JSX.Element;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "32px",
      }}
    >
      <div>{left}</div>
      <div style={{ marginLeft: "auto" }}>{right}</div>
    </div>
  );
};

const SettingCard = (op: SettingCardProps) => {
  if (op.card === undefined) op.card = {};
  if (op.card.style === undefined) op.card.style = {};
  op.card.style["width"] = "-webkit-fill-available";
  if (op.space === undefined) op.space = {};
  if (op.space.style === undefined) op.space.style = {};
  op.space.style["width"] = "-webkit-fill-available";

  let cont = new Array();
  op.cont.forEach((V, i) => {
    if (i !== 0) {
      cont.push(<Divider key={i * 2} />);
    }
    cont.push(<V key={i * 2 + 1} />);
  });

  return (
    <Card {...op.card}>
      <Space vertical {...op.space}>
        {cont}
      </Space>
    </Card>
  );
};

export const Settings = () => {
  return (
    <Space vertical style={{ width: "100%" }}>
      <SettingCard
        card={{
          title: "Interface",
          style: { width: "-webkit-fill-available" },
        }}
        space={{ style: { width: "-webkit-fill-available" } }}
        cont={[IF_DarkMode]}
      />
      <SettingCard
        card={{ title: "Data", style: { width: "-webkit-fill-available" } }}
        space={{ style: { width: "-webkit-fill-available" } }}
        cont={[]}
        // cont={[Data_WatchDirs, Data_DataFolder]}
      />
      {/* <Card style={{ width: "-webkit-fill-available" }}>
        <ButtonGroup>
          <Button
            onClick={() => {
              config.m
            }}
          >
            取消
          </Button>

          <Button
            onClick={async () => {
              const r = config.save();
              await invoke("set_global_config", {
                v: r,
              });
              setOnChange(onChange + 1);
              console.log(`配置文件保存成功\n${r}`);
            }}
          >
            保存
          </Button>
        </ButtonGroup>
      </Card> */}
    </Space>
  );
};

/**
 * 黑暗模式
 */
const IF_DarkMode = () => {
  const { Text } = Typography;
  const { config, dataDir: _ } = useGlobalConfig();
  return (
    <SettingLine
      left={<Text strong>黑暗模式</Text>}
      right={
        <Switch
          checked={Boolean(config.d?.darkMode)}
          onChange={() => {
            if (config.d === undefined) {
              console.error(`config 不应为空\n ${config}`);
              return;
            }
            let r = cloneDeep(config.d);
            r.darkMode = config.d.darkMode ? 0 : 1;
            config.update(r);
          }}
        />
      }
    />
  );
};

/**
 * 数据目录
 */
const Data_DataFolder = () => {
  const { Text } = Typography;
  const [text, setText] = useState("");
  useMemo(() => {
    invoke<string>("get_datafolder").then((v) => setText(v));
  }, []);

  return (
    <SettingLine
      left={<Text strong>数据目录</Text>}
      right={<Input disabled value={text} style={{ width: "fit-content" }} />}
    />
  );
};

/**
 * 监视目录
 */
const Data_WatchDirs = () => {
  const { Text } = Typography;
  const config = useContext(ConfigContext);
  const [listSet, setListSet] = useState(new Set(config.get("watchDirs")));
  return (
    <SettingLine
      left={
        <div>
          <Text strong>监听目录</Text>
          <Button
            type="primary"
            theme="borderless"
            icon={<IconPlusCircle />}
            onClick={async () => {
              const v = await open({
                title: "请选择添加的监听目录",
                directory: true,
              });
              if (v === null || v in listSet) return;
              listSet.add(v);
              config.set("watchDirs", [...listSet]);
              setListSet(new Set(listSet));
            }}
          />
        </div>
      }
      right={
        <List
          dataSource={[...listSet]}
          split={false}
          style={{ display: "flex", flexWrap: "wrap" }}
          renderItem={(item) => (
            <div>
              <Button
                type="danger"
                theme="borderless"
                icon={<IconMinus />}
                onClick={() => {
                  listSet.delete(item);
                  config.set("watchDirs", [...listSet]);
                  setListSet(new Set(listSet));
                }}
              />
              {item}
            </div>
          )}
        />
      }
    />
  );
};

/**
 * 工作目录(库)
 */
const Data_Workspaces = () => {
  const { Text } = Typography;
  // const config = useContext(ConfigContext);
  // const [listSet, setListSet] = useState(new Set(config.get("workspaces")));
  const { config, dataDir: _ } = useGlobalConfig();
  return (
    <SettingLine
      left={
        <div>
          <Text strong>工作目录</Text>
          <Button
            type="primary"
            theme="borderless"
            icon={<IconPlusCircle />}
            onClick={async () => {
              const v = await open({
                title: "请选择添加的工作目录",
                directory: true,
              });
              if (v === null) return;
              const s = new Set(config.d?.workspaces);
              listSet.add(v);
              config.set("workspaces", [...listSet]);
              setListSet(new Set(listSet));
            }}
          />
        </div>
      }
      right={
        <List
          dataSource={[...listSet]}
          split={false}
          style={{ display: "flex", flexWrap: "wrap" }}
          renderItem={(item) => (
            <div>
              <Button
                type="danger"
                theme="borderless"
                icon={<IconMinus />}
                onClick={() => {
                  listSet.delete(item);
                  config.set("workspaces", [...listSet]);
                  setListSet(new Set(listSet));
                }}
              />
              {item}
            </div>
          )}
        />
      }
    />
  );
};
