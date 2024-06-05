import BackgroundImage from "./assets/image.webp";
import Cloud1 from "./assets/vecteezy_realistic-white-cloud_12595156.png";
import Cloud2 from "./assets/2-cloud-png-image.png";
import Cloud3 from "./assets/9-cloud-png-image.png";
import { useEffect, useState } from "react";

function WeatherComponent({ isMobile }: { isMobile: boolean }) {
  const apiKey = "3b3c1cc94c19af0bf92b9190c4a2187e";
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [weatherData, setWeatherData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Geolocation is supported by the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchWeatherData();
    }
  }, [lat, lon]);

  const fetchWeatherData = () => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lang=en&units=metric&lat=${lat}&lon=${lon}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Weather Data:", data);
        setWeatherData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  /*
  {
    "coord":{"lon":0.1458,"lat":51.5777},
    "weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],
    "base":"stations",
    "main":{"temp":15.89,"feels_like":14.74,"temp_min":14.61,"temp_max":16.72,"pressure":1015,"humidity":46},
    "visibility":10000,
    "wind":{"speed":4.12,"deg":290},
    "clouds":{"all":57},
    "dt":1717612181,
    "sys":{"type":2,"id":2006068,"country":"GB","sunrise":1717559082,"sunset":1717618293},
    "timezone":3600,
    "id":6690869,
    "name":"Chadwell Heath",
    "cod":200
  }
  */

  return (
    <div
      className={`container ${isMobile ? "w-75" : "w-50"} bg-white rounded p-4`}
    >
      {isLoading ? (
        <div>Allow access for a weather report 🤗</div>
      ) : weatherData == null || !weatherData ? (
        <div>Data Null</div>
      ) : (
        <>
          {isMobile ? (
            <>
              <h1 className="text-muted d-flex align-items-center text-center justify-content-center">
                {weatherData.name}
              </h1>
              <div className="container d-flex justify-content-center">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt=""
                />
              </div>
            </>
          ) : (
            <div className="container d-flex flex-row justify-content-between">
              <h1 className="text-muted d-flex align-items-center">
                {weatherData.name}
              </h1>
              <img
                src={`http://openweathermap.org/img/wn/${
                  weatherData.weather[0].icon
                }${!isMobile ? "@2x" : ""}.png`}
                alt=""
              />
            </div>
          )}
          <div className="container">
            <table className="table">
              <tbody>
                {[
                  ["Weather", weatherData.weather[0].description],
                  ["Temperature", `${weatherData.main.temp}°c`],
                  ["Pressure", weatherData.main.pressure],
                  ["Humidity", weatherData.main.humidity],
                  ["Wind Speed", weatherData.wind.speed],
                ].map(([dataType, dataValue]) => (
                  <tr>
                    <th className={`text-muted ${"py-3 align-middle"}`}>
                      {dataType}
                      {isMobile && ":"}
                    </th>
                    <td className="py-3 align-middle">{dataValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function CloudComponant({ isMobile }: { isMobile: boolean }) {
  const [cloudType, setCloudType] = useState(
    [Cloud1, Cloud2, Cloud3][Math.floor(Math.random() * 3)]
  );
  const CloudHeight = Math.floor(Math.random() * 61);
  const [cloudClass, setCloudClass] = useState("cloud-start");
  const [cloudTime, setCloudTime] = useState(0);
  const [cloudRefresh, setCloudRefresh] = useState(0);

  useEffect(() => {
    const newCloudTime = Math.floor(Math.random() * (60 - 25 + 1)) + 25;
    setCloudTime(newCloudTime);
    setTimeout(() => {
      setCloudClass("cloud-end");
      setTimeout(() => {
        setCloudClass("cloud-start");
        setTimeout(() => {
          setCloudRefresh(cloudRefresh + 1);
          setCloudType([Cloud1, Cloud2, Cloud3][Math.floor(Math.random() * 3)]);
        }, newCloudTime * 1000);
      }, newCloudTime * 1000);
    }, Math.floor(Math.random() * (5000 - 200 + 1)) + 200);
  }, [cloudRefresh]);

  return (
    <img
      role="button"
      onClick={() => {
        console.log([Cloud1, Cloud2, Cloud3].filter((x) => x != cloudType));
        setCloudType(
          [Cloud1, Cloud2, Cloud3].filter((x) => x != cloudType)[
            Math.floor(Math.random() * 2)
          ]
        );
      }}
      className={`position-absolute start-0 cloud ${cloudClass}`}
      style={{
        width: `${Math.floor(Math.random() * (40 - 15 + 1)) + 15}${
          isMobile ? "vh" : "vw"
        }`,
        translate: `${cloudClass == "cloud-start" ? "-100%" : "100vw"}`,
        transition: `translate ${cloudTime}s linear`,
        top: `${CloudHeight}vh`,
      }}
      src={cloudType}
      alt=""
    />
  );
}

function App() {
  const isMobile = window.matchMedia("(orientation: portrait)").matches;

  return (
    <div
      className="container-background w-100 h-100 p-0 m-0 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url("${BackgroundImage}")`,
      }}
    >
      <WeatherComponent isMobile={isMobile}></WeatherComponent>
      <CloudComponant isMobile={isMobile}></CloudComponant>
      <CloudComponant isMobile={isMobile}></CloudComponant>
      <CloudComponant isMobile={isMobile}></CloudComponant>
    </div>
  );
}

export default App;
