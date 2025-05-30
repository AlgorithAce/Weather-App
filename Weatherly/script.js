<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Weather Luxe</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-dark: linear-gradient(to bottom right, #0f172a, #1e293b, #111827);
      --bg-light: linear-gradient(to bottom right, #cbd5e1, #f8fafc, #e2e8f0);
    }

    body {
      font-family: 'Outfit', sans-serif;
      transition: background 0.5s ease-in-out, color 0.5s ease-in-out;
      background: var(--bg-dark);
      color: white;
      min-height: 100vh;
      margin: 0;
    }

    body.light {
      background: var(--bg-light);
      color: #1e293b;
    }

    .glass {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      transition: background 0.5s ease-in-out, color 0.5s ease-in-out;
    }

    .light .glass {
      background: rgba(255, 255, 255, 0.4);
      color: #1e293b;
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }

      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .theme-toggle {
      position: absolute;
      top: 1rem;
      right: 1rem;
      cursor: pointer;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(6px);
      border-radius: 9999px;
      color: white;
      font-weight: 600;
      transition: background 0.3s;
      user-select: none;
      z-index: 10;
    }

    .light .theme-toggle {
      background: rgba(0, 0, 0, 0.1);
      color: #1e293b;
    }

    /* Forecast containers styling */
    #hourlyForecast,
    #weeklyForecast {
      display: flex;
      overflow-x: auto;
      gap: 1rem;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }

    #hourlyForecast > div,
    #weeklyForecast > div {
      flex-shrink: 0;
    }

    /* Scrollbar styling */
    #hourlyForecast::-webkit-scrollbar,
    #weeklyForecast::-webkit-scrollbar {
      height: 8px;
    }

    #hourlyForecast::-webkit-scrollbar-thumb,
    #weeklyForecast::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }
  </style>
</head>

<body>
  <div class="flex justify-center items-center gap-4 mb-4 mt-8">
    <!-- Sun -->
    <svg class="w-12 h-12 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
      <path
        d="M10 3.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zm5.657 1.636a.5.5 0 01.707.707l-.707.707a.5.5 0 11-.707-.707l.707-.707zM16.5 10a.5.5 0 01.5.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm-1.636 5.657a.5.5 0 01.707 0l.707.707a.5.5 0 11-.707.707l-.707-.707a.5.5 0 010-.707zM10 16.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM4.343 15.657a.5.5 0 01.707 0l.707.707a.5.5 0 11-.707.707l-.707-.707a.5.5 0 010-.707zM3.5 10a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM5 5a.5.5 0 01.707 0l.707.707a.5.5 0 11-.707.707L5 5.707A.5.5 0 015 5zM10 6a4 4 0 100 8 4 4 0 000-8z" />
    </svg>

    <!-- Cloud -->
    <svg class="w-12 h-12 text-white opacity-70 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 10a4 4 0 014-4 4 4 0 017.9.6 5.002 5.002 0 01.1 9.9H6a4 4 0 01-2-7.5z" />
    </svg>
  </div>

  <!-- Theme toggle -->
  <div id="themeToggle" class="theme-toggle">Toggle Theme</div>

  <div class="max-w-3xl mx-auto p-6">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-semibold">Weatherly</h1>
      <p class="text-sm text-slate-400">Real-Time Forecast</p>
    </div>

    <!-- Temperature Chart -->
    <canvas id="tempChart" width="400" height="200" class="mb-6 w-full max-w-xl mx-auto hidden"></canvas>

    <!-- Search Box -->
    <div class="flex items-center gap-2 mb-6">
      <input id="cityInput" type="text" placeholder="Enter city..."
        class="flex-1 p-3 rounded-xl bg-slate-800 text-white placeholder-slate-400" />
      <button id="searchBtn" onclick="getWeatherByCity()"
        class="bg-indigo-600 px-4 py-3 rounded-xl font-medium hover:bg-indigo-700">Search</button>
    </div>

    <div id="currentWeather" class="glass p-6 rounded-2xl mb-6 text-center opacity-0">
      <h2 id="cityName" class="text-2xl font-semibold mb-1"></h2>
      <div id="temperature" class="text-5xl font-bold"></div>
      <div id="condition" class="text-md text-slate-300 capitalize"></div>
      <p id="feelsLike" class="text-sm mt-2"></p>
      <p id="highLow" class="text-sm"></p>
    </div>

    <div
      class="glass p-4 rounded-xl mb-6 grid grid-cols-2 gap-4 text-sm bg-white/10 border border-white/20">
      <div><strong>Humidity:</strong> <span id="humidity"></span></div>
      <div><strong>Wind:</strong> <span id="wind"></span></div>
      <div><strong>Visibility:</strong> <span id="visibility"></span></div>
      <div><strong>Pressure:</strong> <span id="pressure"></span></div>
    </div>

    <!-- Hourly Forecast -->
    <div id="hourlyForecast" aria-label="Hourly Forecast"></div>

    <!-- Weekly Forecast -->
    <div id="weeklyForecast" aria-label="Weekly Forecast"></div>

    <div id="airQuality" class="glass p-6 rounded-xl">
      <h3 class="text-xl font-semibold mb-3">Air Quality Index (AQI):</h3>
      <p><span id="aqi" class="font-bold text-lg">--</span></p>
      <p>PM2.5: <span id="pm25">--</span></p>
      <p>PM10: <span id="pm
