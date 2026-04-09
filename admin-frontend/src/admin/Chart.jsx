import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { useEffect, useState } from "react";

//  register (VERY IMPORTANT)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Chart({ data }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (data && (data.women || data.men || data.children)) {
      setReady(true);
    }
  }, [data]);

const chartData = {
  labels: ["Women", "Men", "Children"],
  datasets: [
    {
      label: "Products",
      data: [
        Number(data.women),
        Number(data.men),
        Number(data.children)
      ],
      backgroundColor: ["#ff6b6b", "#4facfe", "#43e97b"],
      borderRadius: 10,
      barThickness: 50
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 5,
      ticks: {
        stepSize: 1
      }
    }
  }
};
  //  chart tabhi dikhe jab data aa jaye
  if (!ready) {
    return <p>Loading chart...</p>;
  }

  return <Bar data={chartData} options={options} />;
}