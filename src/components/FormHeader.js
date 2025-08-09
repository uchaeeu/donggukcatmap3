import { Link } from "react-router-dom";
import styles from "../styles/FormHeader.module.css"

function FormHeader() {
    return (
        <div className={styles.header}>
          <Link to="/" className={styles.backButton}>
            &lt;
          </Link>
          <span className={styles.headerTitle}>Upload</span>
        </div>
    );
}

export default FormHeader;