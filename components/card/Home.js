import { useRouter } from 'next/router';
import styles from '../../styles/card/Home.module.css';

function Home({ image, title, body }) {
    const router = useRouter();

    return (
        <div className={styles.container} onClick={() => router.push(`/search?menu=0&tag=${title.replaceAll(' ', '-')}&page=1`)}>
            <img className={styles.image} src={image} alt={title} />
            <h3>{title}</h3>
            <p>{body}</p>
        </div>
    );
}

export default Home;
