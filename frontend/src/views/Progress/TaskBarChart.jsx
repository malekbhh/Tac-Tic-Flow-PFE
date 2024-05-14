import React from "react";
import Chart from "chart.js/auto";

function TaskBarChart({ taskProgress }) {
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (taskProgress.length > 0) {
      const labels = taskProgress.map((progress) => progress.status);
      const data = taskProgress.map((progress) => progress.percentage);

      const chartConfig = {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "The progress of member's assigned tasks ",
              data: data,
              backgroundColor: labels.map((status) => getStatusColor(status)),
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 100,
            },
          },
        },
      };

      const myChart = new Chart(chartRef.current, chartConfig);

      return () => {
        myChart.destroy();
      };
    }
  }, [taskProgress]);

  return <canvas ref={chartRef} style={{ width: "100%" }}></canvas>;
}

function getStatusColor(status) {
  switch (status) {
    case "To Do":
      return "#F87171"; // Rouge pour "To Do"
    case "Doing":
      return "#60A5FA"; // Bleu pour "Doing"
    case "Done":
      return "#34D399"; // Vert pour "Done"
    case "Closed":
      return "#6B7280"; // Gris pour "Closed"
    default:
      return "#000000"; // Noir par défaut
  }
}

export default TaskBarChart;
