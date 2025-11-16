import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary Chart.js components only once
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TopCategoriesBarChart = ({ data }) => {
    // Data structure: [{"label": "Apparel", "value": 150}, ...]
    const chartData = {
        labels: data.map(row => row.label),
        datasets: [
            {
                label: 'Units Sold',
                data: data.map(row => row.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', // Red
                    'rgba(54, 162, 235, 0.6)', // Blue
                    'rgba(255, 206, 86, 0.6)', // Yellow
                    'rgba(75, 192, 192, 0.6)', // Green
                    'rgba(153, 102, 255, 0.6)',// Purple
                    'rgba(255, 159, 64, 0.6)', // Orange
                    'rgba(199, 199, 199, 0.6)',// Grey
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow charts to fill container
        plugins: {
            title: {
                display: true,
                text: 'Top Selling Categories (Units Sold)',
                font: { size: 16, weight: 'bold' },
                color: '#374151'
            },
            legend: {
                display: false, // Usually not needed for single dataset bar charts
                labels: {
                    color: '#4b5563'
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6b7280' },
                title: { display: true, text: 'Category', color: '#4b5563' }
            },
            y: {
                beginAtZero: true,
                ticks: { color: '#6b7280' },
                title: { display: true, text: 'Units Sold', color: '#4b5563' }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default TopCategoriesBarChart;