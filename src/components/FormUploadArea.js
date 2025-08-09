import styles from "../styles/FormUploadArea.module.css"

function FormUploadArea({imagePreview, fileInputRef, handleFileChange}) {
    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    }; 
    // '업로드 파일 선택' 버튼을 누를 때 실행

    return (
        <div className={styles.imageUploadArea}>
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className={styles.imagePreview}
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{display: 'none'}}
            accept="image/*"
          />

          <button 
            onClick={handleFileButtonClick} 
            className={styles.selectFileButton}
          >
            업로드 파일 선택
          </button>
        </div>
    );
}

export default FormUploadArea;
