import { useEffect, useRef } from 'react';
import styles from "../styles/Map.module.css";
import axios from 'axios';
import catIcon from '../img/cat.svg';
import locateIcon from '../img/location-1.svg';
import { useNavigate } from 'react-router-dom';

const Map = ({ children, userLocation }) => {
  const mapRef = useRef(null); // map container ref
  const mapInstance = useRef(null); // 맵 오브젝트를 담기 위해 선언
  const navigate = useNavigate();

  const locationIcon = "data:image/svg+xml;utf8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="12" fill="#ffa500" />
  <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
</svg>
`);


  useEffect(() => {
    const script = document.createElement('script');
    const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;
    // 카카오맵 API를 가져오자. appkey={userKey}
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        // map api를 가져옵니다.
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(37.558317, 127.000209),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        // 만약 userLocation(현재 위치)가 존재한다면 현 위치 마커를 표시하자.
        if (mapInstance && userLocation) {
          const userLocationMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
            image: new window.kakao.maps.MarkerImage(locationIcon, new window.kakao.maps.Size(32, 32)),
                zIndex: 999
            });
          userLocationMarker.setMap(map);
        }

        const imageSize = new window.kakao.maps.Size(52, 52);
        const markerImage = new window.kakao.maps.MarkerImage(catIcon, imageSize);

        /*fetch("./mockData.json") // 마커 표시 test
          .then(res => res.json())
          .then(data => {
            data.data.forEach(({ latitude, longitude, id }) => {
              const position = new window.kakao.maps.LatLng(latitude, longitude);
              const marker = new window.kakao.maps.Marker({
                position: position,
                image: markerImage,
              });
              marker.setMap(map);

              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div>Post ID: ${id}</div>`,
              });

              window.kakao.maps.event.addListener(marker, 'click', () => {
                navigate(`/posts/${id}`);
              });

              window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                infowindow.open(map, marker);
              });

              window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                infowindow.close();
              });
            });
          });*/

        fetchMarkers(map);
      });
    };

    document.head.appendChild(script);
  }, [navigate, userLocation]);

  // 마커를 표시합니다. (api를 가져옴)
  const fetchMarkers = async (map) => {
    const imageSize = new window.kakao.maps.Size(40, 40);
    const markerImage = new window.kakao.maps.MarkerImage(catIcon, imageSize);
    try {
      const response = await axios.get('http://localhost:3000/api/posts/map');
      console.log('map posts: ', response.data.length, response.data);
      const markers = Array.isArray(response.data) ? response.data : [];

      markers.forEach(({ latitude, longitude, id }) => {
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });

        marker.setMap(map);
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div>Post ID: ${id}</div>`,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          navigate(`/posts/${id}`);
        });

        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          infowindow.open(map, marker);
        });


        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          infowindow.close();
        });

      });
    } catch (err) {
      console.log('failed to fetch markers: ', err);
    }
  };

  return (
    <div ref={mapRef} className={styles.map}>
      {children}
    </div>
  );
};

export default Map;
