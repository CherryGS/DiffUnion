import { Modal } from "@douyinfe/semi-ui";

export const SettingPanel = ({ visible, setVisible }: { visible: boolean, setVisible: any }) => {
  return <>
    <Modal
      title="基本对话框"
      visible={visible}
      onCancel={() => setVisible(false)}
      closeOnEsc={true}
      footerFill={true}
      maskClosable={false}
      okText="应用"
      cancelText="取消"
    >
      This is the content of a basic modal.
      <br />
      More content...
    </Modal>
  </>
};
