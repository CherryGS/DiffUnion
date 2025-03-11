import { cloneDeep } from "lodash";

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

import { open } from "@tauri-apps/plugin-dialog";

import { clone_and_change, useGlobalConfig } from "./utils";

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
        cont={[Data_WatchDirs, Data_Workspaces, Data_DataFolder]}
      />
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
  const { config: _, dataDir } = useGlobalConfig();
  return (
    <SettingLine
      left={<Text strong>数据目录</Text>}
      right={
        <Input disabled value={dataDir.data} style={{ width: "fit-content" }} />
      }
    />
  );
};

/**
 * 监视目录
 */
const Data_WatchDirs = () => {
  const { Text } = Typography;
  const { config, dataDir: _ } = useGlobalConfig();
  return (
    <SettingLine
      left={
        <div>
          <Text strong>监视目录</Text>
          <Button
            type="primary"
            theme="borderless"
            icon={<IconPlusCircle />}
            onClick={async () => {
              const v = await open({
                title: "请选择添加的监视目录",
                directory: true,
              });
              if (v === null) return;
              if (config.d === undefined) {
                console.error(`config 不应为空\n ${config}`);
                return;
              }
              const s = new Set(config.d.watchDirs);
              if (v in s) return;
              s.add(v);
              config.update(clone_and_change(config.d, { watchDirs: [...s] }));
            }}
          />
        </div>
      }
      right={
        <List
          dataSource={config.d?.watchDirs ? [...config.d.watchDirs] : []}
          split={false}
          style={{ display: "flex", flexWrap: "wrap" }}
          renderItem={(item) => (
            <div>
              <Button
                type="danger"
                theme="borderless"
                icon={<IconMinus />}
                onClick={() => {
                  if (config.d === undefined) {
                    console.error(`config 不应为空\n ${config}`);
                    return;
                  }
                  const s = new Set(config.d.watchDirs);
                  s.delete(item);
                  config.update(
                    clone_and_change(config.d, { watchDirs: [...s] })
                  );
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
              if (config.d === undefined) {
                console.error(`config 不应为空\n ${config}`);
                return;
              }
              const s = new Set(config.d.workspaces);
              if (v in s) return;
              s.add(v);
              config.update(clone_and_change(config.d, { workspaces: [...s] }));
            }}
          />
        </div>
      }
      right={
        <List
          dataSource={config.d?.workspaces ? [...config.d.workspaces] : []}
          split={false}
          style={{ display: "flex", flexWrap: "wrap" }}
          renderItem={(item) => (
            <div>
              <Button
                type="danger"
                theme="borderless"
                icon={<IconMinus />}
                onClick={() => {
                  if (config.d === undefined) {
                    console.error(`config 不应为空\n ${config}`);
                    return;
                  }
                  const s = new Set(config.d.workspaces);
                  s.delete(item);
                  config.update(
                    clone_and_change(config.d, { workspaces: [...s] })
                  );
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
