import { useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";

import {
  IconHome,
  IconMaximize,
  IconMinus,
  IconQuit,
} from "@douyinfe/semi-icons";
import { Button, Notification } from "@douyinfe/semi-ui";

import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { Window } from "@tauri-apps/api/window";

import { ImageBoard } from "./ImageBoard";
import { MainLayout } from "./MainLayout";
import { Settings } from "./Settings";
import { AppConfig, ConfigManager } from "./config";
import { ConfigContext } from "./context";

const appWindow = new Window("main");

const TitleBar = () => {
  let navigate = useNavigate();
  return (
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
      <Button
        theme="borderless"
        icon={<IconHome />}
        style={{
          color: "var(--semi-color-text-1)",
          marginRight: "12px",
          marginLeft: "12px",
        }}
        onClick={() => navigate("/")}
      />

      <Button
        theme="borderless"
        icon={<IconMinus />}
        style={{
          color: "var(--semi-color-text-1)",
          marginRight: "12px",
          marginLeft: "auto",
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
  );
};

const Home = () => {
  return <div>Home</div>;
};

const App = () => {
  const [dataFolder, setDataFolder] = useState<null | string>(null);
  const [config, setConfig] = useState(
    new ConfigManager<AppConfig>(new AppConfig())
  );
  const [onChange, setOnChange] = useState(0);

  const get_datafolder_or_init = async () => {
    let res;
    try {
      res = await invoke<string>("get_datafolder");
    } catch (e) {
      res = await appDataDir();
      Notification.error({
        content: `路径 ${e} 不合法或不存在，将初始化为 ${res}`,
        duration: 10,
        theme: "light",
        position: "top",
      });
      await invoke("set_datafolder", { v: res });
    }
    return res;
  };

  useMemo(() => {
    if (dataFolder === null) return;
    console.log(`Load config from ${dataFolder}`);
    invoke<string>("get_global_config").then((v) => {
      setConfig(
        new ConfigManager<AppConfig>({
          ...new AppConfig(),
          ...JSON.parse(v),
        })
      );
    });
  }, [dataFolder]);

  // 设置黑暗模式
  if (config.get("darkMode")) document.body.setAttribute("theme-mode", "dark");
  else document.body.removeAttribute("theme-mode");

  // 每次都尝试读取 `dataFolder` 并设置
  get_datafolder_or_init()
    .then((v) => {
      if (v === dataFolder) return;
      setDataFolder(v);
      console.log(`DataFolder set to ${v}`);
    })
    .catch((e) => console.log(e));

  return (
    <ConfigContext.Provider value={config}>
      <TitleBar />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="folder" element={<ImageBoard />} />
          <Route
            path="settings"
            element={<Settings onChange={onChange} setOnChange={setOnChange} />}
          />
        </Route>
      </Routes>
    </ConfigContext.Provider>
  );
};

export default App;
