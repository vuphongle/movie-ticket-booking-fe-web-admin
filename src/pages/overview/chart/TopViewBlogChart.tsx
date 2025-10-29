import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import type { TopViewBlog } from "@/types/dashboard.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TopViewBlogChartProps {
  data: TopViewBlog[];
}

function TopViewBlogChart({ data }: TopViewBlogChartProps) {
  const { t } = useTranslation();

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("OVERVIEW_TOP_VIEWED_BLOGS"),
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            return data[index]?.title || "";
          },
        },
      },
    },
  };

  const chartData = {
    labels: data?.map((blog) => blog?.title.slice(0, 10) + "...") || [],
    datasets: [
      {
        label: t("OVERVIEW_VIEWS"),
        data: data?.map((blog) => blog?.viewCount) || [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={chartData} />;
}

export default TopViewBlogChart;
