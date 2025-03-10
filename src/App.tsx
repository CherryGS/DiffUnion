import {
  IconHome,
  IconMaximize,
  IconMinus,
  IconQuit,
} from "@douyinfe/semi-icons";
import { Button, Notification, Switch } from "@douyinfe/semi-ui";
import { Window } from "@tauri-apps/api/window";
import { useMemo, useState } from "react";
import { MainLayout } from "./MainLayout";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { Route, Routes, useNavigate } from "react-router";
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
        theme='borderless'
        icon={<IconHome />}
        style={{
          color: "var(--semi-color-text-1)",
          marginRight: "12px",
        }}
        onClick={() => navigate("/")}
      />
      {/* <Switch
        style={{
          color: "var(--semi-color-text-1)",
          marginRight: "12px",
          marginLeft: "auto",
        }}
        onChange={(c, _) => {
          if (c) {
            setDarkMode(true);
            document.body.setAttribute("theme-mode", "dark");
          } else {
            setDarkMode(false);
            document.body.removeAttribute("theme-mode");
          }
        }}
        defaultChecked={darkMode}
      /> */}

      <Button
        theme='borderless'
        icon={<IconMinus />}
        style={{
          color: "var(--semi-color-text-1)",
          marginRight: "12px",
        }}
        onClick={() => appWindow.minimize()}
      />
      <Button
        theme='borderless'
        icon={<IconMaximize />}
        style={{
          color: "var(--semi-color-text-1)",
          marginRight: "12px",
        }}
        onClick={() => appWindow.toggleMaximize()}
      />
      <Button
        theme='borderless'
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

const ErrOnDatafolder = () => {
  return <></>;
};

const App = () => {
  const [onChange, setOnChange] = useState(true);
  const [dataFolder, setDataFolder] = useState("");
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

  // 当 `dataFolder` 改变之后重新读取配置
  useMemo(() => {
    invoke<string>("get_global_config").then((v) =>
      setConfig(new ConfigManager<AppConfig>(v))
    );
  }, [dataFolder]);

  // 每次都尝试读取 `dataFolder` 并设置
  get_datafolder_or_init()
    .then((v) => {
      setDataFolder(v);
      console.log(v);
    })
    .catch((e) => console.log(e));

  return (
    <ConfigContext.Provider value={config}>
      <TitleBar />
      <Routes>
        <Route
          path='*'
          element={<MainLayout onChange={onChange} setOnChange={setOnChange} />}
        />
      </Routes>
    </ConfigContext.Provider>
  );
};

export default App;
