// 5. Box generating on click , in a upper-left corner contains Lat-Long & Place Name
import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map'; 
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import style from '../styles/CityNamePopup.module.scss';

export default function CityNamePopup() {
  const mapRef = useRef<HTMLDivElement | null>(null); 
  const popupRef = useRef<HTMLDivElement | null>(null); 

  const [hoverCoordinates, setHoverCoordinates] = useState<{ lat: number; lon: number }>({ lat: 0, lon: 0 });
  const [clickCoordinates, setClickCoordinates] = useState<{ lat: number; lon: number }>({ lat: 0, lon: 0 });
  const [placeName, setPlaceName] = useState<string>(''); 
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => { 
    if (mapRef.current) {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([81.19, 23.25]),
          zoom: 4.7,
        }),
      });

      map.on('pointermove', (event) => {
        const lonLat = toLonLat(event.coordinate);
        setHoverCoordinates({ lat: lonLat[1], lon: lonLat[0] });
      });

      map.on('singleclick', async (event) => {
        const lonLat = toLonLat(event.coordinate);
        setClickCoordinates({ lat: lonLat[1], lon: lonLat[0] });

        // Nominatim API
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lonLat[1]}&lon=${lonLat[0]}`);
        
        if (response.ok) {
          const data = await response.json();
          setPlaceName(data.display_name || 'No place found'); 
        } else {
          setPlaceName('No place found'); 
        }

        setPopupVisible(true);
      });
    }
  }, []);

  const closePopup = () => {
    setPopupVisible(false);
    setPlaceName('');
    // setClickCoordinates({ lat: 0, lon: 0 }); // Optionally reset coordinates
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: 'black' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div>
        Latitude : {hoverCoordinates.lat.toFixed(5)} 
        <br />
        Longitude : {hoverCoordinates.lon.toFixed(5)}
      </div>

      {/* Popup */}
      <div ref={popupRef} className={style.popupOn}>
        
        <button onClick={closePopup} 
        className={style.popupClose}>
          &times; {/* Cross symbol */}
        </button>
        
        Latitude : {clickCoordinates.lat.toFixed(5)} 
        <br />
        Longitude : {clickCoordinates.lon.toFixed(5)}
        <br />
        Place : {placeName}
      </div>
    </div>
  );
}

