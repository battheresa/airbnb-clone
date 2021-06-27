import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

import styles from '../../../styles/header/Small.module.css';

import MenuList from '../../modal/MenuList';
import DateInput from '../../modal/DateInput';
import GuestInput from '../../modal/GuestInput';

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { useWindowDimensions, useWindowOffset } from '../../../utilities/customHooks';
import { isBefore, isSameDate, isSameMonth } from '../../../utilities/customService';
import { getSearchLocations } from '../../../utilities/services';
import { searchFilterMenu } from '../../../utilities/config';

function Header() {
    const router = useRouter();

    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 

    const benchmarkOffsetY = 120;

    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });

    const [ search, setSearch ]  = useState(false);

    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchSubmenu, setSearchSubmenu ] = useState(-1);

    const [ locations, setLocations ] = useState([]);
    const [ searchLocationList, setSearchLocationList ] = useState([]);
    const [ searchLocation, setSearchLocation ] = useState('');

    const [ searchGuest, setSearchGuest ] = useState({ total: '', adults: 0, children: 0, infants: 0 });

    // get search locations
    useEffect(() => {
        getSearchLocations().then(content => setLocations(content));
    }, []);

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

    // redirect page
    const changeRoute = (event, path, params) => {
        event.preventDefault();

        if (params) {
            let fullPath = path + '?menu=' + searchMenu + '&';

            Object.entries(params).forEach(item => {
                fullPath += item[0] + '=';

                if (typeof item[1] === 'string')
                    fullPath += item[1].replaceAll(' ', '').replaceAll(',', '-');

                if (typeof item[1] === 'object') {
                    if (item[1].date !== undefined)
                        fullPath += item[1].year + '-' + item[1].month + '-' + item[1].date;

                    if (item[1].adults !== undefined)
                        fullPath += item[1].adults + '-' + item[1].children + '-' + item[1].infants;
                }

                if (item[0] !== Object.keys(params)[Object.keys(params).length - 1])
                    fullPath += '&';
            });
            
            fullPath += '&page=1';
            router.push(fullPath);
            return;
        }

        path += '?menu=' + searchMenu + '&page=1';
        router.push(path);
    };

    // open search menu
    const onClickOpenSearch = (open, submenu) => {
        setSearch(open);
        setSearchSubmenu(submenu);
    };

    // set search menu + change route
    const onClickSearchMenu = (event, input) => {
        setSearchMenu(input);
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

                {/* search menu */}
                {search && <section className={styles.searchMenu} style={{ top: `${search ? 0 : height + 50}px` }}>
                    <div>
                        <div className={styles.searchMenuInput}>
                            <SearchRoundedIcon style={{ color: 'var(--black)' }} />
                            <input placeholder='Where are you going?' value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
                        </div>
                        <a className={styles.searchMenuButton} onClick={() => onClickOpenSearch(false, -1)}>Cancel</a>
                    </div>

                    <MenuList open={search} mode='inline' content={searchLocationList} type='locations' setSelected={onEnterSearchLocation} />

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
