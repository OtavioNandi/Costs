import styles from './Home.module.css'
import savings from '../../img/savings.svg'
import { LinkButton } from '../layout/LinkButton'

export const Home = () => {
  return (
    <section className={styles.home_container}>
      <h1>Welcome to <span>Costs</span></h1>
      <p>Start managing your projects in an easier and faster way</p>
      <LinkButton to="/newproject" text="Create Project" />
      <img src={savings} alt="Costs" />
    </section>
  )
}
