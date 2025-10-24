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
  Legend
);

interface RevenueChartProps {
  data?: CinemaRevenue[];
}

function RevenueChart({ data }: RevenueChartProps) {
  const { t } = useTranslation();

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("REPORT_REVENUE_BY_CINEMA"),
      },
    },
  };

  const chartData = {
    labels: data?.map((cinema) => cinema?.cinemaName),
    datasets: [
      {
        label: t("REPORT_REVENUE"),
        data: data?.map((cinema) => cinema?.totalRevenue),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={chartData} />;
}

export default RevenueChart;
