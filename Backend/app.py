from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Load model
with open("crop_fertilizer_model.pkl", "rb") as file:
    model_data = pickle.load(file)

model = model_data["model"]
soil_encoder = model_data["soil_encoder"]
crop_map = model_data["crop_map"]
fert_map = model_data["fertilizer_map"]

OPENWEATHER_API = os.getenv("OPENWEATHER_API_KEY")


def decode_crop(index):
    for i in crop_map:
        if int(i[1]) == int(index):
            return i[0]
    return "Unknown"


def decode_fertilizer(index):
    for i in fert_map:
        if int(i[1]) == int(index):
            return i[0]
    return "Unknown"


@app.route("/predict", methods=["POST"])
def predict():
    try:

        data = request.json
        print("Incoming request:", data)

        # Convert inputs
        lat = float(data["latitude"])
        lon = float(data["longitude"])

        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        ph = float(data["ph"])
        soil_color = data["soil_color"]

        # Call OpenWeather API
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API}&units=metric"

        weather_response = requests.get(weather_url)

        weather = weather_response.json()

        print("Weather API response:", weather)

        # Check if API returned correct data
        if "main" not in weather:
            return jsonify({
                "error": "Weather API failed",
                "details": weather
            }), 400

        temperature = weather["main"]["temp"]
        humidity = weather["main"]["humidity"]

        rainfall = weather.get("rain", {}).get("1h", 0)

        # Encode soil
        soil_encoded = soil_encoder.transform([soil_color])[0]

        # Prepare input for ML model
        input_data = np.array([
            soil_encoded,
            N,
            P,
            K,
            ph,
            rainfall,
            temperature
        ]).reshape(1, -1)

        prediction = model.predict(input_data)[0]

        crop = decode_crop(prediction[0])
        fertilizer = decode_fertilizer(prediction[1])

        return jsonify({
            "temperature": temperature,
            "humidity": humidity,
            "rainfall": rainfall,
            "recommended_crop": crop,
            "recommended_fertilizer": fertilizer
        })

    except Exception as e:

        print("Error:", str(e))

        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)