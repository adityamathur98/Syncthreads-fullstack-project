import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import { useNavigate } from "react-router-dom";

import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:5001/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#0817a4" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  const handleNavigate = () => {
    navigate("/api/map");
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((eachItem) => (
            <div
              key={eachItem._id}
              onClick={handleNavigate}
              className="bg-white p-6 rounded-lg shadow-lg border cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{eachItem.title}</h2>
              <p className="text-gray-600">{JSON.stringify(eachItem.value)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
