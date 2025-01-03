import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { Resort } from '../types/resort';
import { ResortInfoWindow } from './ResortInfoWindow';
import { useResorts } from '../hooks/useResorts';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 39.8283,  // Roughly centers the US
  lng: -98.5795
};

export function ResortMap() {
  const resorts = useResorts();
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);

  useEffect(() => {
    console.log('Current resorts:', resorts);
  }, [resorts]);

  const handleMarkerClick = useCallback((resort: Resort) => {
    setSelectedResort(resort);
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDkEJDRE91g9yTcCIC14hPLMPRmhIs6k4k">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={4}
        center={center}
      >
        {resorts.length > 0 ? (
          resorts.map((resort) => (
            <Marker
              key={resort.id}
              position={{ lat: resort.latitude, lng: resort.longitude }}
              onClick={() => handleMarkerClick(resort)}
              icon={{
                url: 'data:image/svg+xml,' + encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
                ),
                scaledSize: new google.maps.Size(30, 30)
              }}
            />
          ))
        ) : (
          <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
            Loading resorts...
          </div>
        )}

        {selectedResort && (
          <InfoWindow
            position={{ lat: selectedResort.latitude, lng: selectedResort.longitude }}
            onCloseClick={() => setSelectedResort(null)}
          >
            <ResortInfoWindow resort={selectedResort} />
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}