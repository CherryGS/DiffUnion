import { CSSProperties, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Input,
  Space,
  Switch,
  Typography,
} from "@douyinfe/semi-ui";
import { CardProps } from "@douyinfe/semi-ui/lib/es/card";
import { SpaceProps } from "@douyinfe/semi-ui/lib/es/space";

import { invoke } from "@tauri-apps/api/core";

import { ConfigContext } from "./context";

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
  const config = useContext(ConfigContext);
  const navigate = useNavigate();

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
        cont={[Data_DataFolder]}
      />
      <Card style={{ width: "-webkit-fill-available" }}>
        <ButtonGroup>
          <Button
            onClick={() => {
              config.cancle();
            }}
          >
            取消
          </Button>

          <Button
            onClick={async () => {
              await invoke("set_global_config", {
                v: config.save(),
              });
              navigate(0);
            }}
          >
            保存
          </Button>
        </ButtonGroup>
      </Card>
    </Space>
  );
};

const IF_DarkMode = () => {
  const { Text } = Typography;
  const config = useContext(ConfigContext);
  const [darkMode, setDarkMode] = useState(config.get("darkMode"));
  return (
    <SettingLine
      left={<Text strong>黑暗模式</Text>}
      right={
        <Switch
          checked={Boolean(darkMode)}
          onChange={() => {
            const v = darkMode ? 0 : 1;
            setDarkMode(v);
            config.set("darkMode", v);
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
