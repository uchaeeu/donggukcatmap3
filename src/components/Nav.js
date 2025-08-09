// src/components/Nav.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import navSytle from "../styles/Nav.module.css";

import HomeInactive from '../img/Home.svg';
import HomeActive from '../img/HomeActive.svg';
import SearchInactive from '../img/Search.svg';
import SearchActive from '../img/SearchActive.svg';
import HeartInactive from '../img/Heart.svg';
import HeartActive from '../img/HeartActive.svg';

function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');

    // 현재 경로에 따라 activeTab 자동 설정
    useEffect(() => {
        if (location.pathname === '/' || location.pathname.startsWith('/map')) {
            setActiveTab('');
        } else if (location.pathname.startsWith('/tags')) {
            setActiveTab('tags');
        } else if (location.pathname.startsWith('/popular')) {
            setActiveTab('popular');
        }
    }, [location.pathname]);

    return (
        <div className={navSytle.navContainer}>
            <button className={navSytle.navButton} onClick={() => navigate('/')}>
                <img src={activeTab === '' ? HomeActive : HomeInactive} alt='홈'/>
            </button>
            <button className={navSytle.navButton} onClick={() => navigate('/tags')}>
                <img src={activeTab === 'tags' ? SearchActive : SearchInactive} alt='태그'/>
            </button>
            <button className={navSytle.navButton} onClick={() => navigate('/popular')}>
                <img src={activeTab === 'popular' ? HeartActive : HeartInactive} alt='인기'/>
            </button>
        </div>
    );
}

export default Nav;
