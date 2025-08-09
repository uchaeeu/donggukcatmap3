import {useState} from 'react';
import navSytle from "../styles/Nav.module.css";
import { useNavigate } from 'react-router-dom';

import HomeInactive from '../img/Home.svg';
import HomeActive from '../img/HomeActive.svg';
import SearchInactive from '../img/Search.svg';
import SearchActive from '../img/SearchActive.svg';
import HeartInactive from '../img/Heart.svg';
import HeartActive from '../img/HeartActive.svg';

// 하단 네비게이션 바를 컨트롤합니다.
function Nav() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(''); // 기본 활성화 탭은 '/', 즉, 홈 (메인 화면)

    // 네비게이션 바에서 버튼을 선택하면 그 페이지로 옮겨주자.
    const handleNavClick = (tabName) => {
        setActiveTab(tabName);
        navigate(`/${tabName}`);
    };

    return (
        <div className={navSytle.navContainer}>
            <button className={navSytle.navButton}
                onClick={() => handleNavClick('')}
            >
                <img src={activeTab === '' ? HomeActive : HomeInactive} alt='홈'/>
            </button>
            <button className={navSytle.navButton}
                onClick={() => handleNavClick('tags')}>
                <img src={activeTab === 'tags' ? SearchActive : SearchInactive} alt='태그'/>
            </button>
            <button className={navSytle.navButton}
                onClick={() => handleNavClick('trend')}
            >
                <img src={activeTab === 'trend' ? HeartActive : HeartInactive} alt='인기'/>
            </button>
        </div>
    );
}

export default Nav;