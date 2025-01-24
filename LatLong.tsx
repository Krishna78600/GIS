// 3. On Hovering , Lat-Long is generating in a box placed on bottom right corner.
import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import style from '../styles/LatLong.module.scss'

export default function LatLong() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({ lat: 0, lon: 0 });

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
        setCoordinates({ lat: lonLat[1], lon: lonLat[0] });
      });
    }
  }, []);

  return (
    <div className={style.box}>
      
      <div ref={mapRef} className={style.map}/>
      
      <div className={style.latlong}>
        Latitude: {coordinates.lat.toFixed(4)} 
        <br />
        Longitude: {coordinates.lon.toFixed(4)}
      </div>
    </div>
  );
}
