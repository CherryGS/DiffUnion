import { Outlet, useNavigate } from "react-router";

import { IconFolder, IconGridView, IconSetting } from "@douyinfe/semi-icons";
import { Layout, Nav } from "@douyinfe/semi-ui";

import { invoke } from "@tauri-apps/api/core";

export const MainLayout = () => {
  const { Sider, Content } = Layout;
  const navigate = useNavigate();
  return (
    <>
      <Layout
        style={{
          border: "1px solid var(--semi-color-border)",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
          <Nav
            defaultSelectedKeys={["Home"]}
            style={{ maxWidth: 220, height: "100%" }}
            defaultIsCollapsed={true}
          >
            <Nav.Item
              itemKey={"folder"}
              text={"文件夹"}
              icon={<IconFolder />}
              onClick={() => navigate("/folder")}
            />
            <Nav.Item
              itemKey={"workspace"}
              text={"工作空间"}
              icon={<IconGridView />}
              onClick={() => navigate("/workspace")}
            />
            {/* <Nav.Item
              itemKey={"test"}
              text={"测试"}
              onClick={async () => {
                try {
                  await invoke("extract_img_info", { file: "test" });
                } catch (e) {
                  console.log(e);
                }
              }}
            /> */}
            <Nav.Item
              itemKey={"setting"}
              text={"设置"}
              icon={<IconSetting />}
              onClick={() => navigate("/settings")}
            />
          </Nav>
        </Sider>

        <Content
          style={{
            padding: "24px",
            backgroundColor: "var(--semi-color-bg-0)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};
