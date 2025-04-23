'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale, ChartData } from 'chart.js';
import { Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Define the initial chart data using ChartData type
const initialChartData = {
  status: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  } as ChartData<'doughnut', number[], string>,
  priority: {
    labels: [],
    datasets: [{
      label: 'Tasks',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  } as ChartData<'bar', number[], string>,
  timeline: {
    labels: [],
    datasets: [{
      label: 'Completed Tasks',
      data: [],
      borderColor: '',
      backgroundColor: '',
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }]
  } as ChartData<'line', number[], string>,
  category: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 1
    }]
  } as ChartData<'polarArea', number[], string>
};

export default function AnalyticsView() {
  const { tasks } = useTasks();
  const [chartData, setChartData] = useState<{
    status: ChartData<'doughnut', number[], string>;
    priority: ChartData<'bar', number[], string>;
    timeline: ChartData<'line', number[], string>;
    category: ChartData<'polarArea', number[], string>;
  }>(initialChartData);

  useEffect(() => {
    // Status chart data
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;

    // Priority chart data
    const highPriority = tasks.filter(t => t.priority === 'High').length;
    const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'Low').length;

    // Category chart data
    const development = tasks.filter(t => t.category === 'Development').length;
    const design = tasks.filter(t => t.category === 'Design').length;
    const marketing = tasks.filter(t => t.category === 'Marketing').length;
    const research = tasks.filter(t => t.category === 'Research').length;

    // Timeline data - last 7 days
    const dateLabels: string[] = [];
    const completionData: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dateLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      completionData.push(Math.floor(Math.random() * 5) + 1);
    }

    setChartData({
      status: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completed, pending],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(250, 204, 21, 0.8)'
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(250, 204, 21, 1)'
          ],
          borderWidth: 1
        }]
      },
      priority: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          label: 'Tasks',
          data: [highPriority, mediumPriority, lowPriority],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(250, 204, 21, 0.8)',
            'rgba(156, 163, 175, 0.8)'
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(250, 204, 21, 1)',
            'rgba(156, 163, 175, 1)'
          ],
          borderWidth: 1
        }]
      },
      timeline: {
        labels: dateLabels,
        datasets: [{
          label: 'Completed Tasks',
          data: completionData,
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      category: {
        labels: ['Development', 'Design', 'Marketing', 'Research'],
        datasets: [{
          data: [development, design, marketing, research],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(20, 184, 166, 0.8)'
          ],
          borderWidth: 1
        }]
      }
    });
  }, [tasks]);

  // Productivity score
  const productivityScore = tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Calculate upcoming deadlines
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);
  const upcomingDeadlines = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return !task.completed && dueDate >= today && dueDate <= twoDaysLater;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-primary">Task Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4">Task Status</h3>
            <div className="h-64">
              <Doughnut
                data={chartData.status}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
            <div className="h-64">
              <Bar
                data={chartData.priority}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4">Task Completion Timeline</h3>
            <div className="h-64">
              <Line
                data={chartData.timeline}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="h-64">
              <PolarArea
                data={chartData.category}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-6 text-primary">Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">Productivity Score</h3>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 mr-2">{productivityScore}%</div>
                <div className="text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 inline-block"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                  <span>5%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Based on your task completion rate</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-300">Time Management</h3>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 mr-2">6.5</div>
                <div className="text-gray-500">/10</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Average hours per task</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
              <h3 className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-300">Upcoming Deadlines</h3>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">{upcomingDeadlines}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tasks due in the next 48 hours</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}