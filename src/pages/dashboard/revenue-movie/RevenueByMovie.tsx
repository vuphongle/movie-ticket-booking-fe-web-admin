import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        color: "white",
      }}
    >
      <HelmetProvider>
        <title>{t("REVENUE_BY_MOVIE")}</title>
      </HelmetProvider>
      <h1
        style={{
          fontWeight: "bold",
          textAlign: "center",
          color: "black",
        }}
      >
        Welcome to the Revenue by Movie
      </h1>
    </div>
  );
};

export default Dashboard;
