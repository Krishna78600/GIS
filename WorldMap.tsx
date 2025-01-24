// 1. Showing World-Map only 
import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import style from '../styles/WorldMap.module.scss';

export default function Worldmap() {

  const mapRef = useRef<HTMLDivElement | null>(null);

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
          center: fromLonLat([0,0]), // initial center of the map
          zoom: 1, 
        }), 
      });
      console.log("testing");
    }
 
  }, []);
  return (
   /*  <div ref={mapRef} style={{ width: '100%', height: '100vh' }} /> */
   <div ref = {mapRef} className={style.WorldMap} /> 
  );
}


