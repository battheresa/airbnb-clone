import styles from '../styles/Card.module.css';

function Card({ image, title, body }) {
    return (
        <div className={styles.container}>
            <img className={styles.image} src={image} alt={title} />
            <h3>{title}</h3>
            <p>{body}</p>
        </div>
    );
}

export default Card;
