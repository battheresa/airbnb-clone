import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

import styles from '../../../styles/Header.module.css';
import { config, animated, useChain, useSpring, useSpringRef } from '@react-spring/web';

import MenuList from '../../modal/MenuList';
import DateInput from '../../modal/DateInput';
import GuestInput from '../../modal/GuestInput';

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

import { useWindowDimensions, useWindowOffset, useMousedownTarget } from '../../../utilities/customHooks';
import { isBefore, isSameDate, isSameMonth } from '../../../utilities/customService';
import { deviceBreakpoint, logoFull, logoMini, searchFilter } from '../../../utilities/config';
import { getSearchLocations } from '../../../utilities/services';

function Header() {
    const router = useRouter();

    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 
    const target = useMousedownTarget();

    const benchmarkOffsetY = 120;
    const [ curOffsetY, setCurOffsetY ] = useState(0);

    const [ logo, setLogo ] = useState(logoFull.black);
    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });

    const [ search, setSearch ]  = useState(true);
    const [ openSearch, setOpenSearch ] = useState(false);

    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchSubmenu, setSearchSubmenu ] = useState(-1);

    const submenuList = [useRef(), useRef(), useRef(), useRef(), useRef()];

    const [ locations, setLocations ] = useState([]);
    const [ searchLocationList, setSearchLocationList ] = useState([]);
    const [ searchLocation, setSearchLocation ] = useState('');

    const [ searchGuest, setSearchGuest ] = useState({ total: '', adults: 0, children: 0, infants: 0 });
    const [ searchDateStay, setSearchDateStay ] = useState({ from: undefined, fromText: '', to: undefined, toText: '' });
    const [ searchDateExperience, setSearchDateExperience ] = useState({ from: undefined, to: undefined, text: '' });

    // search field animation
    const searchFieldRef = useSpringRef();
    const searchFieldStyle = useSpring({
        ref: searchFieldRef,
        config: { mass: 1, tension: 210, friction: 20, clamp: true },
        from: { 
            top: '0px',
            left: width < deviceBreakpoint.medium - 60 ? '10%' : 'auto',
            width: '850px',
            height: '62px',
            opacity: '0',
        },
        to: { 
            top: search || openSearch ? '62px' : '0px', 
            left: width < deviceBreakpoint.medium - 60 ? '5%' : 'auto',
            width: search || openSearch ? '850px' : '300px',
            height: search || openSearch ? '62px' : '44px',
            opacity: search || openSearch ? '1' : '0',
        }
    });

    // search field menu animation
    const searchFieldMenuRef = useSpringRef();
    const searchFieldMenuStyle = useSpring({
        ref: searchFieldMenuRef,
        config: config.stiff,
        from: { opacity: '1' },
        to: { opacity: search || openSearch ? '1' : '0' }
    });

    // config animation order
    useChain(search || openSearch ? [searchFieldRef, searchFieldMenuRef] : [searchFieldMenuRef, searchFieldRef], [0, 0.1]);

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
            nBackground.top = search ? width < deviceBreakpoint.medium - 60 ? '0px' : '-55px' : '-140px';
        }

        setBackgroundStyle(nBackground);
        setSearch(offsetY > benchmarkOffsetY ? openSearch : true);
        setOpenSearch(Math.abs(curOffsetY - offsetY) > benchmarkOffsetY + 50 ? false : openSearch);
    }, [search, openSearch, offsetY]);

    // update content on width change
    useEffect(() => {
        let nlogo = undefined;

        if (width < deviceBreakpoint.medium) {
            nlogo = logoMini.white;

            if (offsetY > benchmarkOffsetY) {
                nlogo = logoMini.black;
            }
        }
        else {
            nlogo = logoFull.white;

            if (offsetY > benchmarkOffsetY) {
                nlogo = logoFull.black;
            }
        }

        setLogo(nlogo !== undefined ? nlogo : logo);
    }, [width, offsetY]);

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

                console.log(item);

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

    // update on click screen cover
    const onClickScreenCover = () => {
        if (target === 'screenCover') {
            setOpenSearch(false);
        }

        onClickMenu(searchMenu);
    };

    // toggle between search field and search button
    const onClickOpenSearch = () => {
        setOpenSearch(!openSearch);
        setCurOffsetY(offsetY);
    };

    // update styling when click on menu
    const onClickMenu = (menu) => {
        setSearchMenu(menu);
        setSearchSubmenu(-1);

        for (let i = 0; i < 5; i ++) { 
            submenuList[i].current.classList.remove(styles.searchFieldMenuActive);
            
            if (i < 3) {
                submenuList[i].current.classList.add(styles.searchFieldMenuSeperator);
            }
        }

        submenuList[0].current.parentNode.parentNode.style.cssText += 'background-color: var(--white);';
    };

    // update styling when click on submenu
    const onClickSubmenu = (submenu) => {
        setSearchSubmenu(submenu);

        for (let i = 0; i < 5; i ++) {
            if (submenu === i) {
                submenuList[i].current.classList.add(styles.searchFieldMenuActive);
            }
            else {
                submenuList[i].current.classList.remove(styles.searchFieldMenuActive);
            }

            if (i < 3) {
                submenuList[i].current.classList.add(styles.searchFieldMenuSeperator);
            }
        }

        submenuList[submenu === 4 ? 0 : submenu].current.classList.remove(styles.searchFieldMenuSeperator);
        if (submenu - 1 >= 0) {
            submenuList[submenu - 1].current.classList.remove(styles.searchFieldMenuSeperator);
        }

        submenuList[submenu].current.parentNode.parentNode.style.cssText += 'background-color: var(--grey002);';
    };

    // update seperator on mouse enter submenu
    const onMouseEnterSubmenu = (submenu) => {
        submenuList[submenu === 4 ? 0 : submenu].current.classList.remove(styles.searchFieldMenuSeperator);
        if (submenu - 1 >= 0) {
            submenuList[submenu - 1].current.classList.remove(styles.searchFieldMenuSeperator);
        }
    };

    // update seperator on mouse leave submenu
    const onMouseLeaveSubmenu = (submenu) => {
        if (searchSubmenu === 4) 
            return;

        if (searchSubmenu === -1 || submenu < searchSubmenu - 1 || submenu > searchSubmenu) 
            submenuList[submenu < 3 ? submenu : 0].current.classList.add(styles.searchFieldMenuSeperator);

        if (searchSubmenu !== submenu && submenu - 1 >= 0) 
            submenuList[submenu - 1].current.classList.add(styles.searchFieldMenuSeperator);
    };

    // get styling of each submenu depending on current menu opened and each submenu
    const getSubmenuStyle = (menu, submenu) => {
        let nStyle = {};
        nStyle.display = (searchMenu === menu || submenu === 0) ? 'flex' : 'none';
        
        if (!search) { nStyle.color = 'var(--white)'; }
        if (submenu === 0) { nStyle.maxWidth = searchMenu === 0 ? '30%' : '50%'; }
        if (submenu === 3) { nStyle.minWidth = '25%'; }

        return nStyle;
    };

    // update selected location
    const onEnterSearchLocation = (input) => {
        setSearchLocation(input);
        onClickSubmenu(searchSubmenu + 1);
    };

    // update number of guests
    const onEnterSearchGuest = (input) => {
        setSearchGuest(input);
    };

    // update stays dates
    const onEnterSearchDateStay = (step, selectedDate) => {
        if (step === 'from' && searchDateStay.to && isBefore(searchDateStay.to, selectedDate)) {
            setSearchDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: undefined, toText: '' });
            onClickSubmenu(2);
            return;
        }

        if (step === 'from' && searchSubmenu === 1) {
            setSearchDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: searchDateStay.to, toText: searchDateStay.toText });
            onClickSubmenu(2);
            return;
        }
        
        if (step === 'from') {
            setSearchDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: undefined, toText: '' });
            onClickSubmenu(2);
            return;
        }

        setSearchDateStay({ from: searchDateStay.from, fromText: searchDateStay.fromText, to: selectedDate, toText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date });
    };

    // update experience dates
    const onEnterSearchDateExperience = (step, selectedDate) => {
        if (step === 'from') {
            setSearchDateExperience({ from: selectedDate, to: searchDateExperience.to, text: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date });
            return;
        }

        if (isSameDate(searchDateExperience.from, selectedDate))
            return;

        if (isSameMonth(searchDateExperience.from, selectedDate)) {
            setSearchDateExperience({ from: searchDateExperience.from, to: selectedDate, text: searchDateExperience.text + ' - ' + selectedDate.date });
            return;
        }

        setSearchDateExperience({ from: searchDateExperience.from, to: selectedDate, text: searchDateExperience.text + ' - ' + selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date });
    };

    return (
        <div className={styles.container} style={{ color: offsetY > benchmarkOffsetY ? 'var(--black)' : 'var(--white)' }} version='home'>
            
            {/* search */}
            <div className={styles.searchInput}>
                <SearchRoundedIcon style={{ color: 'var(--black)' }} />
                <input placeholder='Where are you going?' value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
            </div>

            {/* header background */}
            <div className={styles.background} style={backgroundStyle} />

            {/* screen cover */}
            <div id='screenCover' className='screenCover' style={{ display: openSearch || searchSubmenu !== -1 ? 'block' : 'none' }} mode={offsetY < benchmarkOffsetY ? 'transparent' : ''} onClick={() => onClickScreenCover()} />
        </div>
    );
}

export default Header;