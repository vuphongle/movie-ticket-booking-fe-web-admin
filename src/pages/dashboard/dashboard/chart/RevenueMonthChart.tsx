import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { RevenueByMonth } from "@/types/dashboard.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Doanh thu theo tháng",
    },
  },
};

interface RevenueMonthChartProps {
  data: RevenueByMonth[];
}

function RevenueMonthChart({ data }: RevenueMonthChartProps) {
  const chartData = {
    labels: data?.map((v) => `${v?.month}/${v?.year}`) || [],
    datasets: [
      {
        label: "Doanh thu",
        data: data?.map((v) => v?.revenue) || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={chartData} />;
}

export default RevenueMonthChart;
