import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
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
import { useJson, useRaw } from "./hooks";
import { useGlobalConfig } from "./utils";

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

const ErrPage = () => {
  return <div>Error</div>;
};

const App = () => {
  const navigate = useNavigate();
  const { config, dataDir: _ } = useGlobalConfig();

  useEffect(() => {
    switch (config.q.status) {
      case "success": {
        // navigate("/");

        // 设置黑暗模式
        if (config.d?.darkMode)
          document.body.setAttribute("theme-mode", "dark");
        else document.body.removeAttribute("theme-mode");

        break;
      }
      default: {
        navigate("/error");
      }
    }
  }, [config.d]);

  return (
    <>
      <TitleBar />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="folder" element={<ImageBoard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/error" element={<ErrPage />} />
      </Routes>
    </>
  );
};

export default App;
