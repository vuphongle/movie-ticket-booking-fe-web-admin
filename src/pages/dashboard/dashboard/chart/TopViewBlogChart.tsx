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
import type { TopViewBlog } from "@/types/dashboard.types";

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
      text: "Top bài viết được xem nhiều nhất",
    },
  },
};

interface TopViewBlogChartProps {
  data: TopViewBlog[];
}

function TopViewBlogChart({ data }: TopViewBlogChartProps) {
  const chartData = {
    labels: data?.map((blog) => blog?.title.slice(0, 10) + "...") || [],
    datasets: [
      {
        label: "Lượt xem",
        data: data?.map((blog) => blog?.viewCount) || [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={chartData} />;
}

export default TopViewBlogChart;
