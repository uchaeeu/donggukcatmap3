import Nav from '../components/Nav';
import styles from '../styles/Container.module.css';

function SearchScreen() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.cardContainer}>
                <Nav/>
            </div>
        </div>
    );
}

export default SearchScreen;