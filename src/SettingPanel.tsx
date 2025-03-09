import { Form, Modal, TextArea } from "@douyinfe/semi-ui";
import { LazyStore } from "@tauri-apps/plugin-store";
import { useState } from "react";

class AppConfig {
  workDirs: string[];
  constructor(workDirs: []) {
    this.workDirs = workDirs;
  }
}

export const SettingPanel = ({
  visible,
  setVisible,
  store,
}: {
  visible: boolean;
  setVisible: any;
  store: LazyStore;
}) => {
  const [workDirs, setWorkDirs] = useState<string[]>([]);
  return (
    <>
      <Modal
        title='设置'
        visible={visible}
        onCancel={() => setVisible(false)}
        closeOnEsc={true}
        footerFill={true}
        maskClosable={false}
        okText='应用'
        cancelText='取消'
      >
        {/* WorkDirs */}
        <TextArea
          autosize
          rows={1}
          onChange={(v) => setWorkDirs(v.split("\n"))}
        />
      </Modal>
    </>
  );
};
