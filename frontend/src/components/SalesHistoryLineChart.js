import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary Chart.js components only once
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesHistoryLineChart = ({ data }) => {
    // Ensure data is an array before mapping
    const chartData = {
        labels: data.map(row => row.date), // e.g., ["2025-11-08", "2025-11-09"]
        datasets: [
            {
                label: 'Daily Revenue',
                data: data.map(row => row.revenue / 100), // Convert cents to dollars
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4, // Smooths the line
                fill: false, // Don't fill area under the line
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow charts to fill container
        plugins: {
            title: {
                display: true,
                text: 'Sales Revenue Over Time',
                font: { size: 16, weight: 'bold' },
                color: '#374151' // Tailwind gray-700
            },
            legend: {
                position: 'top',
                labels: {
                    color: '#4b5563' // Tailwind gray-600
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6b7280' }, // Tailwind gray-500
                title: { display: true, text: 'Date', color: '#4b5563' }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#6b7280',
                    callback: function(value) {
                        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
                    }
                },
                title: { display: true, text: 'Revenue ($)', color: '#4b5563' }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default SalesHistoryLineChart;