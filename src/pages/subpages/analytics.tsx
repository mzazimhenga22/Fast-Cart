// src/pages/subpages/Analytics.tsx
import React, { useEffect, useState } from 'react';
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
import './Analytics.css';
import NavbarAdmin from '@/components/NavbarAdmin';
import Footer from '../../components/Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UserData {
  id: string;
  createdAt?: Date;
  lastActive?: Date;
  country?: string;
  age?: number;
  gender?: string;
  device?: string;
  browser?: string;
}

interface CheckoutData {
  id: string;
  userId: string;
  total: number;
  date?: Date;
  adminMessage?: string;
  cartItems: Array<any>;
  status?: string;         // Added so we can check status (e.g. "completed")
  category?: string;       // Optional: if you later add this field
  rating?: number;         // Optional: for customer rating
  referral?: string;       // Optional: for referral source
}

const Analytics: React.FC = () => {
  // State for fetched data
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [checkoutsData, setCheckoutsData] = useState<CheckoutData[]>([]);

  // User Metrics States
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [newUsers, setNewUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [topCountries, setTopCountries] = useState<[string, number][]>([]);
  const [dailySignups, setDailySignups] = useState<[string, number][]>([]);
  const [ageDistribution, setAgeDistribution] = useState<Record<string, number>>({});
  const [genderDistribution, setGenderDistribution] = useState<Record<string, number>>({});
  const [deviceDistribution, setDeviceDistribution] = useState<Record<string, number>>({});
  const [browserDistribution, setBrowserDistribution] = useState<Record<string, number>>({});
  const [loginTimeHistogram, setLoginTimeHistogram] = useState<Record<string, number>>({});

  // Sales Metrics States
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(0);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [onReviewOrders, setOnReviewOrders] = useState<number>(0);
  const [salesByCategory, setSalesByCategory] = useState<Record<string, { count: number; revenue: number }>>({});
  const [referralSources, setReferralSources] = useState<Record<string, number>>({});
  const [customerSatisfaction, setCustomerSatisfaction] = useState<number>(0);

  // Additional Metrics
  const [userRetentionRate, setUserRetentionRate] = useState<number>(0);
  const [averageSessionDuration, setAverageSessionDuration] = useState<number>(0);
  const [bounceRate, setBounceRate] = useState<number>(0);
  const [userEngagementScore, setUserEngagementScore] = useState<number>(0);
  const [churnRate, setChurnRate] = useState<number>(0);
  const [lifetimeValue, setLifetimeValue] = useState<number>(0);
  const [monthlyActiveUsers, setMonthlyActiveUsers] = useState<number>(0);
  const [weeklyActiveUsers, setWeeklyActiveUsers] = useState<number>(0);

  // Chart data for Daily Signups
  const [dailyChartData, setDailyChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Daily Signups',
        data: [] as number[],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  });

  // 1) Fetch data from /api/analytics on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();

        // Convert date strings into Date objects for users
        const fetchedUsers: UserData[] = data.usersData.map((u: any) => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
          lastActive: u.lastActive ? new Date(u.lastActive) : undefined,
        }));

        // Convert date strings into Date objects for checkouts
        const fetchedCheckouts: CheckoutData[] = data.checkoutsData.map((c: any) => ({
          ...c,
          date: c.date ? new Date(c.date) : undefined,
        }));

        setUsersData(fetchedUsers);
        setCheckoutsData(fetchedCheckouts);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
    }
    fetchData();
  }, []);

  // 2) Recompute metrics whenever usersData or checkoutsData changes
  useEffect(() => {
    // --- User Metrics ---
    setTotalUsers(usersData.length);
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // New Users (Last 7 Days)
    const newUsersCount = usersData.filter(
      (user) => user.createdAt && user.createdAt >= oneWeekAgo
    ).length;
    setNewUsers(newUsersCount);

    // Active Users (Last 24 Hours)
    const activeCount = usersData.filter(
      (user) => user.lastActive && user.lastActive >= oneDayAgo
    ).length;
    setActiveUsers(activeCount);

    // Top Countries
    const countryCounts: Record<string, number> = {};
    usersData.forEach((user) => {
      if (user.country) {
        countryCounts[user.country] = (countryCounts[user.country] || 0) + 1;
      }
    });
    setTopCountries(Object.entries(countryCounts).sort((a, b) => b[1] - a[1]));

    // Daily Signups
    const dailyCounts: Record<string, number> = {};
    usersData.forEach((user) => {
      if (user.createdAt) {
        const dateStr = user.createdAt.toISOString().split('T')[0];
        dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
      }
    });
    const sortedDaily = Object.entries(dailyCounts).sort((a, b) => a[0].localeCompare(b[0]));
    setDailySignups(sortedDaily);
    setDailyChartData({
      labels: sortedDaily.map(([date]) => date),
      datasets: [
        {
          label: 'Daily Signups',
          data: sortedDaily.map(([, count]) => count),
          backgroundColor: 'rgba(75,192,192,0.6)',
        },
      ],
    });

    // Age Distribution
    const ageDist: Record<string, number> = {
      'Under 20': 0,
      '20-29': 0,
      '30-39': 0,
      '40-49': 0,
      '50+': 0,
    };
    usersData.forEach((user) => {
      if (typeof user.age === 'number') {
        if (user.age < 20) ageDist['Under 20'] += 1;
        else if (user.age < 30) ageDist['20-29'] += 1;
        else if (user.age < 40) ageDist['30-39'] += 1;
        else if (user.age < 50) ageDist['40-49'] += 1;
        else ageDist['50+'] += 1;
      }
    });
    setAgeDistribution(ageDist);

    // Gender, Device, Browser Distributions
    const genderDist: Record<string, number> = {};
    const deviceDist: Record<string, number> = {};
    const browserDist: Record<string, number> = {};
    usersData.forEach((user) => {
      if (user.gender) {
        genderDist[user.gender] = (genderDist[user.gender] || 0) + 1;
      }
      if (user.device) {
        deviceDist[user.device] = (deviceDist[user.device] || 0) + 1;
      }
      if (user.browser) {
        browserDist[user.browser] = (browserDist[user.browser] || 0) + 1;
      }
    });
    setGenderDistribution(genderDist);
    setDeviceDistribution(deviceDist);
    setBrowserDistribution(browserDist);

    // Login Time Histogram (by hour)
    const loginHistogram: Record<string, number> = {};
    usersData.forEach((user) => {
      if (user.lastActive) {
        const hour = user.lastActive.getHours();
        const hourStr = `${hour}:00`;
        loginHistogram[hourStr] = (loginHistogram[hourStr] || 0) + 1;
      }
    });
    setLoginTimeHistogram(loginHistogram);

    // --- Sales Metrics (Checkouts) ---
    setTotalOrders(checkoutsData.length);

    // Count orders by status (using dot notation now that status is declared)
    setCompletedOrders(checkoutsData.filter(c => c.status === 'completed').length);
    setOnReviewOrders(checkoutsData.filter(c => c.status === 'on review').length);

    // Sum revenue from all checkouts
    const revenue = checkoutsData.reduce((sum, c) => sum + c.total, 0);
    setTotalRevenue(revenue);

    // Conversion Rate: (# checkouts / # total users) * 100
    setConversionRate(usersData.length > 0 ? (checkoutsData.length / usersData.length) * 100 : 0);

    // Average Order Value
    setAverageOrderValue(checkoutsData.length > 0 ? revenue / checkoutsData.length : 0);

    // Sales by Category, Referral Sources, and Ratings (if available)
    const categorySales: Record<string, { count: number; revenue: number }> = {};
    const referrals: Record<string, number> = {};
    const ratings: number[] = [];

    checkoutsData.forEach((order) => {
      // For categories (if available)
      const cat = order.category || 'Uncategorized';
      if (!categorySales[cat]) {
        categorySales[cat] = { count: 0, revenue: 0 };
      }
      categorySales[cat].count += 1;
      categorySales[cat].revenue += order.total;

      // For referrals (if available)
      if (order.referral) {
        referrals[order.referral] = (referrals[order.referral] || 0) + 1;
      }

      // For ratings (if available)
      if (typeof order.rating === 'number') {
        ratings.push(order.rating);
      }
    });
    setSalesByCategory(categorySales);
    setReferralSources(referrals);
    setCustomerSatisfaction(ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0);

    // --- Additional Metrics ---
    // User Retention: percentage of users who placed more than one order
    const ordersByUser: Record<string, number> = {};
    checkoutsData.forEach((order) => {
      ordersByUser[order.userId] = (ordersByUser[order.userId] || 0) + 1;
    });
    const retainedUsers = Object.values(ordersByUser).filter(count => count > 1).length;
    setUserRetentionRate(Object.keys(ordersByUser).length > 0 ? (retainedUsers / Object.keys(ordersByUser).length) * 100 : 0);

    // Dummy values (replace with actual calculations if available)
    setAverageSessionDuration(5); // minutes
    setBounceRate(40);            // percentage
    const engagedUsers = Object.keys(ordersByUser).length;
    setUserEngagementScore(engagedUsers > 0 ? checkoutsData.length / engagedUsers : 0);

    // Churn Rate: percentage of users not active in the last 30 days
    const churnedUsers = usersData.filter(user => user.lastActive && user.lastActive < thirtyDaysAgo).length;
    setChurnRate(usersData.length > 0 ? (churnedUsers / usersData.length) * 100 : 0);

    // Lifetime Value: total revenue divided by the number of users who placed an order
    const usersWithOrders = new Set(checkoutsData.map(o => o.userId));
    setLifetimeValue(usersWithOrders.size > 0 ? revenue / usersWithOrders.size : 0);

    // Monthly & Weekly Active Users
    setMonthlyActiveUsers(usersData.filter(user => user.lastActive && user.lastActive >= thirtyDaysAgo).length);
    setWeeklyActiveUsers(usersData.filter(user => user.lastActive && user.lastActive >= oneWeekAgo).length);

  }, [usersData, checkoutsData]);

  return (
    <>
      <NavbarAdmin />
      <div className="analyticsPage">
        <h1>Admin Analytics Dashboard</h1>

        {/* User Metrics Section */}
        <h2>User Metrics</h2>
        <div className="cardsContainer">
          <div className="card">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
          <div className="card">
            <h3>New Users (Last 7 Days)</h3>
            <p>{newUsers}</p>
          </div>
          <div className="card">
            <h3>Active Users (Last 24 Hours)</h3>
            <p>{activeUsers}</p>
          </div>
          <div className="card">
            <h3>Monthly Active Users</h3>
            <p>{monthlyActiveUsers}</p>
          </div>
          <div className="card">
            <h3>Weekly Active Users</h3>
            <p>{weeklyActiveUsers}</p>
          </div>
          <div className="card">
            <h3>Churn Rate</h3>
            <p>{churnRate.toFixed(2)}%</p>
          </div>
        </div>

        {/* Sales Metrics Section */}
        <h2>Sales Metrics</h2>
        <div className="cardsContainer">
          <div className="card">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="card">
            <h3>Completed Orders</h3>
            <p>{completedOrders}</p>
          </div>
          <div className="card">
            <h3>Orders on Review</h3>
            <p>{onReviewOrders}</p>
          </div>
          <div className="card">
            <h3>Total Revenue</h3>
            <p>${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Conversion Rate</h3>
            <p>{conversionRate.toFixed(2)}%</p>
          </div>
          <div className="card">
            <h3>Average Order Value</h3>
            <p>${averageOrderValue.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Lifetime Value</h3>
            <p>${lifetimeValue.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Customer Satisfaction</h3>
            <p>{customerSatisfaction.toFixed(2)} / 5</p>
          </div>
        </div>

        {/* Charts Section */}
        <h2>Charts</h2>
        <div className="chartsContainer">
          <div className="chartCard">
            <h3>Daily Signups</h3>
            <Bar data={dailyChartData} />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <h2>Detailed Breakdown</h2>
        <div className="cardsContainer">
          <div className="card">
            <h3>Top Countries</h3>
            <ul>
              {topCountries.map(([country, count], idx) => (
                <li key={idx}>
                  {country}: {count}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Sales by Category</h3>
            <ul>
              {Object.entries(salesByCategory).map(([category, data], idx) => (
                <li key={idx}>
                  {category}: {data.count} orders, ${data.revenue.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Referral Sources</h3>
            <ul>
              {Object.entries(referralSources).map(([source, count], idx) => (
                <li key={idx}>
                  {source}: {count}
                </li>
              ))}
            </ul>
          </div>
          {/* Add additional breakdown sections as needed */}
        </div>

        {/* Additional Metrics */}
        <h2>Additional Metrics</h2>
        <div className="cardsContainer">
          <div className="card">
            <h3>User Retention Rate</h3>
            <p>{userRetentionRate.toFixed(2)}%</p>
          </div>
          <div className="card">
            <h3>Average Session Duration</h3>
            <p>{averageSessionDuration} minutes</p>
          </div>
          <div className="card">
            <h3>Bounce Rate</h3>
            <p>{bounceRate}%</p>
          </div>
          <div className="card">
            <h3>User Engagement Score</h3>
            <p>{userEngagementScore.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Analytics;
