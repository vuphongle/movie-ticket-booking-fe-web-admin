import { HomeOutlined } from "@ant-design/icons";
import Breadcrumb from "antd/es/breadcrumb";
import type { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
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
  const breadcrumbItems: BreadcrumbItemType[] = [
    {
      title: (
        <>
          <HomeOutlined />
          <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
        </>
      ),
      key: "home",
    },
    ...items.map((item, index) => ({
      title:
        index === items.length - 1 ? (
          <span>{item.label}</span>
        ) : (
          <RouterLink to={item.href ?? ""}>{item.label}</RouterLink>
        ),
      key: index,
      className:
        index === items.length - 1 ? styles.appBreadcrumbLast : undefined,
    })),
  ];

  return (
    <Breadcrumb className={styles.appBreadcrumb} items={breadcrumbItems} />
  );
}

export default AppBreadCrumb;
