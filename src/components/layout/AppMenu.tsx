import { Menu } from "antd";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMenuData } from "../../data/routes";
import type { MenuProps } from "antd";

function mapMenuToItems(
  menu: ReturnType<typeof getMenuData>
): MenuProps["items"] {
  return menu.map((item) => ({
    key: item.id.toString(),
    icon: item.icon ? <item.icon /> : undefined,
    label: (
      <span style={{ textAlign: "left", display: "block" }}>{item.label}</span>
    ),
    children: item.subs
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

  const defaultSelectedKey = menuData
    .flatMap((item) => item.subs)
    .find((sub) => sub?.url === pathname)
    ?.id?.toString();

  const defaultOpenKey = menuData
    .find(
      (item) =>
        item.subs?.some((sub) => sub.url === pathname) ||
        pathname.includes(item.url)
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
      style={{ background: "white", border: "none" }}
    />
  );
}

export default AppMenu;
