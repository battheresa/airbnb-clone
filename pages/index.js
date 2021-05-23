import Head from 'next/head';

import { useState } from 'react';
import styles from '../styles/Home.module.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

import { useWindowDimensions } from '../utilities/customHooks';
import { tabs, places } from '../utilities/database';

function Home() {
    const { width, height } = useWindowDimensions();
    const [ currentTab, setCurrentTab ] = useState(0);
    
    // useEffect(() => {
    //     if (height < 400) {
            
    //     }
    // }, [height]);

    return (
        <div>
            <Head>
                <title>Airbnb Clone</title>
                <meta name='description' content='Generated by create next app' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Header />

            <div className={styles.container}>
                <div className={styles.banner}>
                    <div className={styles.bannerImage}>
                        <img className={styles.bannerImage} src='https://images.unsplash.com/photo-1601918774946-25832a4be0d6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1949&q=80' alt='Unsplash' />
                    </div>
                    <div className={styles.bannerText}>
                        <h1 className={styles.bannerTitle}>The Greatest Outdoors</h1>
                        <p className={styles.bannerSubtitle}>Wishlists curated by Airbnb.</p>
                        <button className={styles.bannerButton}>Get inspired</button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Live anywhere</h2>
                    <div className={styles.cardHolder}>
                        <Card image='https://a0.muscache.com/im/pictures/a0316ecb-e49b-4b3a-b6b6-c2876b820e8c.jpg?im_w=720' title='Entire homes' body='' />
                        <Card image='https://a0.muscache.com/im/pictures/ff69ac49-64e7-4f4a-ae2b-ee01163d0790.jpg?im_w=720' title='Cabins and cottages' body='' />
                        <Card image='https://a0.muscache.com/im/pictures/ce6814ba-ed53-4d6e-b8f8-c0bbcf821011.jpg?im_w=720' title='Unique stays' body='' />
                        <Card image='https://a0.muscache.com/im/pictures/fbe849a4-841a-41b3-b770-419402a6316f.jpg?im_w=720' title='Pets welcome' body='' />
                    </div>
                </div>

                <div className={styles.sectionReverse}>
                    <h2>Experience the world</h2>
                    <p>Unique activities with local experts—in person or online.</p>
                    <div className={styles.cardHolder}>
                        <Card image='https://a0.muscache.com/im/pictures/4d353c80-e73a-4b04-9e15-ec3d8381b106.jpg?im_w=1200' title='Online Experiences' body='Travel the world without leaving home.' />
                        <Card image='https://a0.muscache.com/im/pictures/e81fce5f-2f51-4342-938e-5bc18ae237f4.jpg?im_w=1200' title='Experiences' body='Things to do everywhere you are.' />
                        <Card image='https://a0.muscache.com/im/pictures/b9adfc39-6e2a-4e5f-b6f3-681b306fae5c.jpg?im_w=1200' title='Adventures' body='Multi-day trips with meals and stays.' />
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Join millions of hosts on Airbnb</h2>
                    <div className={styles.cardHolder}>
                        <Card image='https://a0.muscache.com/im/pictures/2a16f833-464c-446c-8d74-33eb8c643975.jpg?im_w=1200' title='Host Your Home' body='' />
                        <Card image='https://a0.muscache.com/im/pictures/426a8116-0b94-4407-ae87-924126c81d78.jpg?im_w=1200' title='Host an Online Experience' body='' />
                        <Card image='https://a0.muscache.com/im/pictures/a84e92bd-68e6-4ce2-9fdf-b2ce1a377f53.jpg?im_w=1200' title='Host an Experience' body='' />
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Inspiration for future getaways</h2>
                    <div className={styles.tabHeader}>
                        {tabs.map((item, i) => (
                            <div key={item} className={`${i === currentTab ? styles.tabActive : styles.tabInactive}`} onClick={() => setCurrentTab(i)}>
                                <button><h5>{item}</h5></button>
                                <div />
                            </div>
                        ))}
                    </div>

                    <div className={styles.tabContent}>
                        {places[currentTab].map(item => (
                            <div key={item.location}>
                                <p>{item.location}</p>
                                <p>{item.state}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
