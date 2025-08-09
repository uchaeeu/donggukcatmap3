// src/components/FormTagSelector.jsx
import { useNavigate } from "react-router-dom";
import styles from "../styles/FormInput.module.css";

function FormTagSelector() {
  const navigate = useNavigate();

  const goTagPick = () => {
    navigate("/tag-pick"); // TagPickPage 라우트로 이동
  };

  return (
    <div
      className={styles.tagSelectorLink}
      onClick={goTagPick}
      style={{ cursor: "pointer" }}
    >
      태그 선택하기
    </div>
  );
}

export default FormTagSelector;
