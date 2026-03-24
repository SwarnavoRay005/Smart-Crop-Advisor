import React, { useState } from "react";
import { predictCrop } from "../services/Api";
import {
  FaTemperatureHigh,
  FaTint,
  FaCloudRain,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Form() {
  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    N: "",
    P: "",
    K: "",
    ph: "",
    soil_color: "Black",
  });

  const [result, setResult] = useState(null);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= GET LOCATION =================
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await predictCrop(form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    }
  };

  // ================= CROP IMAGES =================
  const cropImages = {
    sugarcane: "/images/sugarcane.jpg",
    jowar: "/images/jowar.jpg",
    cotton: "/images/cotton.jpg",
    rice: "/images/rice.jpg",
    wheat: "/images/wheat.jpg",
    groundnut: "/images/groundnut.jpg",
    maize: "/images/maize.jpg",
    tur: "/images/tur.jpg",
    moong: "/images/moong.jpg",
    gram: "/images/gram.jpg",
    masoor: "/images/masoor.jpg",
    soyabean: "/images/soyabean.jpg",
    urad: "/images/urad.jpg",
    ginger: "/images/ginger.jpg",
    turmeric: "/images/turmeric.jpg",
    grapes: "/images/grapes.jpg",
  };

  // Normalize backend output safely
  const cropKey = result?.recommended_crop
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "");

  return (
    <div className="container">
      <div className="card">
        <h1>🌾 Smart Crop Advisor</h1>

        {/* LOCATION BUTTON */}
        <button className="locationBtn" onClick={getLocation}>
          <FaMapMarkerAlt /> Use My Location
        </button>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              name="latitude"
              value={form.latitude}
              placeholder="Latitude"
              onChange={handleChange}
            />
            <input
              name="longitude"
              value={form.longitude}
              placeholder="Longitude"
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <input name="N" placeholder="Nitrogen" onChange={handleChange} />
            <input name="P" placeholder="Phosphorus" onChange={handleChange} />
            <input name="K" placeholder="Potassium" onChange={handleChange} />
          </div>

          <div className="row">
            <input name="ph" placeholder="Soil pH" onChange={handleChange} />

            <select name="soil_color" onChange={handleChange}>
              <option value="Black">Black</option>
              <option value="Red">Red</option>
              <option value="Medium Brown">Medium Brown</option>
              <option value="Dark Brown">Dark Brown</option>
              <option value="Light Brown">Light Brown</option>
              <option value="Reddish Brown">Reddish Brown</option>
            </select>
          </div>

          <button className="predictBtn">Predict Crop</button>
        </form>

        {/* ================= RESULT DASHBOARD ================= */}
        {result && (
          <div className="dashboard">
            {/* WEATHER */}
            <h2>Weather Conditions</h2>

            <div className="weather">
              <div className="weatherCard">
                <FaTemperatureHigh />
                <p>{result.temperature} °C</p>
              </div>

              <div className="weatherCard">
                <FaTint />
                <p>{result.humidity}%</p>
              </div>

              <div className="weatherCard">
                <FaCloudRain />
                <p>{result.rainfall} mm</p>
              </div>
            </div>

            {/* RESULT SHOWCASE */}
            <div className="resultShowcase">
              <h2 className="resultTitle">AI Recommendation</h2>

              <div className="resultGrid">
                {/* CROP CARD */}
                <div className="resultCard">
                  <div className="resultLabel">🌾 Recommended Crop</div>

                  <img
                    src={cropImages[cropKey] || "/images/default.jpg"}
                    alt={result.recommended_crop}
                    style={{
                      width: "100%",
                      borderRadius: "20px",
                      marginBottom: "20px",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                      objectFit: "cover",
                      height: "320px",
                    }}
                  />

                  <div className="resultValue">
                    {result.recommended_crop}
                  </div>

                  <div className="resultBadge">Optimal Yield Choice</div>
                </div>

                {/* FERTILIZER CARD */}
                <div className="resultCard">
                  <div className="resultLabel">
                    🧪 Recommended Fertilizer
                  </div>

                  <div style={{ fontSize: "90px", marginBottom: "12px" }}>
                    🧪
                  </div>

                  <div className="resultValue">
                    {result.recommended_fertilizer}
                  </div>

                  <div className="resultBadge">Soil-Balanced Formula</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;