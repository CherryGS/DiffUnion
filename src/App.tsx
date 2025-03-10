import { useState } from "react";
import { Route, Routes, createBrowserRouter, useNavigate } from "react-router";

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

  // 重新读取配置
  const load_config = () => {
    console.log(`Load config from ${dataFolder}`);
    if (dataFolder === null) return;
    invoke<string>("get_global_config").then((v) => {
      if (v === JSON.stringify(config.stable)) return;
      const _x: AppConfig = JSON.parse(v);
      const _y = new AppConfig();
      const _z: AppConfig = { ..._y, ..._x };
      setConfig(new ConfigManager(_z));
      while (v !== JSON.stringify(config.stable)) {
        console.log(v);
        console.log(JSON.stringify(config.stable));
      }
      invoke("set_global_config", {
        v: config.save(),
      }).then();
    });
  };

  load_config();

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
          <Route path="/folder" element={<ImageBoard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </ConfigContext.Provider>
  );
};

export default App;
