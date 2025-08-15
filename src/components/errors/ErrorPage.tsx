import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { logout } from "@app/slices/auth.slice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

type ErrorType = {
  status?: string | number;
  data?: {
    message?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

interface ErrorPageProps {
  error: ErrorType;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const { t } = useTranslation();

  const allowedStatus = [
    "404",
    "403",
    "500",
    "info",
    "success",
    "warning",
  ] as const;
  type ResultStatusType = (typeof allowedStatus)[number];
  const status: ResultStatusType = allowedStatus.includes(
    String(error.status) as ResultStatusType,
  )
    ? (String(error.status) as ResultStatusType)
    : "404";
  return (
    <Result
      status={status}
      title={status}
      subTitle={error?.data?.message || t("ERROR_PAGE_DEFAULT_SUBTITLE")}
      extra={
        <Link to="/admin/dashboard">
          <Button type="primary" onClick={handleLogout}>
            {t("ERROR_PAGE_BACK_HOME")}
          </Button>
        </Link>
      }
    />
  );
};

export default ErrorPage;
