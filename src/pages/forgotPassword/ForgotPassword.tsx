import { Button, Form, Input, Spin, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useForgotPasswordMutation } from "@/app/services/auth.service";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MailOutlined, ReloadOutlined, EditOutlined } from "@ant-design/icons";

const ForgotWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f7f9;
`;

const ForgotBox = styled.div`
  min-width: 350px;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 22px rgba(60, 60, 60, 0.12);
  padding: 28px 28px 22px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled(Typography.Title).attrs({ level: 3 })`
  && {
    text-align: center;
    margin-bottom: 8px;
    color: #1a1a1a;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
`;

const Subtitle = styled(Typography.Paragraph)`
  && {
    text-align: center;
    margin-top: -8px;
    color: #6f6f6f;
  }
`;

const Footer = styled.div`
  margin-top: 18px;
  text-align: center;
  color: #a0a0a0;
  font-size: 13px;
`;

function getInboxUrl(email: string | null) {
  if (!email) return null;
  const domain = email.split("@")[1]?.toLowerCase();
  switch (domain) {
    case "gmail.com":
      return "https://mail.google.com/";
    case "yahoo.com":
    case "yahoo.com.vn":
      return "https://mail.yahoo.com/";
    case "outlook.com":
    case "hotmail.com":
    case "live.com":
    case "msn.com":
      return "https://outlook.live.com/mail/";
    case "icloud.com":
      return "https://www.icloud.com/mail/";
    case "zoho.com":
      return "https://mail.zoho.com/";
    default:
      return null;
  }
}

// Mask local part (privacy)
function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] ?? ""}*@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

// Normalize email input
function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

const RESEND_COOLDOWN = 30;

type ForgotPasswordError = {
  data?: {
    message?: string;
    code?: string;
  };
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [successView, setSuccessView] = useState(false);

  // Cooldown handled by a countdown state and an interval ref
  const [cooldown, setCooldown] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const inboxUrl = useMemo(() => getInboxUrl(submittedEmail), [submittedEmail]);

  // Cleanup interval when unmounting
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start cooldown (idempotent if already running)
  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleForgot = useCallback(
    async (values: { email: string }) => {
      if (isLoading) return;

      const email = normalizeEmail(values.email);
      try {
        await forgotPassword({ email }).unwrap();
        setSubmittedEmail(email);
        setSuccessView(true);
        startCooldown();
        message.success(t("FORGOT_PASSWORD_SUCCESS_TOAST"));
      } catch (err) {
        const error = err as ForgotPasswordError;
        const code = error?.data?.code;
        const msg = error?.data?.message;

        if (code === "ACCOUNT_NOT_ACTIVATED") {
          message.error(t("ACCOUNT_NOT_ACTIVATED"));
          return;
        }
        if (code === "USER_NOT_FOUND") {
          message.error(t("USER_NOT_FOUND"));
          return;
        }
        if (typeof msg === "string" && msg.trim().length > 0) {
          message.error(msg);
          return;
        }
        message.error(t("FORGOT_PASSWORD_ERROR"));
      }
    },
    [forgotPassword, startCooldown, t, isLoading],
  );

  // Resend email
  const handleResend = useCallback(async () => {
    if (!submittedEmail || cooldown > 0) return;
    try {
      await forgotPassword({ email: submittedEmail }).unwrap();
      startCooldown();
      message.success(t("FORGOT_PASSWORD_RESENT"));
    } catch (err) {
      const error = err as ForgotPasswordError;
      const msg = error?.data?.message;
      if (typeof msg === "string" && msg.trim().length > 0) {
        message.error(msg);
      } else {
        message.error(t("FORGOT_PASSWORD_ERROR"));
      }
    }
  }, [cooldown, forgotPassword, startCooldown, submittedEmail, t]);

  const handleUseAnotherEmail = useCallback(() => {
    setSuccessView(false);
    setSubmittedEmail(null);
    form.resetFields(["email"]);
  }, [form]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t("FORGOT_PASSWORD_PAGE_TITLE")}</title>
      </Helmet>
      <ForgotWrapper>
        <Spin spinning={isLoading} tip={t("FORGOT_PASSWORD_LOADING")}>
          <ForgotBox>
            {!successView ? (
              <>
                <Title>{t("FORGOT_PASSWORD_TITLE")}</Title>
                <Subtitle>{t("FORGOT_PASSWORD_SUBTITLE")}</Subtitle>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleForgot}
                  autoComplete="off"
                  size="large"
                >
                  <Form.Item
                    name="email"
                    label={t("FORGOT_PASSWORD_EMAIL_LABEL")}
                    rules={[
                      {
                        required: true,
                        message: t("FORGOT_PASSWORD_EMAIL_REQUIRED"),
                      },
                      {
                        type: "email",
                        message: t("FORGOT_PASSWORD_EMAIL_INVALID"),
                      },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const normalized = normalizeEmail(value);
                          if (normalized !== value) {
                            form.setFieldsValue({ email: normalized });
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("FORGOT_PASSWORD_EMAIL_PLACEHOLDER")}
                      allowClear
                      autoFocus
                      inputMode="email"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      disabled={isLoading}
                      icon={<MailOutlined />}
                    >
                      {t("FORGOT_PASSWORD_SUBMIT_BTN")}
                    </Button>
                  </Form.Item>

                  <Form.Item style={{ textAlign: "center", marginTop: 8 }}>
                    <Typography.Link onClick={() => navigate("/login")}>
                      {t("BACK_TO_LOGIN")}
                    </Typography.Link>
                  </Form.Item>
                </Form>
                <Footer>
                  © {new Date().getFullYear()} {t("LOGIN_FOOTER")}
                </Footer>
              </>
            ) : (
              <>
                <Title>{t("FORGOT_PASSWORD_SUCCESS_TITLE")}</Title>
                <Subtitle>
                  {t("FORGOT_PASSWORD_SUCCESS_DESC", {
                    email: submittedEmail ? maskEmail(submittedEmail) : "",
                  })}
                </Subtitle>

                <div style={{ display: "grid", gap: 8 }}>
                  {inboxUrl ? (
                    <Button
                      type="primary"
                      size="large"
                      block
                      href={inboxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<MailOutlined />}
                    >
                      {t("FORGOT_PASSWORD_OPEN_INBOX_BTN")}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={() => window.open("mailto:", "_self")}
                      icon={<MailOutlined />}
                    >
                      {t("FORGOT_PASSWORD_OPEN_MAIL_APP_BTN")}
                    </Button>
                  )}

                  <Button
                    block
                    onClick={handleResend}
                    disabled={cooldown > 0 || isLoading}
                    icon={<ReloadOutlined />}
                  >
                    {cooldown > 0
                      ? t("FORGOT_PASSWORD_RESEND_COOLDOWN", { s: cooldown })
                      : t("FORGOT_PASSWORD_RESEND_BTN")}
                  </Button>

                  <Button
                    block
                    onClick={handleUseAnotherEmail}
                    icon={<EditOutlined />}
                  >
                    {t("FORGOT_PASSWORD_USE_ANOTHER_EMAIL")}
                  </Button>

                  <Typography.Paragraph style={{ textAlign: "center" }}>
                    <Typography.Link onClick={() => navigate("/login")}>
                      {t("BACK_TO_LOGIN")}
                    </Typography.Link>
                  </Typography.Paragraph>
                </div>

                <Footer>
                  © {new Date().getFullYear()} {t("LOGIN_FOOTER")}
                </Footer>
              </>
            )}
          </ForgotBox>
        </Spin>
      </ForgotWrapper>
    </HelmetProvider>
  );
};

export default ForgotPassword;
