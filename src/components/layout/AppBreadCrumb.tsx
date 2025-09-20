import { HomeOutlined } from "@ant-design/icons";
import Breadcrumb from "antd/es/breadcrumb";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "./AppBreadCrumb.module.css";

interface BreadCrumbItem {
  label: React.ReactNode;
  href?: string;
}

interface AppBreadCrumbProps {
  items: BreadCrumbItem[];
}

function AppBreadCrumb({ items }: AppBreadCrumbProps) {
  return (
    <Breadcrumb className={styles.appBreadcrumb}>
      <Breadcrumb.Item key="home">
        <HomeOutlined />
        <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
      </Breadcrumb.Item>
      {items.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          className={
            index === items.length - 1 ? styles.appBreadcrumbLast : undefined
          }
        >
          {index === items.length - 1 ? (
            <span>{item.label}</span>
          ) : (
            <RouterLink to={item.href ?? ""}>{item.label}</RouterLink>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default AppBreadCrumb;
