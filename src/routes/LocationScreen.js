import {useState, useEffect} from 'react';
import styles from '../styles/Container.module.css';
import { useLocation } from 'react-router-dom';
import Map from '../components/Map';
import LocationHeader from '../components/LocationHeader';

function LocationScreen() {
    const location = useLocation();
    const {latitude, longitude} = location.state || {};
    const [userLocation, setUserLocation] = useState(null);

    useEffect( () => {
        if (latitude && longitude) { // 유저 위치 정보가 들어왔을 때에만 반영
            setUserLocation({
                lat: latitude,
                lng: longitude
            });
        };
    }, [latitude, longitude]) // 위치 정보가 바뀔 때마다 실행

    return (
        <div className={styles.pageContainer}>
            <div className={styles.cardContainer}>
                {userLocation ? (
                    <div style={{position: 'relative'}}>
                        <LocationHeader/>
                        <Map 
                            userLocation={userLocation}
                        />
                    </div>
                ) : (
                    <p>위치 정보가 없습니다.</p>
                )}
            </div>
        </div>  
    );
}

export default LocationScreen;