import { Dropdown, message, Button } from "antd";
import Avatar from "antd/es/avatar";
import Flex from "antd/es/flex";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "@app/Store";
import { logout } from "../../app/slices/auth.slice";
import { flags } from "@assets/index";
import styles from "./AppLayoutHeader.module.css";

function AppLayoutHeader() {
  const { auth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    message.success(t("LOGOUT_SUCCESS"));
  };

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  const items = [
    {
      key: "1",
      label: <a href="/">{t("BACK_TO_HOME")}</a>,
    },
    {
      key: "2",
      label: <span onClick={handleLogout}>{t("LOGOUT")}</span>,
    },
  ];

  const currentLanguage = i18n.language || "en";

  return (
    <Flex
      justify="flex-end"
      align="center"
      className={styles.headerContainer}
      gap={20}
    >
      {/* Language Switcher */}
      <div className={styles.languageSwitcher}>
        <Button
          type="text"
          size="small"
          onClick={() => handleChangeLanguage("vn")}
          className={`${styles.languageButton} ${
            currentLanguage === "vn" ? styles.active : styles.inactive
          }`}
        >
          <img
            src={flags.vietnam}
            alt="Vietnam Flag"
            className={styles.flagImage}
          />
          <span
            className={`${styles.languageText} ${
              currentLanguage === "vn" ? styles.active : styles.inactive
            }`}
          >
            VN
          </span>
        </Button>

        <Button
          type="text"
          size="small"
          onClick={() => handleChangeLanguage("en")}
          className={`${styles.languageButton} ${
            currentLanguage === "en" ? styles.active : styles.inactive
          }`}
        >
          <img
            src={flags.unitedStates}
            alt="United States Flag"
            className={styles.flagImage}
          />
          <span
            className={`${styles.languageText} ${
              currentLanguage === "en" ? styles.active : styles.inactive
            }`}
          >
            EN
          </span>
        </Button>
      </div>

      <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
        <div className={styles.avatarWrapper}>
          <Avatar src={<img src={auth?.avatar} alt="avatar" />} size={40} />
        </div>
      </Dropdown>
    </Flex>
  );
}

export default AppLayoutHeader;
