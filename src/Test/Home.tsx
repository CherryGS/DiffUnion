import { useState } from "react";

import { Button, CodeHighlight, Space, Tag } from "@douyinfe/semi-ui";

import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import { extract_metadata } from "../utils";

export const Home = () => {
  const [path, setPath] = useState<string[]>([]);
  const [code, setCode] = useState("{}");
  return (
    <>
      <Button
        onClick={async () => {
          let res = await open({
            multiple: true,
            filters: [
              {
                name: "Image",
                extensions: ["jpg", "jpeg", "png", "gif", "webp", "apng"],
              },
            ],
          });
          res = res ? res : [];
          setPath(res);
          const a = (await extract_metadata(res)).map((d) =>
            d.Parameters ? d.Parameters : ""
          );

          const r = await invoke("cmd_use_regex", {
            src: a,
            patts: [
              `(?s)^.+?(?=Negative prompt)`,
              `(?ms)(?<=Negative prompt:).+?(?=^[A-Z]+[a-z ]+:)`,
            ],
          });
          setCode(JSON.stringify(r));
          console.log(res);
          console.log(a);
          console.log(r);
        }}
      >
        Test
      </Button>
      <Space vertical>
        {path.map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
      </Space>
      <CodeHighlight language="json" code={code} />
      <div>{code}</div>
    </>
  );
};
