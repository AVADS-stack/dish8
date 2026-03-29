import { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

let googleLoaded = false;
let loadPromise = null;

function loadGoogleMaps() {
  if (googleLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject("No API key");

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      googleLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return loadPromise;
}

export default function AddressAutocomplete({ value, onChange, placeholder }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [useFallback, setUseFallback] = useState(!GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setUseFallback(true);
      return;
    }

    loadGoogleMaps()
      .then(() => {
        if (!inputRef.current || !window.google) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: "us" },
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place?.formatted_address) {
            onChange(place.formatted_address);
          }
        });
      })
      .catch(() => {
        setUseFallback(true);
      });
  }, [onChange]);

  if (useFallback) {
    return (
      <textarea
        placeholder={placeholder || "Enter your delivery address"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        required
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder || "Start typing your address..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      autoComplete="off"
    />
  );
}
