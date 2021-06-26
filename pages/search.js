import Head from 'next/head';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import styles from '../styles/Search.module.css';

import Header from '../components/HeaderOther';
import Footer from '../components/Footer';
import CardStay from '../components/card/Stay';
import CardExperience from '../components/card/Experience';
import Pagination from '../components/utilities/Pagination';
import Gallery from '../components/modal/Gallery';

import { shuffle } from '../utilities/customService';
import { useWindowDimensions } from '../utilities/customHooks'; 
import { getStays, getStaysByTags, getStaysByLocations, getTags } from '../utilities/services';

function Search() {
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    
    const defaultMap = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2900.020914160378!2d100.53259762223864!3d13.746398039015322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecde3aee521%3A0x9f43939a2caf2963!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1622823778517!5m2!1sen!2sth';
    
    const [ title, setTitle ] = useState(''); 
    const [ stays, setStays ] = useState([]);
    const [ experiences, setExperiences ] = useState([]);

    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchTag, setSearchTag ] = useState();
    const [ searchLocation, setSearchLocation ] = useState();
    const [ searchGuest, setSearchGuest ] = useState();
    
    const perPage = 7;
    const [ page, setPage ] = useState({});
    const [ searchPage, setSearchPage ] = useState(0);

    const [ selected, setSelected ] = useState([]);
    const [ openGallery, setOpenGallery ] = useState(false);

    // get locations based on search query
    useEffect(async () => {
        let nStays = [];
        let nExperiences = [];
        let nTitle = '';

        if (searchTag) {
            nStays = await getStaysByTags(searchTag.id);
            nTitle = searchTag.text;
        }
        else if (searchLocation && searchGuest) {
            let data = await getStaysByLocations(searchLocation);
            let totalGuest = searchGuest.adults + searchGuest.children;

            nStays = data.filter(item => item.rooms.guest >= totalGuest);
            nTitle = 'Stays in ' + searchLocation;
        }
        else if (searchLocation && !searchGuest) {
            nStays = await getStaysByLocations(searchLocation);
            nTitle = 'Experiences in ' + searchLocation;
        }
        else {
            if (searchMenu === 0) {
                nStays = await getStays();
                nTitle = 'Nearby stays';
            }
            else {
                nExperiences = await getStays();
                nTitle = 'Experiences near you';
            }
        }

        nStays.forEach(item => {
            item.gallery = shuffle(item.gallery);
        });
        
        setStays(nStays);
        setExperiences(nExperiences);

        setTitle(nTitle);
        onChangePage(Math.max(searchPage, 1), nStays);
    }, [searchTag, searchLocation, searchGuest, searchPage, searchMenu]);

    // get search menu
    useEffect(() => {
        if (router.query.menu) {
            setSearchMenu(parseInt(router.query.menu));
        }
    }, [router.query.menu]);

    // parse search query from url
    useEffect(() => {
        if (router.query.page) {
            setSearchPage(parseInt(router.query.page));
        }

        if (router.query.guest) {
            let guest = router.query.guest.split('-');
            let guestText = `${parseInt(guest[0]) + parseInt(guest[1])} guest${parseInt(guest[0]) + parseInt(guest[1]) <= 1 ? '' : 's'}`;

            if (parseInt(guest[2]) > 0)
                guestText += `, ${parseInt(guest[2])} infant${parseInt(guest[2]) === 1 ? '' : 's'}`;

            if (parseInt(guest[0]) + parseInt(guest[1]) + parseInt(guest[2]) === 0)
                guestText = '';

            setSearchGuest({ total: guestText, adults: parseInt(guest[0]), children: parseInt(guest[1]), infants: parseInt(guest[2]) });
        }

        if (router.query.location) {
            setSearchLocation(router.query.location.replaceAll('-', ', '));
        }
        else if (router.query.tag) {
            getTags().then(content => {
                setSearchTag(content.find(item => item.text.toLowerCase() === router.query.tag.replaceAll('-', ' ').toLowerCase()));
            });
        }
        else {
            setSearchTag(undefined);
            setSearchLocation(undefined);
            setSearchGuest(undefined);
        }
    }, [router.query.location, router.query.tag]);

    // update data on change page
    const onChangePage = (page, data) => {
        let content = data ? data : stays;

        let start = (page - 1) * perPage;
        let end = Math.min((page * perPage), content.length);

        setPage({ data: content.slice(start, end), curPage: page, totalPage: Math.ceil(content.length / perPage) });
        window.scroll(0, 0);
        
        let index = router.asPath.indexOf('page=');
        let path = router.asPath.slice(0, index) + 'page=' + page;
        router.push(path);
    };

    // set data for gallery modal
    const onChangeSelected = (data) => {
        setSelected(data);
        setOpenGallery(true);
    };

    // close gallery
    const onCloseGallery = async () => {
        setSelected([]);
        setOpenGallery(false);
    };

    return (
        <div>
            <Head>
                <title>Airbnb Clone | Search</title>
                <meta name='description' content='Generated by create next app' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Header />

            {searchMenu === 0 && <div className={styles.container} menu='stay'>
                <div className={styles.stays}>
                    <h5 style={{ color: 'var(--grey008)', fontWeight: '400' }}>{stays?.length} stays</h5>
                    <h1>{title}</h1>
                    
                    {page.data?.map((item, i) => (
                        <CardStay key={i} content={item} setSelected={onChangeSelected} />
                    ))}

                    <Pagination curPage={page.curPage} totalPage={page.totalPage} changePage={onChangePage} />
                </div>

                <iframe className={styles.map} src={defaultMap} width='100%' height={`${height - 80}px`} />
            </div>}

            {searchMenu === 1 && <div className={styles.container} menu='experience'>
                <h5 style={{ color: 'var(--grey008)', fontWeight: '400' }}>{experiences?.length} experiences</h5>
                <h1>{title}</h1>

                <div className={styles.experiences}>
                    <h3 style={{ fontWeight: 500 }}><big>All Experiences</big></h3>

                    <div>
                        {experiences.map((item, i) => (
                            <CardExperience key={i} content={item} setSelected={onChangeSelected} />
                        ))}
                    </div>
                </div>

                <button>Learn more</button>
            </div>}

            <Gallery content={selected} open={openGallery} onClose={onCloseGallery} />

            <Footer />
        </div>
    );
}

export default Search;
