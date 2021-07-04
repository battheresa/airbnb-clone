import { useState, useEffect } from 'react';

import styles from '../../../styles/header/Small.module.css';

import MenuList from '../../modal/MenuList';

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { useWindowDimensions, useWindowOffset } from '../../../utilities/customHooks';
import { searchFilterMenu } from '../../../utilities/config';

function Header(props) {
    const { locations, benchmarkOffsetY, changeRoute } = props;
    const { onChangeSearchMenu, searchSubmenu, onChangeSearchSubmenu } = props;

    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset();

    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });
    const [ search, setSearch ]  = useState(false);

    const [ locationList, setLocationList ] = useState([]);
    const [ inputLocation, setInputLocation ] = useState('');

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
        if (inputLocation === '') {
            setLocationList(locations.slice(0, 5));
        }
        else {
            let nLocations = locations.filter(item => item.toLowerCase().includes(inputLocation.toLowerCase()))
            
            if (nLocations.length === 0) 
                nLocations = locationList;

            if (nLocations.length > 5) 
                nLocations = nLocations.slice(0, 5);

            setLocationList(nLocations);
        }
    }, [locations, inputLocation]);

    // open search menu
    const onClickOpenSearch = (open, submenu) => {
        setSearch(open);
        onChangeSearchSubmenu(submenu);
        setInputLocation('');
        document.body.style.overflow = open ? 'hidden' : 'visible';
    };

    // set search menu + change route
    const onChangeMenu = (event, input) => {
        onChangeSearchMenu(input);
        changeRoute(event, '/search', { location: inputLocation, checkin: undefined, checkout: undefined, guest: undefined }, input);
    };

    // update selected location
    const onEnterInputLocation = (input) => {
        setInputLocation(input);
        onChangeSearchSubmenu(searchSubmenu + 1);
    };
    
    return (
        <div className={styles.container} version='home'>
            
            {/* search */}
            <div className={styles.search}>

                {/* search button */}
                <button className={styles.searchButton} version='home' onClick={() => onClickOpenSearch(true, 0)}>
                    <SearchRoundedIcon style={{ color: 'var(--black)' }} />
                    <h5>Where are you going?</h5>
                </button>

                {/* search location */}
                {search && <section className={styles.searchMenu} version='home' style={{ top: `${search ? 0 : height + 50}px` }}>
                    <div>
                        <div className={styles.searchMenuInput}>
                            <SearchRoundedIcon style={{ color: 'var(--black)' }} />
                            <input placeholder='Where are you going?' value={inputLocation} onChange={(e) => setInputLocation(e.target.value)} />
                        </div>
                        <a className={styles.searchMenuButton} onClick={() => onClickOpenSearch(false, -1)}>Cancel</a>
                    </div>
                    <MenuList open={search} mode='inline' content={locationList} type='locations' setSelected={onEnterInputLocation} />

                    {/* search menu */}
                    <section className={styles.searchMenu} version='home' style={{ top: `${searchSubmenu === 1 ? 0 : height + 50}px` }}>
                        <button onClick={() => onClickOpenSearch(true, 0)}><NavigateBeforeIcon /></button>
                        <h3>What can we help you find?</h3>
                        <MenuList open={search} mode='inline' content={searchFilterMenu} type='options' setSelected={onChangeMenu} />
                    </section>
                </section>}
            </div>

            {/* header background */}
            <div className={styles.background} style={backgroundStyle} />
        </div>
    );
}

export default Header;
