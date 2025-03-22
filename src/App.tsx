import { GlobalConfig } from "#bind/GlobalConfig.ts";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";

import { invoke } from "@tauri-apps/api/core";

import { ReadonlyConfig, defaultGlobalConfig } from "./config";
import { MainLayout } from "./pages/Main/";
import { ModelLayout } from "./pages/Model";
import { useGlobalConfig } from "./utils";

const App = () => {
  const navigate = useNavigate();
  const { config, dataDir: _ } = useGlobalConfig();
  const [readOnlyConfig, setReadOnlyConfig] = useState(defaultGlobalConfig);

  useEffect(() => {
    invoke<GlobalConfig>("cmd_get_global")
      .then((d) => setReadOnlyConfig(d))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    switch (config.q.status) {
      case "success": {
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
    <ReadonlyConfig.Provider value={readOnlyConfig}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div>Home</div>} />
          <Route path="error" element={<div>Error</div>} />

          <Route path="model" element={<ModelLayout />} />
        </Route>
      </Routes>
    </ReadonlyConfig.Provider>
  );
};

export default App;
