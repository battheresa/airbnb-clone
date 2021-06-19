import { useRouter } from 'next/router';
import styles from '../../styles/utilities/Card.module.css';

function Card({ image, title, body }) {
    const router = useRouter();
    const path = '/search?tag=' + title?.replaceAll(' ', '-') + '&page=1';

    return (
        <div className={styles.container} onClick={() => router.push(path)}>
            <img className={styles.image} src={image} alt={title} />
            <h3>{title}</h3>
            <p>{body}</p>
        </div>
    );
}

export default Card;
