import { useNavigate } from "react-router";

import {
  IconHome,
  IconMaximize,
  IconMinus,
  IconQuit,
} from "@douyinfe/semi-icons";
import { Button } from "@douyinfe/semi-ui";

import { Window } from "@tauri-apps/api/window";

const appWindow = new Window("main");

export const TitleBar = () => {
  return (
    <div
      data-tauri-drag-region
      style={{
        backgroundColor: "var(--semi-color-bg-1)",
        borderBottom: "1px solid var(--semi-color-border)",
        display: "flex",
        padding: "4px 0",
        position: "sticky",
        top: 0,
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
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
  );
};
