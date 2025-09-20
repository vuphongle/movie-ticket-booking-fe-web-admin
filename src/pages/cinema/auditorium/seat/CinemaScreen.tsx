import { useTranslation } from "react-i18next";

function CinemaScreen() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        textAlign: "center",
        textTransform: "uppercase",
        padding: "20px",
        backgroundColor: "#333",
        color: "#fff",
        marginBottom: "60px",
        borderRadius: "6px",
      }}
    >
      {t("SCREEN")}
    </div>
  );
}

export default CinemaScreen;
