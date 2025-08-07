import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const RevenueByCinema = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        color: "white",
      }}
    >
      <Helmet>
        <title>{t("REVENUE_BY_CINEMA")}</title>
      </Helmet>
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
