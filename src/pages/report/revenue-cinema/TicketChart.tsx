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
import { useTranslation } from "react-i18next";
import type { CinemaRevenue } from "@/types/dashboard.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TicketChartProps {
  data?: CinemaRevenue[];
}

function TicketChart({ data }: TicketChartProps) {
  const { t } = useTranslation();

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("REPORT_TICKETS_SOLD_BY_CINEMA"),
      },
    },
  };

  const chartData = {
    labels: data?.map((cinema) => cinema?.cinemaName),
    datasets: [
      {
        label: t("REPORT_TICKETS_SOLD"),
        data: data?.map((cinema) => cinema?.totalTickets),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={chartData} />;
}

export default TicketChart;
