// RegionMap.tsx
import { useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox dark style
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

// Public GeoJSON URL (full state names appear as properties.name)
const US_STATES_URL =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

/**
 * Keep your car make -> color choices here.
 * carMakesByState uses abbreviations (e.g. "NY") — we convert to full names below.
 */
const carMakesByState: Record<string, string> = {
  AL: "Ford",
  AK: "Chevrolet",
  AZ: "Toyota",
  AR: "Chevrolet",
  CA: "Toyota",
  CO: "Subaru",
  CT: "Honda",
  DE: "Honda",
  FL: "Chevrolet",
  GA: "Ford",
  HI: "Toyota",
  ID: "Ford",
  IL: "Chevrolet",
  IN: "Ford",
  IA: "Chevrolet",
  KS: "Ford",
  KY: "Chevrolet",
  LA: "Nissan",
  ME: "Subaru",
  MD: "Honda",
  MA: "Honda",
  MI: "Ford",
  MN: "Chevrolet",
  MS: "Ford",
  MO: "Chevrolet",
  MT: "Ford",
  NE: "Chevrolet",
  NV: "Toyota",
  NH: "Subaru",
  NJ: "Honda",
  NM: "Chevrolet",
  NY: "Honda",
  NC: "Toyota",
  ND: "Ford",
  OH: "Chevrolet",
  OK: "Ford",
  OR: "Subaru",
  PA: "Honda",
  RI: "Honda",
  SC: "Chevrolet",
  SD: "Ford",
  TN: "Chevrolet",
  TX: "Ford",
  UT: "Toyota",
  VT: "Subaru",
  VA: "Honda",
  WA: "Subaru",
  WV: "Ford",
  WI: "Chevrolet",
  WY: "Ford",
};

// Colors per make
const carMakeColors: Record<string, string> = {
  Toyota: "#ff6b6b",
  Ford: "#4dabf7",
  Honda: "#51cf66",
  Chevrolet: "#f59f00",
  Nissan: "#845ef7",
  Subaru: "#ffd43b",
};

// Convert abbreviation -> full name (used by the PublicaMundi GeoJSON)
const ABBR_TO_NAME: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const RegionMap: React.FC = () => {
  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    state: string;
    make: string;
  } | null>(null);

  // Build match expression pairs using full state names (properties.name)
  const matchPairs: Array<string> = [];
  Object.entries(carMakesByState).forEach(([abbr, make]) => {
    const full = ABBR_TO_NAME[abbr];
    if (full) {
      matchPairs.push(full, carMakeColors[make] ?? "#9ca3af");
    }
  });

  // final expression: ['match', ['get','name'], 'Alabama', '#ff...', 'Alaska', '#4d...', ... , fallbackColor]
  const fillColorExpression: any = ["match", ["get", "name"], ...matchPairs, "#374151"];

return (
  <div className="w-full flex justify-center">
    {/* Glass card container */}
    <div className="w-full max-w-6xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-4 flex flex-col">
      {/* Header */}
      <h3 className="text-lg text-center font-semibold mb-4 text-white drop-shadow-sm">
        📍 Popular Car Makes by State
      </h3>

      {/* Map */}
      <Map
        initialViewState={{
          longitude: -95,
          latitude: 37,
          zoom: 3.5,
        }}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: "100%", height: "300px", borderRadius: "12px" }}
        interactiveLayerIds={["states-fill"]}
        onMouseMove={(e) => {
          const feat = e.features?.find((f: any) => f.layer?.id === "states-fill");
          if (!feat) {
            setHoverInfo(null);
            return;
          }
          const stateName = feat.properties?.name ?? feat.properties?.NAME ?? "Unknown";
          const abbr =
            Object.entries(ABBR_TO_NAME).find(([, v]) => v === stateName)?.[0] ?? null;
          const make =
            (abbr && carMakesByState[abbr]) ||
            carMakesByState[stateName as keyof typeof carMakesByState] ||
            "Unknown";
          setHoverInfo({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
            state: stateName,
            make,
          });
        }}
        onMouseLeave={() => setHoverInfo(null)}
      >
        <Source id="states" type="geojson" data={US_STATES_URL}>
          <Layer
            id="states-fill"
            type="fill"
            paint={{
              "fill-color": fillColorExpression,
              "fill-opacity": 0.9,
            }}
          />
          <Layer
            id="states-outline"
            type="line"
            paint={{
              "line-color": "#000000",
              "line-width": 0.8,
            }}
          />
        </Source>

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            anchor="top"
            onClose={() => setHoverInfo(null)}
            closeOnClick={false}
          >
            <div className="text-sm text-black">
              <div className="font-semibold">{hoverInfo.state}</div>
              <div>🚗 {hoverInfo.make}</div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-white justify-center">
        {Object.entries(carMakeColors).map(([make, color]) => (
          <div key={make} className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
            {make}
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default RegionMap;
