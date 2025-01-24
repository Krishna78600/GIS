// 6. PopUp Generates on the clicked point having Lat-Long & cross button 

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map'; 
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay'; 
import style from '../styles/PopupOnClick.module.scss';

export default function PopupOnClick() {
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
        
        const popup = new Overlay({
          element: popupRef.current!,
          autoPan: true,
          positioning: 'bottom-center',
          stopEvent: true,
        });
        map.addOverlay(popup);

        // Nominatim API
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lonLat[1]}&lon=${lonLat[0]}`);
        
        if (response.ok) {
          const data = await response.json();
          setPlaceName(data.display_name || 'No place found'); 
        } else {
          setPlaceName('No place found'); 
        }
        
        // Show popup at clicked position
        popup.setPosition(event.coordinate);
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
      
      {/* hover */}
      <div className={style.latlong}>
        Latitude : {hoverCoordinates.lat.toFixed(4)} 
        <br />
        Longitude : {hoverCoordinates.lon.toFixed(4)}
      </div>

      {/* Popup */}
      <div className={style.olpopup}
        ref={popupRef} 
        style={{
          display: popupVisible ? 'block' : 'none', 
        }}
      > 
      <button className={style.popupClose} onClick={closePopup}>
          &times; {/* Cross symbol */}
        </button>

        Latitude : {clickCoordinates.lat.toFixed(4)} 
        <br />
        Longitude : {clickCoordinates.lon.toFixed(4)}
        <br />
        Place : {placeName}
      </div>
    </div>
  );
}



