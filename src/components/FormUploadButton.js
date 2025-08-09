import styles from "../styles/FormUploadButton.module.css"

function FormUploadButton ({onUpload}) {
    return (
        <button
          onClick={onUpload}
          className={styles.uploadButton}
        >
          <span className={styles.uploadButtonContent}>
            <span>업로드하기 &nbsp;&nbsp;→</span>
          </span>
        </button>
    );

}

export default FormUploadButton;