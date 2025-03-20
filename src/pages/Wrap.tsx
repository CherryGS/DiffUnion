import { useState } from "react";

import { Dropdown } from "@douyinfe/semi-ui";

export const WrapDropdown = ({
  Inner,
  menu,
}: {
  Inner: ({
    onContextMenu,
  }: {
    onContextMenu: (e: React.MouseEvent) => void;
  }) => JSX.Element;
  menu: JSX.Element;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
  };

  return (
    <>
      <Inner onContextMenu={handleContextMenu} />
      {menuVisible && (
        <div
          className="dropdown-location"
          style={{
            position: "fixed",
            left: menuPos.x,
            top: menuPos.y,
            zIndex: 1000,
          }}
        >
          <Dropdown
            key={`${menuPos}`}
            render={menu}
            trigger="custom"
            visible={menuVisible}
            onClickOutSide={() => {
              setMenuVisible(false);
            }}
            position="right"
          ></Dropdown>
        </div>
      )}
    </>
  );
};
