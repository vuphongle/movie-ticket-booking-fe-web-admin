import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { MovieRevenue } from "@/types/dashboard.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Doanh thu theo phim",
    },
  },
};

interface RevenueChartProps {
  data?: MovieRevenue[];
}

function RevenueChart({ data }: RevenueChartProps) {
  const chartData = {
    labels: data?.map((movie) => movie?.movieName.slice(0, 10) + "...") || [],
    datasets: [
      {
        label: "Doanh thu",
        data: data?.map((movie) => movie?.totalRevenue) || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Bar options={chartOptions} data={chartData} />;
}

export default RevenueChart;
