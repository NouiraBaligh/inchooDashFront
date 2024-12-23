import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { baseURL } from "../config/config";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cityStats, setCityStats] = useState([]);
  const [ordersByMonth, setOrdersByMonth] = useState(Array(12).fill(0));
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes, reviewsRes] = await Promise.all([
          fetch(`${baseURL}/orders`),
          fetch(`${baseURL}/products`),
          fetch(`${baseURL}/products/rates`),
        ]);

        const [ordersData, productsData, reviewsData] = await Promise.all([
          ordersRes.json(),
          productsRes.json(),
          reviewsRes.json(),
        ]);

        setOrders(ordersData);
        setProductsList(productsData);
        setReviews(reviewsData);

        processCityStats(ordersData);
        processOrdersByMonth(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length && productsList.length) {
      processMostOrderedProducts(orders, productsList);
    }
  }, [orders, productsList]);

  const processCityStats = (orders) => {
    const cityCounts = orders.reduce((acc, order) => {
      const city = order.city || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    setCityStats(
      Object.entries(cityCounts).map(([city, count]) => ({ city, count }))
    );
  };

  const processOrdersByMonth = (orders) => {
    const monthCounts = Array(12).fill(0);
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      monthCounts[orderDate.getMonth()] += 1;
    });
    setOrdersByMonth(monthCounts);
  };

  const processMostOrderedProducts = (orders, products) => {
    const productCounts = orders.reduce((acc, order) => {
      order.products.forEach((product) => {
        acc[product.id] = (acc[product.id] || 0) + product.quantity;
      });
      return acc;
    }, {});

    const sortedProducts = Object.entries(productCounts)
      .map(([productId, count]) => {
        const product = products.find((prod) => prod._id === productId);
        return {
          productId,
          count,
          name: product ? product.title : `Unknown Product (${productId})`,
        };
      })
      .sort((a, b) => b.count - a.count);

    setMostOrderedProducts(sortedProducts);
  };

  const processReviewsByProductAndNote = (reviews) => {
    const productReviewData = {}; // An object to store product review data

    reviews.forEach((review) => {
      const { productName, note } = review; // Extract product name and note from the review

      if (!productReviewData[productName]) {
        productReviewData[productName] = Array(5).fill(0); // Initialize array for 5-star ratings
      }

      // Increment the appropriate note count for the product
      if (note >= 1 && note <= 5) {
        productReviewData[productName][note - 1] += 1;
      }
    });

    return productReviewData;
  };
  const pieData = {
    labels: cityStats.map((stat) => stat.city),
    datasets: [
      {
        data: cityStats.map((stat) => stat.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF5A5F", "#36A2F5", "#FFB86B", "#4BC0D0"],
      },
    ],
  };

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "commandes par mois",
        data: ordersByMonth,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const mostOrderedProductsData = {
    labels: mostOrderedProducts.map((product) => product.name),
    datasets: [
      {
        label: "Produits les plus commandés",
        data: mostOrderedProducts.map((product) => product.count),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const reviewsByProductAndNoteData = (reviews) => {
    const productReviewData = processReviewsByProductAndNote(reviews);

    const labels = Object.keys(productReviewData); // Get product names for the labels
    const datasets = Object.entries(productReviewData).map(
      ([productName, noteCounts]) => ({
        label: productName,
        data: noteCounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)", // Color for 1-star reviews
          "rgba(54, 162, 235, 0.5)", // Color for 2-star reviews
          "rgba(255, 206, 86, 0.5)", // Color for 3-star reviews
          "rgba(75, 192, 192, 0.5)", // Color for 4-star reviews
          "rgba(153, 102, 255, 0.5)", // Color for 5-star reviews
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      })
    );

    return {
      labels: ["1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"], // Rating labels
      datasets: datasets,
    };
  };

  const chartOptions = (legendDisplay = true) => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        display: legendDisplay,
        position: "top",
      },
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:gap-8 md:grid-cols-3 p-4">
            <StatCard
              title="Total Des Produits"
              count={productsList.length}
              color="text-red-600"
            />
            <StatCard
              title="Total Des Commandes"
              count={orders.length}
              color="text-yellow-600"
            />
            <StatCard
              title="Total Des Avis"
              count={reviews.length}
              color="text-green-600"
            />
          </div>

          <ChartCard
            title="Commandes Par Ville"
            chart={<Pie data={pieData} options={chartOptions()} />}
          />
          <ChartCard
            title="Commandes Par Mois"
            chart={<Bar data={barData} options={chartOptions(false)} />}
          />
          <ChartCard
            title="Produits les plus commandés"
            chart={
              <Bar
                data={mostOrderedProductsData}
                options={chartOptions(false)}
              />
            }
          />
          <ChartCard
            title="Avis par note et produit"
            chart={
              <Bar
                data={reviewsByProductAndNoteData(reviews)}
                options={chartOptions(false)}
              />
            }
          />
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className="relative p-6 rounded-2xl bg-white shadow dark:bg-gray-800">
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </div>
      <div className={`text-3xl ${color}`}>{count}</div>
    </div>
  </div>
);

const ChartCard = ({ title, chart }) => (
  <div className="bg-white shadow-md p-4 rounded-lg col-span-2">
    <h2 className="text-lg font-semibold">{title}</h2>
    <div className="mt-4 h-72">{chart}</div>
  </div>
);

export default Home;
