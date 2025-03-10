import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Input,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import { invoke } from "@tauri-apps/api/core";
import { useContext, useMemo, useState } from "react";
import { ConfigContext } from "./context";
import { useNavigate } from "react-router";

const DataFolderInput = () => {
  const [text, setText] = useState("");
  const { Text } = Typography;

  useMemo(() => {
    invoke<string>("get_datafolder").then((v) => setText(v));
  }, []);

  return (
    <Card
      title='数据'
      shadows='hover'
      style={{ width: "-webkit-fill-available" }}
    >
      <Space vertical style={{ width: "-webkit-fill-available" }}>
        <div
          style={{
            display: "flex",
            position: "sticky",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text strong>数据目录</Text>
          <Input
            disabled
            value={text}
            style={{ width: "fit-content", marginLeft: "auto" }}
          />
        </div>
        <Divider />
      </Space>
    </Card>
  );
};

export const Settings = () => {
  const config = useContext(ConfigContext);
  const navigate = useNavigate();
  return (
    <Space vertical style={{ width: "100%" }}>
      <DataFolderInput />
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
              config.save();
              await invoke("set_global_config", {
                v: JSON.stringify(config.stable),
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
