import styles from "../styles/FormInput.module.css"

function FormComment({comment, setComment}) {
    return (
        <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.commentTextarea}
          placeholder="코멘트를 작성하세요..."
        />
      </div>
    );
}

export default FormComment;