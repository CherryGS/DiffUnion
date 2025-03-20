import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";

import { ImageBoard } from "./pages/ImageBoard";
import { MainLayout } from "./pages/Main/";
import { ModelLayout } from "./pages/Model";
import { Setting } from "./pages/Setting";
import { TestHome, TestLayout } from "./pages/Test";
import { WsHome, WsLayout, WsPage } from "./pages/Worksapce";
import { useGlobalConfig } from "./utils";

const global_init = async () => {};

const App = () => {
  const navigate = useNavigate();
  const { config, dataDir: _ } = useGlobalConfig();

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
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div>Home</div>} />
          <Route path="error" element={<div>Error</div>} />
          {/* <Route path="setting" element={<Setting />} /> */}
          {/* <Route path="folder" element={<ImageBoard />} /> */}

          {/* <Route path="workspace" element={<WsLayout />}>
            <Route index element={<WsHome />} />
            <Route path=":path" element={<WsPage />} />
          </Route> */}

          {/* <Route path="test" element={<TestLayout />}>
            <Route index element={<TestHome />} />
          </Route> */}

          <Route path="model" element={<ModelLayout />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
