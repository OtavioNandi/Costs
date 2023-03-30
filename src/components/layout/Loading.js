import styles from './Loading.module.css'
import loading from '../../img/loading.svg'

export const Loading = () => {
  return (
    <div className={styles.loader_container}>
        <img className={styles.loader} src={loading} alt="Loading" />
    </div>
  )
}
