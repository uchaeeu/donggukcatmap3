import styles from "../styles/FormInput.module.css"

function FormTitleRe({title, setTitle}) {
    return (
      <div>
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className={styles.titleInput}
        />
      </div>
    );
}

export default FormTitleRe;