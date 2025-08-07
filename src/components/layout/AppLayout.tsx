import Layout from "antd/es/layout";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppLayoutHeader from "./AppLayoutHeader";
import AppMenu from "./AppMenu";
import { logo } from "@assets/index";

const { Header, Content, Sider } = Layout;

const SIDER_WIDTH = 300;
const SIDER_COLLAPSED_WIDTH = 80;
const HEADER_HEIGHT = 64;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
      <Sider
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="custom-sider"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          zIndex: 100,
          background: "white",
          borderRight: "1px solid #f5f5f5",
          minWidth: collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH,
          maxWidth: collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: `${HEADER_HEIGHT}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f5f5f5",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <img
              src={collapsed ? logo.logoOnlyIcon : logo.logoOnlyText}
              alt="Logo"
              style={{
                height: `${HEADER_HEIGHT}px`,
                display: "block",
                margin: "0 auto",
              }}
            />
          </a>
        </div>
        <div
          style={{
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflow: "auto",
          }}
        >
          <AppMenu />
        </div>
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH,
          transition: "margin-left 0.2s ease",
          minHeight: "100vh",
          width: `calc(100vw - ${collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH}px)`,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: "white",
            position: "fixed",
            top: 0,
            right: 0,
            left: collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH,
            zIndex: 99,
            transition: "left 0.2s",
            borderBottom: "1px solid #f5f5f5",
          }}
        >
          <AppLayoutHeader />
        </Header>
        <Content
          style={{
            marginTop: `${HEADER_HEIGHT}px`,
            background: "white",
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px - 32px)`,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
