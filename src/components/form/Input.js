import styles from './Input.module.css'

export const Input = ({type, text, name, placeholder, handleOnChange, value}) => {
  return (
    <div className={styles.form_control}>
        <label htmlFor={name}>{text}</label>
        <input 
            type={type} 
            name={name} 
            id={name} 
            placeholder={placeholder} 
            onChange={handleOnChange} 
            value={value} 
        />
    </div>
  )
}
