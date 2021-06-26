import { useRouter } from 'next/router';
import styles from '../../styles/card/Home.module.css';

function Home({ image, title, body, menu }) {
    const router = useRouter();

    // redirect page
    const changeRoute = () => {
        if (menu < 0)
            return;

        router.push(`/search?menu=${menu}&tag=${title.replaceAll(' ', '-')}&page=1`);
    };

    return (
        <div className={styles.container} onClick={() => changeRoute()}>
            <img className={styles.image} src={image} alt={title} />
            <h3>{title}</h3>
            <p>{body}</p>
        </div>
    );
}

export default Home;
