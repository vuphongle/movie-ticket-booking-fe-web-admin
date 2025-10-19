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
      text: "Số vé bán ra theo phim",
    },
  },
};

interface TicketChartProps {
  data?: MovieRevenue[];
}

function TicketChart({ data }: TicketChartProps) {
  const chartData = {
    labels: data?.map((movie) => movie?.movieName.slice(0, 10) + "...") || [],
    datasets: [
      {
        label: "Số vé bán ra",
        data: data?.map((movie) => movie?.totalTickets) || [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Bar options={chartOptions} data={chartData} />;
}

export default TicketChart;
