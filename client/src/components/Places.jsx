import { Link } from "react-router-dom";
import AccountNavigation from "./AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNavigation />

      <div className="text-center">
        list of added places
        <br />
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full shadow-md shadow-gray-300"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <div className="flex gap-4 mt-4 bg-gray-200 p-4 rounded-2xl">
              <div className="w-32 h-32 bg-gray-300">
                {place.photos.length > 0 && (
                  <img src={place.photos[0]} alt="o" />
                )}
              </div>
              <h2 className="text-xl">{place.title}</h2>
              <p>{place.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
