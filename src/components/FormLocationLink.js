import { useNavigate } from "react-router-dom";
import styles from "../styles/FormInput.module.css";

function FormLocationLink() {
    const navigate = useNavigate();
    
    const handleLocationClick = () => {
        if (navigator.geolocation) { // 위치 정보 가져오기
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            console.error("이 브라우저는 Geolocation API를 지원하지 않습니다.");
        }
    };

    const successCallback = (position) => { // 위치 정보를 가지고 location 페이지를 보여주자.
        const {latitude, longitude} = position.coords;
        navigate('/location', {
            state: {
                latitude,
                longitude
            }
        })
    };

    // 위치 정보를 가져오는 데 실패했을 경우 작동할 실패 함수
    const errorCallback = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("사용자가 위치 정보 사용 권한을 거부했습니다.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("위치 정보를 사용할 수 없습니다.");
                break;
            case error.TIMEOUT:
                console.error("위치 정보를 가져오는 데 시간이 초과되었습니다.");
                break;
            case error.UNKNOWN_ERROR:
            default:
                console.error("알 수 없는 오류가 발생하였습니다.");
                break;
        }
    };

    return (
      <div
        className={styles.locationLink}
        onClick={handleLocationClick}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
           className={styles.locationIcon} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
       </svg>
        <span>위치 보기</span>
      </div>
    );
}

export default FormLocationLink;