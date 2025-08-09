import Map from '../components/Map';
import Nav from '../components/Nav';
import MainPostButton from '../components/MainPostButton';
import styles from '../styles/Container.module.css';

function MainScreen() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.cardContainer}>
                <Map>
                    <MainPostButton/>   
                    <Nav/>
                </Map>
            </div>
        </div>
    );
}

export default MainScreen;