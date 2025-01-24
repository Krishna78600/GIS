// 2. Generates India's map on Focus in World Map
import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import style from '../styles/IndiaMap.module.scss';

export default function IndiaMap() {
  
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new Map({
        target: mapRef.current,
        layers: [
          // Base layer 
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          // Center coordinates 
          center: fromLonLat([81.19, 23.25]), 
          zoom: 4.7, 
        }),
      });
    }
  }, []);

  return (
    <div ref={mapRef} className={style.IndiaMap}/>
  );
}


