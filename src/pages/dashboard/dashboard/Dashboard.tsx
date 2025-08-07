import { HelmetProvider } from "react-helmet-async";

const Dashboard = () => {
  return (
    <div
      style={{
        color: "white",
      }}
    >
      <HelmetProvider>
        <title>Dashboard</title>
      </HelmetProvider>
      <h1
        style={{
          fontWeight: "bold",
          textAlign: "center",
          color: "black",
        }}
      >
        Welcome to the Dashboard
      </h1>
    </div>
  );
};

export default Dashboard;
