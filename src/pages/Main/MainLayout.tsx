import { Outlet, useNavigate } from "react-router";

import {
  IconBeaker,
  IconFolder,
  IconHome,
  IconSetting,
} from "@douyinfe/semi-icons";
import { Button, Layout, Nav, Tooltip } from "@douyinfe/semi-ui";

import { TitleBar } from "./TitleBar";

export const MainLayout = () => {
  const { Sider, Content } = Layout;
  const navigate = useNavigate();
  return (
    <Layout
      style={{
        border: "1px solid var(--semi-color-border)",
        width: "100vw",
        height: "100vh",
      }}
    >
      <TitleBar />
      <Layout>
        <Sider
          style={{
            backgroundColor: "var(--semi-color-bg-1)",
            borderRight: "1px solid var(--semi-color-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {[
              // {
              //   key: "folder",
              //   text: "文件夹",
              //   icon: <IconFolder size="large" />,
              // },
              {
                key: "model",
                text: "模型",
                icon: <IconHome size="large" />,
              },
              // {
              //   key: "setting",
              //   text: "设置",
              //   icon: <IconSetting size="large" />,
              // },
              // {
              //   key: "test",
              //   text: "测试",
              //   icon: <IconBeaker size="large" />,
              // },
            ].map((d) => (
              <Button
                theme="borderless"
                style={{ marginTop: "12px" }}
                onClick={() => navigate(`/${d.key}`)}
              >
                <Tooltip content={d.text} position="right">
                  <div>{d.icon}</div>
                </Tooltip>
              </Button>
            ))}
          </div>
        </Sider>

        <Content
          style={{
            backgroundColor: "var(--semi-color-bg-0)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
