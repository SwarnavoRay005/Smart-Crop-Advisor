import React, { useState } from "react";
import { predictCrop } from "../services/Api";
import {
  FaTemperatureHigh,
  FaTint,
  FaCloudRain,
  FaMapMarkerAlt,
  FaWind,
  FaGlobeAsia,
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await predictCrop(form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    }

    setLoading(false);
  };

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

  const cropKey = result?.recommended_crop
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "");

  return (
    <div className="container">
      <div className="card">
        <h1>🌾 Smart Crop and Fertilizer Advisor</h1>

        <button className="locationBtn" onClick={getLocation}>
          <FaMapMarkerAlt /> Use My Location
        </button>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="rowName">
              <label>Latitude</label>
              <input
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
              />
            </div>

            <div className="rowName">
              <label>Longitude</label>
              <input
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="rowName">
              <label>Nitrogen</label>
              <input name="N" onChange={handleChange} />
            </div>

            <div className="rowName">
              <label>Phosphorus</label>
              <input name="P" onChange={handleChange} />
            </div>

            <div className="rowName">
              <label>Potassium</label>
              <input name="K" onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="rowName">
              <label>Soil pH</label>
              <input name="ph" onChange={handleChange} />
            </div>

            <div className="rowName">
              <label>Soil Type</label>
              <select name="soil_color" onChange={handleChange}>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Medium Brown">Medium Brown</option>
                <option value="Dark Brown">Dark Brown</option>
                <option value="Light Brown">Light Brown</option>
                <option value="Reddish Brown">Reddish Brown</option>
              </select>
            </div>
          </div>

          <button className="predictBtn">
            {loading ? "Predicting..." : "Predict Crop"}
          </button>
        </form>

        {/* ================= RESULT ================= */}
        {result && (
          <div className="dashboard">
            <h2>
              Weather Conditions {result.location && `— ${result.location}`}
            </h2>

            <div className="weather">
              <div className="weatherCard">
                <FaGlobeAsia />
                <span>Location</span>
                <p>{result.location || "N/A"}</p>
              </div>

              <div className="weatherCard">
                <FaTemperatureHigh />
                <span>Temperature</span>
                <p>{result.temperature ?? "--"} °C</p>
              </div>

              <div className="weatherCard">
                <FaTint />
                <span>Humidity</span>
                <p>{result.humidity ?? "--"}%</p>
              </div>

              <div className="weatherCard">
                <FaCloudRain />
                <span>Rainfall</span>
                <p>{result.rainfall ?? 0} mm</p>
              </div>

              <div className="weatherCard">
                <FaWind />
                <span>Wind Speed</span>
                <p>{result.wind_speed ?? "--"} m/s</p>
              </div>

              <div className="weatherCard">
                <FaGlobeAsia />
                <span>Sea Level</span>
                <p>{result.sea_level ?? "--"} hPa</p>
              </div>
            </div>

            {/* RESULT SECTION (NOW INSIDE DASHBOARD ✅) */}
            <div className="resultShowcase">
              <h2 className="resultTitle">Recommended Crops and Fertilizers</h2>

              <div className="resultGrid">
                <div className="resultCard">
                  <div className="resultLabel">🌾 Recommended Crop</div>

                  <img
                    src={cropImages[cropKey] || "/images/default.jpg"}
                    alt={result.recommended_crop}
                  />

                  <div className="resultValue">{result.recommended_crop}</div>

                  <div className="resultBadge">Optimal Yield Choice</div>
                </div>

                <div className="resultCard">
                  <div className="resultLabel">🧪 Recommended Fertilizer</div>

                  <div className="resultIcon">🧪</div>

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
