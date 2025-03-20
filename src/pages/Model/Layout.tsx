import { useState } from "react";

import { IconFolder, IconFolderOpen, IconLayers } from "@douyinfe/semi-icons";
import { Button, Layout, Tree } from "@douyinfe/semi-ui";

export const ModelLayout = () => {
  const { Header, Sider, Content } = Layout;
  const [recursion, setRecursion] = useState(false);
  return (
    <Layout style={{ padding: "0px", height: "100%" }}>
      <Sider
        style={{
          width: "200px",
          borderRight: "1px solid var(--semi-color-border)",
        }}
      >
        <Tree
          showLine
          filterTreeNode
          expandAction="click"
          icon={<IconFolder />}
          treeData={[
            {
              label: "Models",
              value: "Models",
              key: "0",
              children: [{ label: "lora", value: "lora", key: "0-0" }],
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              theme={recursion ? "solid" : "borderless"}
              icon={<IconLayers />}
              onClick={() => setRecursion(recursion ? false : true)}
            >
              Recursion
            </Button>
          </div>
        </Header>
        <Content>content</Content>
      </Layout>
    </Layout>
  );
};
