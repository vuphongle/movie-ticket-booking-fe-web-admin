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
import { useTranslation } from "react-i18next";
import type { MovieRevenue } from "@/types/dashboard.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TicketChartProps {
  data?: MovieRevenue[];
}

function TicketChart({ data }: TicketChartProps) {
  const { t } = useTranslation();
  const fullMovieNames = data?.map((movie) => movie?.movieName) || [];

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("REPORT_TICKETS_SOLD_BY_MOVIE"),
      },
    },
  };

  const chartOptionsWithTooltip: ChartOptions<"bar"> = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            return fullMovieNames[index] || "";
          },
        },
      },
    },
  };

  const chartData = {
    labels: data?.map((movie) => movie?.movieName.slice(0, 10) + "...") || [],
    datasets: [
      {
        label: t("REPORT_TICKETS_SOLD"),
        data: data?.map((movie) => movie?.totalTickets) || [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Bar options={chartOptionsWithTooltip} data={chartData} />;
}

export default TicketChart;
