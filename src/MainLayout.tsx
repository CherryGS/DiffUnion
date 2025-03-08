import { IconMaximize, IconMinus, IconQuit, IconSetting } from "@douyinfe/semi-icons";
import { IconBadge, IconForm, IconTree } from "@douyinfe/semi-icons-lab";
import { Button, Layout, Nav, Switch } from "@douyinfe/semi-ui";
import { Window } from "@tauri-apps/api/window";
import { useState } from "react";

import { ImageBoard } from "./ImageBoard";
import { SettingPanel } from "./SettingPanel";

const appWindow = new Window("main");

export const MainLayout = () => {
  const { Footer, Sider, Content } = Layout;
  const [darkMode, setDarkMode] = useState(true);
  const [settingVisible, setSettingVisible] = useState(false);

  return (
    <>
      <div
        data-tauri-drag-region
        style={{
          backgroundColor: "var(--semi-color-bg-1)",
          display: "flex",
          padding: "4px",
          position: "sticky",
          top: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Switch style={{
          color: "var(--semi-color-text-1)",
          marginRight: "12px",
          marginLeft: "auto",
        }} onChange={(c, _) => {
          if (c) {
            setDarkMode(true);
            document.body.setAttribute("theme-mode", "dark");
          } else {
            setDarkMode(false);
            document.body.removeAttribute("theme-mode");
          }
        }} defaultChecked={darkMode} />

        <Button
          theme="borderless"
          icon={<IconMinus />}
          style={{
            color: "var(--semi-color-text-1)",
            marginRight: "12px",
          }}
          onClick={() => appWindow.minimize()}
        />
        <Button
          theme="borderless"
          icon={<IconMaximize />}
          style={{
            color: "var(--semi-color-text-1)",
            marginRight: "12px",
          }}
          onClick={() => appWindow.toggleMaximize()}
        />
        <Button
          theme="borderless"
          icon={<IconQuit />}
          style={{
            color: "var(--semi-color-text-1)",
            marginRight: "12px",
          }}
          onClick={() => appWindow.close()}
        />
      </div>

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
            <Nav.Item itemKey={"union"} text={"活动管理"} icon={<IconForm />} />
            <Nav.Sub itemKey={"user"} text="用户管理" icon={<IconBadge />}>
              <Nav.Item itemKey={"active"} text={"活跃用户"} />
              <Nav.Item itemKey={"negative"} text={"非活跃用户"} />
            </Nav.Sub>
            <Nav.Sub
              itemKey={"union-management"}
              text="任务管理"
              icon={<IconTree />}
            >
              <Nav.Item itemKey={"notice"} text={"任务设置"} />
              <Nav.Item itemKey={"query"} text={"任务查询"} />
              <Nav.Item itemKey={"info"} text={"信息录入"} />
            </Nav.Sub>
            <Nav.Item itemKey={"setting"} text={"设置"} icon={<IconSetting />} onClick={() => {
              setSettingVisible(true);

            }} />
          </Nav>
        </Sider>

        <Content
          style={{
            padding: "24px",
            backgroundColor: "var(--semi-color-bg-0)",
          }}
        >
          <ImageBoard darkMode={darkMode} />
          <SettingPanel visible={settingVisible} setVisible={setSettingVisible} />
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
