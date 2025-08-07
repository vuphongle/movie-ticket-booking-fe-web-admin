import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        color: "white",
      }}
    >
      <Helmet>
        <title>{t("REVENUE_BY_MOVIE")}</title>
      </Helmet>
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
