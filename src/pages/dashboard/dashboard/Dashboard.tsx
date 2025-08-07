import { Helmet } from "react-helmet";

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: "red" }}>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1>Welcome to the Dashboard</h1>
    </div>
  );
};

export default Dashboard;
