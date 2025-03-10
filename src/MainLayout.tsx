import { IconFolder, IconSetting } from "@douyinfe/semi-icons";
import { IconBadge, IconForm, IconTree } from "@douyinfe/semi-icons-lab";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { useState } from "react";

import { ImageBoard } from "./ImageBoard";
import { Route, Routes, useNavigate } from "react-router";
import { Settings } from "./Settings";

export const MainLayout = ({ darkMode }: { darkMode: boolean }) => {
  const { Footer, Sider, Content } = Layout;
  const [settingVisible, setSettingVisible] = useState(false);
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
            />
            <Nav.Item itemKey={"union"} text={"活动管理"} icon={<IconForm />} />
            <Nav.Sub itemKey={"user"} text='用户管理' icon={<IconBadge />}>
              <Nav.Item itemKey={"active"} text={"活跃用户"} />
              <Nav.Item itemKey={"negative"} text={"非活跃用户"} />
            </Nav.Sub>
            <Nav.Sub
              itemKey={"union-management"}
              text='任务管理'
              icon={<IconTree />}
            >
              <Nav.Item itemKey={"notice"} text={"任务设置"} />
              <Nav.Item itemKey={"query"} text={"任务查询"} />
              <Nav.Item itemKey={"info"} text={"信息录入"} />
            </Nav.Sub>
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
          <Routes>
            <Route
              path='/folder'
              element={<ImageBoard darkMode={darkMode} />}
            />
            <Route path='/settings' element={<Settings />} />
          </Routes>

          {/* <SettingPanel
            visible={settingVisible}
            setVisible={setSettingVisible}
            store={store}
          /> */}
        </Content>
      </Layout>

      <Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          color: "var(--semi-color-text-2)",
          backgroundColor: "rgba(var(--semi-grey-0), 1)",
          position: "sticky",
          bottom: 0,
        }}
      ></Footer>
    </>
  );
};
