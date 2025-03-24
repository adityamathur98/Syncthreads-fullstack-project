import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { ClipLoader } from "react-spinners";

import Header from "../Header";

const MapComponent = () => {
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  async function fetchMapData() {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:5001/api/map", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      setMapData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching Map Data");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#4A90E2" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Map View</h1>
        {mapData ? (
          <MapContainer
            center={mapData.center}
            zoom={mapData.zoom}
            style={{ height: "500px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={mapData.center}>
              <Popup>{mapData?.message || "Location"}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="text-center text-gray-600">No map data available</div>
        )}
      </div>
    </>
  );
};

export default MapComponent;
