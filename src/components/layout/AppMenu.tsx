import { Menu } from "antd";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMenuData } from "@data/routes";
import type { MenuProps } from "antd";
import styles from "./AppMenu.module.css";

function mapMenuToItems(
  menu: ReturnType<typeof getMenuData>,
): MenuProps["items"] {
  return menu.map((item) => ({
    key: item.id.toString(),
    icon: item.icon ? <item.icon /> : undefined,
    label:
      item.subs && item.subs.length > 0 ? (
        <span style={{ textAlign: "left", display: "block" }}>
          {item.label}
        </span>
      ) : (
        <RouterLink
          to={item.url}
          style={{
            textAlign: "left",
            display: "block",
          }}
        >
          {item.label}
        </RouterLink>
      ),
    children:
      item.subs && item.subs.length > 0
        ? item.subs.map((sub) => ({
            key: sub.id.toString(),
            label: (
              <RouterLink
                to={sub.url}
                style={{
                  textAlign: "left",
                  display: "block",
                }}
              >
                {sub.label}
              </RouterLink>
            ),
          }))
        : undefined,
  }));
}

function AppMenu() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const menuData = getMenuData(t);

  // Find selected key from submenu items or direct menu items
  const selectedFromSubmenu = menuData
    .flatMap((item) => item.subs || [])
    .find((sub) => sub?.url === pathname)
    ?.id?.toString();

  const selectedFromMenu = menuData
    .find((item) => !item.subs && item.url === pathname)
    ?.id?.toString();

  const defaultSelectedKey = selectedFromSubmenu || selectedFromMenu;

  const defaultOpenKey = menuData
    .find(
      (item) =>
        item.subs?.some((sub) => sub.url === pathname) ||
        pathname.includes(item.url),
    )
    ?.id?.toString();

  const items = mapMenuToItems(menuData);

  return (
    <Menu
      theme="light"
      mode="inline"
      items={items}
      defaultSelectedKeys={defaultSelectedKey ? [defaultSelectedKey] : []}
      defaultOpenKeys={defaultOpenKey ? [defaultOpenKey] : []}
      style={{ background: "white", border: "none", paddingBottom: 64 }}
      className={styles.menuHover}
    />
  );
}

export default AppMenu;
