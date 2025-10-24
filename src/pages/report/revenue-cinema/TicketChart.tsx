import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import type { CinemaRevenue } from "@/types/dashboard.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Số vé bán ra theo rạp",
    },
  },
};

interface TicketChartProps {
  data?: CinemaRevenue[];
}

function TicketChart({ data }: TicketChartProps) {
  const chartData = {
    labels: data?.map((cinema) => cinema?.cinemaName),
    datasets: [
      {
        label: "Số vé bán ra",
        data: data?.map((cinema) => cinema?.totalTickets),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={chartData} />;
}

export default TicketChart;
