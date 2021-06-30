import { useState, useEffect, useRef } from 'react';

import styles from '../../../styles/header/Small.module.css';

import MenuList from '../../modal/MenuList';

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { useWindowDimensions, useWindowOffset } from '../../../utilities/customHooks';
import { searchFilterMenu } from '../../../utilities/config';

function Header({ locations, changeRoute, searchMenu, onChangeSearchMenu }) {
    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 

    const benchmarkOffsetY = 120;

    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });

    const [ search, setSearch ]  = useState(false);

    const [ searchSubmenu, setSearchSubmenu ] = useState(-1);

    const [ searchLocationList, setSearchLocationList ] = useState([]);
    const [ searchLocation, setSearchLocation ] = useState('');

    // update background styling
    useEffect(() => {
        let nBackground = {};
        nBackground.backgroundColor = 'var(--transparent)';
        nBackground.boxShadow = 'none';
        nBackground.top = '-140px';

        if (offsetY > benchmarkOffsetY) {
            nBackground.backgroundColor = 'var(--white)';
            nBackground.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.1)';
        }

        setBackgroundStyle(nBackground);
    }, [offsetY]);

    // update location search result based on searched location
    useEffect(() => {
        if (searchLocation === '') {
            setSearchLocationList(locations.slice(0, 5));
        }
        else {
            let nLocations = locations.filter(item => item.toLowerCase().includes(searchLocation.toLowerCase()))
            
            if (nLocations.length === 0) {
                nLocations = searchLocationList;
            }

            if (nLocations.length > 5) {
                nLocations = nLocations.slice(0, 5);
            }

            setSearchLocationList(nLocations);
        }
    }, [locations, searchLocation]);

    // open search menu
    const onClickOpenSearch = (open, submenu) => {
        setSearch(open);
        setSearchSubmenu(submenu);
    };

    // set search menu + change route
    const onClickSearchMenu = (event, input) => {
        onChangeSearchMenu(input);
        changeRoute(event, '/search', { location: searchLocation, checkin: undefined, checkout: undefined, guest: input === 0 ? searchGuest : undefined });
    };

    // update selected location
    const onEnterSearchLocation = (input) => {
        setSearchLocation(input);
        setSearchSubmenu(searchSubmenu + 1);
    };

    return (
        <div className={styles.container} version='home'>
            
            {/* search */}
            <div className={styles.search}>

                {/* search button */}
                <button className={styles.searchButton} onClick={() => onClickOpenSearch(true, 0)}>
                    <SearchRoundedIcon style={{ color: 'var(--black)' }} />
                    <h5>Where are you going?</h5>
                </button>

                {/* search location */}
                {search && <section className={styles.searchMenu} style={{ top: `${search ? 0 : height + 50}px` }}>
                    <div>
                        <div className={styles.searchMenuInput}>
                            <SearchRoundedIcon style={{ color: 'var(--black)' }} />
                            <input placeholder='Where are you going?' value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
                        </div>
                        <a className={styles.searchMenuButton} onClick={() => onClickOpenSearch(false, -1)}>Cancel</a>
                    </div>
                    <MenuList open={search} mode='inline' content={searchLocationList} type='locations' setSelected={onEnterSearchLocation} />

                    {/* search menu */}
                    <section className={styles.searchMenu} style={{ top: `${searchSubmenu === 1 ? 0 : height + 50}px` }}>
                        <button onClick={() => onClickOpenSearch(true, 0)}><NavigateBeforeIcon /></button>
                        <h3>What can we help you find?</h3>
                        <MenuList open={search} mode='inline' content={searchFilterMenu} type='options' setSelected={onClickSearchMenu} />
                    </section>
                </section>}
            </div>

            {/* header background */}
            <div className={styles.background} style={backgroundStyle} />
        </div>
    );
}

export default Header;
