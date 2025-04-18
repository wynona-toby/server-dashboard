import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import { Bar, Pie, Line, Radar } from 'react-chartjs-2'; // Importing React-Chartjs-2 for Bar, Pie, Line, and Radar charts
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, RadarController, RadialLinearScale, PointElement, LineElement } from 'chart.js';
import supabase from './supabase'; // Import your Supabase client

// Registering the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, RadarController, RadialLinearScale, PointElement, LineElement);

const App = () => {
  const [servers, setServers] = useState([]);  // Store server data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState({ online: 0, offline: 0 });  // For pie chart (Status)
  const [alertLevelCounts, setAlertLevelCounts] = useState({ low: 0, medium: 0, critical: 0 }); // For alert level distribution

  useEffect(() => {
    // Fetch servers data from Supabase API on component mount
    const fetchServers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from Supabase
        const { data, error } = await supabase
          .from('servers')  // Replace 'servers' with your actual table name
          .select('*');  // Select all columns
          console.log(data,error); // Log the server data fetched from Supabase

        if (error) {
          throw new Error(error.message);
        }

        // Setting the fetched data into state
        setServers(data);

        // Prepare status data for pie chart (online vs offline)
        const statusCounts = data.reduce((acc, server) => {
          if (server.status === 'online') acc.online += 1;
          if (server.status === 'offline') acc.offline += 1;
          return acc;
        }, { online: 0, offline: 0 });

        setStatusData(statusCounts);  // Set the status counts
        
        // Prepare alert level distribution data
        const alertCounts = data.reduce((acc, server) => {
          if (server.alert_level === 'critical') acc.critical += 1;
          if (server.alert_level === 'medium') acc.medium += 1;
          if (server.alert_level === 'low') acc.low += 1;
          return acc;
        }, { low: 0, medium: 0, critical: 0 });

        setAlertLevelCounts(alertCounts); // Set the alert level distribution

      } catch (err) {
        setError('Error fetching servers data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);  // Empty array means this runs once when the component mounts

  // Bar chart data for CPU, RAM, Disk Usage
  const barChartData = {
    labels: servers.map(server => server.name),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: servers.map(server => server.cpu_usage),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'RAM Usage (%)',
        data: servers.map(server => server.ram_usage),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'Disk Usage (%)',
        data: servers.map(server => server.disk_usage),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  };

  // Pie chart data for server status (online vs offline)
  const pieChartData = {
    labels: ['Online', 'Offline'],
    datasets: [{
      data: [statusData.online, statusData.offline],
      backgroundColor: ['#28a745', '#dc3545'],
      hoverBackgroundColor: ['#218838', '#c82333']
    }]
  };

  // Bar chart data for alert level distribution
  const alertLevelData = {
    labels: ['Low', 'Medium', 'Critical'],
    datasets: [{
      data: [alertLevelCounts.low, alertLevelCounts.medium, alertLevelCounts.critical],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      hoverBackgroundColor: ['#218838', '#e0a800', '#c82333']
    }]
  };

  // Line chart data for network traffic (assuming network_traffic exists)
  const networkTrafficData = {
    labels: servers.map(server => server.name),
    datasets: [{
      label: 'Network Traffic (MB)',
      data: servers.map(server => server.network_traffic), 
      fill: false,
      borderColor: '#007bff',
      tension: 0.1
    }]
  };

  // Radar chart data for resource usage comparison
  const radarChartData = {
    labels: servers.map(server => server.name),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: servers.map(server => server.cpu_usage),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'RAM Usage (%)',
        data: servers.map(server => server.ram_usage),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'Disk Usage (%)',
        data: servers.map(server => server.disk_usage),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  };

  // Alert level visualization with color coding
  const renderAlertLevel = (level) => {
    let alertClass = '';
    switch (level) {
      case 'critical':
        alertClass = 'bg-danger text-white';
        break;
      case 'medium':
        alertClass = 'bg-warning';
        break;
      case 'low':
        alertClass = 'bg-success';
        break;
      default:
        alertClass = '';
    }
    return <span className={`badge ${alertClass}`}>{level}</span>;
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-primary">Server Monitoring Dashboard</h1>
  
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm rounded-lg">
            <div className="card-header text-center">
              <h5>Resource Usage</h5>
            </div>
            <div className="card-body p-2">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function (value) {
                          return value + '%';
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
  
      <div className="row mb-4">
        {/* Server Status Pie Chart */}
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="card shadow-sm rounded-lg h-5">
            <div className="card-header text-center">
              <h5>Server Status</h5>
            </div>
            <div className="card-body p-2" style={{ height: '300px' }}>
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
  
        {/* Alert Level Distribution */}
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="card shadow-sm rounded-lg h-20">
            <div className="card-header text-center">
              <h5>Alert Level Distribution</h5>
            </div>
            <div className="card-body p-2">
              <Bar data={alertLevelData} />
            </div>
          </div>
        </div>
  
        {/* Network Traffic Line Chart */}
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="card shadow-sm rounded-lg h-10">
            <div className="card-header text-center">
              <h5>Network Traffic</h5>
            </div>
            <div className="card-body p-2">
              <Line data={networkTrafficData} />
            </div>
          </div>
        </div>
      </div>
 
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm rounded-lg">
            <div className="card-header text-center">
              <h5>Server Details</h5>
            </div>
            <div className="card-body">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Server Name</th>
                    <th>Status</th>
                    <th>IP Address</th>
                    <th>CPU Usage (%)</th>
                    <th>RAM Usage (%)</th>
                    <th>Disk Usage (%)</th>
                    <th>Network Traffic (MB)</th>
                    <th>Alert Level</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {servers.map(server => (
                    <tr key={server.id}>
                      <td>{server.name}</td>
                      <td>{server.status}</td>
                      <td>{server.ip_address}</td>
                      <td>{server.cpu_usage}</td>
                      <td>{server.ram_usage}</td>
                      <td>{server.disk_usage}</td>
                      <td>{server.network_traffic}</td>
                      <td>{renderAlertLevel(server.alert_level)}</td>
                      <td>{server.created_on}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm rounded-lg">
            <div className="card-header text-center" >
              <h5>Resource Usage Comparison (Radar)</h5>
            </div>
            <div className="card-body p-2" style={{ height: '200' }}>
              <Radar data={radarChartData} />
            </div>
          </div>
        </div>
      </div>
  
      
    </div>
  );
};

export default App;