import { useNavigate } from "react-router";

import { Button, Card, List, Typography } from "@douyinfe/semi-ui";

import { useGlobalConfig } from "../utils";

export const Home = () => {
  const { Title } = Typography;
  const { config, dataDir: _ } = useGlobalConfig();
  const navigate = useNavigate();
  return (
    <>
      <div>
        <Card title={<Title heading={1}> Workspace </Title>}>
          <List
            bordered={false}
            split={false}
            dataSource={config.d?.workspace}
            renderItem={(v) => (
              <List.Item>
                <Button
                  onClick={() => {
                    navigate(`/workspace/${encodeURI(v)}`);
                  }}
                >
                  {v}
                </Button>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </>
  );
};
