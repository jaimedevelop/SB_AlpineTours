import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const winterColors = [
  '#1D4ED8', // deep blue
  '#374151', // slate gray
  '#0369A1', // ocean blue
  '#1E40AF', // royal blue
  '#1F2937', // dark gray
  '#075985', // steel blue
];

const getRandomWinterColor = () => {
  const randomIndex = Math.floor(Math.random() * winterColors.length);
  return winterColors[randomIndex];
};

const resortsByRegion = {
  western: [
    { name: 'Mammoth Mountain', location: [37.6308, -119.0326], rating: 4.8, color: getRandomWinterColor(), city: 'Mammoth Lakes', state: 'California', image: 'https://images.unsplash.com/photo-1565896311009-382b9e813b19?auto=format&fit=crop&q=80&w=800' },
    { name: 'Squaw Valley', location: [39.1969, -120.2358], rating: 4.7, color: getRandomWinterColor(), city: 'Olympic Valley', state: 'California', image: 'https://images.unsplash.com/photo-1578593219307-c78da30cd9c9?auto=format&fit=crop&q=80&w=800' },
    { name: 'Mt. Baker', location: [48.8573, -121.6667], rating: 4.6, color: getRandomWinterColor(), city: 'Deming', state: 'Washington', image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800' },
  ],
  central: [
    { name: 'Granite Peak', location: [44.9319, -89.6832], rating: 4.3, color: getRandomWinterColor(), city: 'Wausau', state: 'Wisconsin', image: 'https://images.unsplash.com/photo-1544752796-ec0b7a4f3c1e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Lutsen Mountains', location: [47.6632, -90.7195], rating: 4.4, color: getRandomWinterColor(), city: 'Lutsen', state: 'Minnesota', image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&q=80&w=800' },
    { name: 'Mount Bohemia', location: [47.3867, -88.0208], rating: 4.5, color: getRandomWinterColor(), city: 'Mohawk', state: 'Michigan', image: 'https://images.unsplash.com/photo-1548716137-03951b8c2f74?auto=format&fit=crop&q=80&w=800' },
  ],
  rocky: [
    { name: 'Breckenridge', location: [39.4817, -106.0384], rating: 4.7, color: getRandomWinterColor(), city: 'Breckenridge', state: 'Colorado', image: 'https://images.unsplash.com/photo-1544988796-d0421a0350dc?auto=format&fit=crop&q=80&w=800' },
    { name: 'Vail', location: [39.6061, -106.3550], rating: 4.8, color: getRandomWinterColor(), city: 'Vail', state: 'Colorado', image: 'https://images.unsplash.com/photo-1544985361-b420d7a77f51?auto=format&fit=crop&q=80&w=800' },
    { name: 'Aspen Snowmass', location: [39.2084, -106.9490], rating: 4.9, color: getRandomWinterColor(), city: 'Aspen', state: 'Colorado', image: 'https://images.unsplash.com/photo-1548533001-9dc7d1b04016?auto=format&fit=crop&q=80&w=800' },
  ],
  eastern: [
    { name: 'Mad River Glen', location: [44.2027, -72.9175], rating: 4.6, color: getRandomWinterColor(), city: 'Waitsfield', state: 'Vermont', image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&q=80&w=800' },
    { name: 'Killington', location: [43.6045, -72.8201], rating: 4.5, color: getRandomWinterColor(), city: 'Killington', state: 'Vermont', image: 'https://images.unsplash.com/photo-1586800779465-e89b31f6c8df?auto=format&fit=crop&q=80&w=800' },
    { name: 'Stowe', location: [44.5303, -72.7814], rating: 4.7, color: getRandomWinterColor(), city: 'Stowe', state: 'Vermont', image: 'https://images.unsplash.com/photo-1548532369-c7e27c697f1b?auto=format&fit=crop&q=80&w=800' },
  ],
};

const regionCenters = {
  western: [41.8781, -120.0000],
  central: [44.9319, -89.6832],
  rocky: [39.5501, -106.0000],
  eastern: [40.2747, -75.4695],
};

interface MapControllerProps {
  selectedResort: any;
  markerRefs: React.MutableRefObject<{ [key: string]: any }>;
  previousResort: any;
}

function MapController({ selectedResort, markerRefs, previousResort }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedResort) {
      // Close previous popup if it exists
      if (previousResort && markerRefs.current[previousResort.name]) {
        markerRefs.current[previousResort.name].closePopup();
      }

      // Center map and open new popup
      map.setView(selectedResort.location as [number, number], 12, {
        animate: true,
        duration: 1
      });
      
      const marker = markerRefs.current[selectedResort.name];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 400); // Slight delay to ensure smooth transition
      }
    }
  }, [selectedResort, map, markerRefs, previousResort]);

  return null;
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRegion = location.state?.region || 'western';
  const resorts = resortsByRegion[selectedRegion as keyof typeof resortsByRegion];
  const mapCenter = regionCenters[selectedRegion as keyof typeof regionCenters];
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [previousResort, setPreviousResort] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<{ [key: string]: any }>({});

  const createCustomIcon = (color: string) => new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 21.875 12.5 41 12.5 41C12.5 41 25 21.875 25 12.5C25 5.59644 19.4036 0 12.5 0Z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="5.5" fill="white"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  useEffect(() => {
    const resizeEvent = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

    return () => window.clearTimeout(resizeEvent);
  }, []);

  const handleResortClick = (resort: any) => {
    setPreviousResort(selectedResort);
    setSelectedResort(resort);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleBookNow = (resort: any) => {
    sessionStorage.setItem('selectedResort', JSON.stringify(resort));
    navigate('/create-account');
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Your Perfect Ski Destinations</h1>
        <button
          onClick={() => navigate('/resorts', { state: { region: selectedRegion } })}
          className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <List className="w-5 h-5" />
          <span>List View</span>
        </button>
      </div>
      
      <div ref={mapRef} className="h-[600px] rounded-xl overflow-hidden shadow-lg bg-white">
        <MapContainer
          center={mapCenter as [number, number]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <MapController 
            selectedResort={selectedResort} 
            markerRefs={markerRefs} 
            previousResort={previousResort}
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {resorts.map((resort) => (
            <Marker
              key={resort.name}
              position={resort.location as [number, number]}
              icon={createCustomIcon(resort.color)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[resort.name] = ref;
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{resort.name}</h3>
                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-600">{resort.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {resort.city}, {resort.state}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(resort);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resorts.map((resort) => (
          <div
            key={resort.name}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-white cursor-pointer hover:bg-white/20 transition-all duration-300"
            style={{ borderLeft: `4px solid ${resort.color}` }}
            onClick={() => handleResortClick(resort)}
          >
            <h3 className="text-xl font-bold">{resort.name}</h3>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">{'★'.repeat(Math.floor(resort.rating))}</span>
              <span className="ml-2">{resort.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}