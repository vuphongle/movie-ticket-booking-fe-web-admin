import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const RevenueByCinema = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        color: "white",
      }}
    >
      <HelmetProvider>
        <title>{t("REVENUE_BY_CINEMA")}</title>
      </HelmetProvider>
      <h1
        style={{
          fontWeight: "bold",
          textAlign: "center",
          color: "black",
        }}
      >
        Welcome to the Revenue by Cinema
      </h1>
    </div>
  );
};

export default RevenueByCinema;
