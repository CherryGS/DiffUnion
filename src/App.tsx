import { IconMaximize, IconMinus, IconQuit } from "@douyinfe/semi-icons";
import { Button, Input, Switch } from "@douyinfe/semi-ui";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { Window } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import {
  create,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import { MainLayout } from "./MainLayout";

const appWindow = new Window("main");

const InitDatafolder = ({ path }: { path: string }) => {
  const [dataFolder, setDataFolder] = useState(path);
  return (
    <>
      <Button
        onClick={async () => {
          const choose_folder = await open({
            title: "请选择一个空文件夹或之前的数据文件夹",
            directory: true,
          });
          if (choose_folder === null) return;

          setDataFolder(choose_folder);

          const config_file =
            (await appDataDir()) + String.raw`\dataFolder.txt`;
          await writeTextFile(config_file, choose_folder);
        }}
      >
        Open Directory
      </Button>
      <Input disabled value={dataFolder} />
    </>
  );
};

const get_data_path = async () => {
  const file = (await appDataDir()) + String.raw`\dataFolder.txt`;
  console.log(file);
  const flag = await exists(file);
  if (flag) {
    return await readTextFile(file);
  } else {
    create(file);
    return "";
  }
};

const App = () => {
  const [flag, setFlag] = useState(true);
  const [dataPath, setDataPath] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  get_data_path()
    .then((path) => {
      if (path !== "") {
        invoke<boolean>("check_data_path_satisfy", { path }).then((res) =>
          setFlag(res)
        );
      } else setFlag(false);
      setDataPath(path);
    })
    .catch((err) => {
      console.log(err);
    });

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
        <Switch
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
        />

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

      {flag ? (
        <MainLayout path={dataPath} darkMode={darkMode} />
      ) : (
        <InitDatafolder path={dataPath} />
      )}
    </>
  );
};

export default App;
