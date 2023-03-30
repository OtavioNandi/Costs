import styles from './SubmitButton.module.css'

export const SubmitButton = ({ text }) => {
  return (
    <div>
        <button className={styles.btn}>{text}</button>
    </div>
  )
}