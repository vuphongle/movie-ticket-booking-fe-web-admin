import { Button, Form, Input, Spin, Typography, message } from "antd";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLoginMutation } from "@services/auth.service";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import type { RootState } from "@app/Store";

const LoginWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f7f9;
`;

const LoginBox = styled.div`
  min-width: 350px;
  max-width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(60, 60, 60, 0.08);
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled(Typography.Title).attrs({ level: 3 })`
  && {
    text-align: center;
    margin-bottom: 16px;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`;

const Footer = styled.div`
  margin-top: 18px;
  text-align: center;
  color: #a0a0a0;
  font-size: 13px;
`;

const App = () => {
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to={"/admin/dashboard"} />;
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values).unwrap();
      message.success(t("LOGIN_SUCCESS"));
      navigate("/admin/dashboard");
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as any).data?.message === "string"
      ) {
        if ((error as any).data?.code === "ACCOUNT_NOT_ACTIVATED") {
          message.error(t("ACCOUNT_NOT_ACTIVATED"));
        } else if ((error as any).data?.code === "INVALID_CREDENTIALS") {
          message.error(t("INVALID_CREDENTIALS"));
        }
      } else {
        message.error(t("LOGIN_ERROR"));
      }
      console.log("Login error:", error);
    }
  };

  return (
    <>
      <HelmetProvider>
        <title>{t("LOGIN_PAGE_TITLE")}</title>
      </HelmetProvider>
      <LoginWrapper>
        <Spin spinning={isLoading} tip={t("LOGIN_LOADING")}>
          <LoginBox>
            <Title>{t("LOGIN_ADMIN_TITLE")}</Title>
            <Form
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="email"
                label={t("LOGIN_EMAIL_LABEL")}
                rules={[
                  { required: true, message: t("LOGIN_EMAIL_REQUIRED") },
                  { type: "email", message: t("LOGIN_EMAIL_INVALID") },
                ]}
              >
                <Input placeholder={t("LOGIN_EMAIL_PLACEHOLDER")} />
              </Form.Item>
              <Form.Item
                name="password"
                label={t("LOGIN_PASSWORD_LABEL")}
                rules={[
                  { required: true, message: t("LOGIN_PASSWORD_REQUIRED") },
                ]}
              >
                <Input.Password placeholder={t("LOGIN_PASSWORD_PLACEHOLDER")} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" block>
                  {t("LOGIN_SUBMIT_BTN")}
                </Button>
              </Form.Item>
            </Form>
            <Footer>
              © {new Date().getFullYear()} {t("LOGIN_FOOTER")}
            </Footer>
          </LoginBox>
        </Spin>
      </LoginWrapper>
    </>
  );
};

export default App;
