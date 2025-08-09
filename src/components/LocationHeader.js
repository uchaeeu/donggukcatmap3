import { Link } from "react-router-dom";
import styles from "../styles/LocationBackButton.module.css"

// /location 페이지에서 뒤로 가기 버튼
function LocationHeader() {
    return (
        <div style={{backgroundColor: 'white'}}>
          <Link to="/posts" className={styles.backButton}>
            &lt;
          </Link>
        </div>
    );
}

export default LocationHeader;