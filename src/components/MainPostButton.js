import buttonSytle from "../styles/MainPostButton.module.css";
import {Link} from "react-router-dom";

// 메인 화면 하단 '고양이 사진 올리기' 버튼
function MainPostButton() {
    return (
        <div>
            <Link to="/posts" className={buttonSytle.mainbutton}>고양이 사진 올리기</Link>
        </div>
    );
}

export default MainPostButton;