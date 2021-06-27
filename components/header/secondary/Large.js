import { useRouter } from 'next/router';

import { useState, useEffect, useRef } from 'react';

import styles from '../../../styles/Header.module.css';
import { config, animated, useChain, useSpring, useSpringRef } from '@react-spring/web';

import MenuList from '../../modal/MenuList';
import DateInput from '../../modal/DateInput';
import GuestInput from '../../modal/GuestInput';

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useWindowDimensions, useWindowOffset, useMousedownTarget } from '../../../utilities/customHooks';
import { formatDate, isBefore, isSameDate, isSameMonth } from '../../../utilities/customService';
import { deviceBreakpoint, logoFull, logoMini, searchFilter } from '../../../utilities/config';
import { getSearchLocations } from '../../../utilities/services';

function Header() {
    const router = useRouter();

    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 
    const target = useMousedownTarget();

    const benchmarkOffsetY = 120;
    const [ curOffsetY, setCurOffsetY ] = useState(0);

    const [ logo, setLogo ] = useState(logoFull.coral);
    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });

    const [ search, setSearch ]  = useState(true);
    const [ openSearch, setOpenSearch ] = useState(false);

    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchSubmenu, setSearchSubmenu ] = useState(-1);

    const submenuList = [useRef(), useRef(), useRef(), useRef(), useRef()];

    const [ searchButtonText, setSearchButtonText ] = useState('Start your search');

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

    // parse search query from url
    useEffect(() => {
        if (router.query.menu) {
            setSearchMenu(parseInt(router.query.menu));
        }

        if (router.query.location) {
            let from = router.query.checkin.split('-');
            let dateFrom = formatDate(new Date(parseInt(from[0]), parseInt(from[1]), parseInt(from[2])));
            
            let to = router.query.checkout.split('-');
            let dateTo = formatDate(new Date(parseInt(to[0]), parseInt(to[1]), parseInt(to[2])));
            
            let location = router.query.location.replaceAll('-', ', ');
            for (let i = location.length - 1; i >= 0; i--) {
                if (location[i] === location[i].toUpperCase()) {
                    location = location.substring(0, i) + ' ' + location.substring(i);
                }
            }

            let buttonText = { location: location, date: '', guest: '' };
            
            if (router.query.checkin && router.query.checkout) {
                if (Object.entries(router.query).length === 4) {
                    let dateText = dateFrom.monthText + ' ' + dateFrom.date;
                    dateText += dateFrom.month === dateTo.month ? ' - ' : ' - ' + dateTo.monthText.slice(0, 3) + ' ';
                    dateText += dateTo.date;

                    buttonText.date = dateText;
                    setSearchDateExperience({ from: dateFrom, to: dateTo, text: dateText });
                }

                if (Object.entries(router.query).length === 5) {
                    buttonText.date = dateFrom.monthText.slice(0, 3) + ' ' + dateFrom.date + ' - ' + (dateFrom.month === dateTo.month ? dateTo.date : dateTo.monthText.slice(0, 3) + ' ' + dateTo.date);
                    setSearchDateStay({ from: dateFrom, fromText: dateFrom.monthText.slice(0, 3) + ' ' + dateFrom.date, to: dateTo, toText: dateTo.monthText.slice(0, 3) + ' ' + dateTo.date });
                }
            } 
            else {
                buttonText.date = '';

                if (Object.entries(router.query).length === 4) {
                    setSearchDateExperience({ from: dateFrom, to: dateTo, text: '' });
                }

                if (Object.entries(router.query).length === 5) {
                    setSearchDateStay({ from: dateFrom, fromText: '', to: dateTo, toText: '' });
                }
            }

            if (router.query.quest) {
                let guest = router.query.guest.split('-');
                let guestText = `${parseInt(guest[0]) + parseInt(guest[1])} guest${parseInt(guest[0]) + parseInt(guest[1]) <= 1 ? '' : 's'}`;

                if (parseInt(guest[2]) > 0)
                    guestText += `, ${parseInt(guest[2])} infant${parseInt(guest[2]) === 1 ? '' : 's'}`;

                if (parseInt(guest[0]) + parseInt(guest[1]) + parseInt(guest[2]) === 0)
                    guestText = '';

                buttonText.guest = guestText.split(',')[0];
                setSearchGuest({ total: guestText, adults: parseInt(guest[0]), children: parseInt(guest[1]), infants: parseInt(guest[2]) });
            }

            setSearchButtonText(buttonText);
            setSearchLocation(location);
        }
    }, [router.query]);

    // update background styling
    useEffect(() => {
        let nBackground = {};
        nBackground.backgroundColor = 'var(--white)';
        nBackground.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.1)';
        nBackground.top = search ? width < deviceBreakpoint.medium - 60 ? '0px' : '-55px' : '-140px';

        setBackgroundStyle(nBackground);
        setSearch(openSearch);
        setOpenSearch(Math.abs(curOffsetY - offsetY) > benchmarkOffsetY + 50 ? false : openSearch);
    }, [search, openSearch, offsetY]);

    // update content on width change
    useEffect(() => {
        let nlogo = width < deviceBreakpoint.medium ? logoMini.coral : logoFull.coral;
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
        setOpenSearch(false);

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
        nStyle.color = 'var(--black)';

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
        <div className={styles.container} style={{ color: 'var(--black)' }} version='other' mode={parseInt(router.query.menu) === 0 ? 'stay' : 'experience'}>
            
            {/* logo */}
            <img className={styles.logo} src={logo} alt='airbnb-logo' onClick={(e) => changeRoute(e, '/')} />

            {/* search */}
            <div className={styles.search}>

                {/* search button */}
                {!search && <button className={styles.searchButton} onClick={() => onClickOpenSearch()}>
                    
                    {/* search filters */}
                    {typeof searchButtonText === 'object' && <h5 className={styles.searchText} style={{ width: 'fit-content', marginRight: '20px' }}>
                        <span>{searchButtonText?.location?.split(',')[0]}</span>
                        <span>{searchButtonText?.date !== '' ? searchButtonText?.date : <span style={{ color: 'var(--grey006)', fontWeight: '300' }}>Add dates</span>}</span>
                        {parseInt(router.query.menu) === 0 && <span>
                            {searchButtonText?.guest !== '' ? searchButtonText?.guest : <span style={{ color: 'var(--grey006)', fontWeight: '300'}}>Add guest</span>}
                        </span>}
                    </h5>}

                    {/* default text */}
                    {typeof searchButtonText === 'string' && <h5 className={styles.searchText}>{searchButtonText}</h5>}

                    {/* search icon */}
                    <span className={styles.searchIcon}><SearchRoundedIcon fontSize='small' /></span>
                </button>}

                {/* search menu */}
                {search && <div className={styles.searchMenu}>
                    {searchFilter.map((item, i) => (
                        <div key={`menu_${item.menu}`} className={`${styles.searchMenuButton} ${searchMenu === i ? styles.searchMenuButtonActive : styles.searchMenuButtonInactive}`} onClick={() => onClickMenu(i)}>
                            <p>{item.menu}</p>
                            <div style={{ backgroundColor: 'var(--black)' }} />
                        </div>
                    ))}
                </div>}

                {/* search field */}
                <animated.div className={styles.searchField} style={searchFieldStyle}>
                    <animated.div style={searchFieldMenuStyle}>

                        {/* common submenu */}
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuStyle(-1, 0)} onMouseEnter={() => onMouseEnterSubmenu(0)} onMouseLeave={() => onMouseLeaveSubmenu(0)} onClick={() => onClickSubmenu(0)} ref={submenuList[0]}>
                            <h6>{searchFilter[0].submenu[0]}</h6>
                            <input placeholder='Where are you going?' value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
                        </div>
                        <MenuList open={searchSubmenu === 0} content={searchLocationList} setSelected={onEnterSearchLocation} />
                        
                        {/* first submenu group */}
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuStyle(0, 1)} onMouseEnter={() => onMouseEnterSubmenu(1)} onMouseLeave={() => onMouseLeaveSubmenu(1)} onClick={() => onClickSubmenu(1)} ref={submenuList[1]}>
                            <h6>{searchFilter[0].submenu[1]}</h6>
                            <div>
                                <p><small>{searchDateStay.fromText === '' && 'Add dates'}</small></p>
                                <p><small>{searchDateStay.fromText !== '' && searchDateStay.fromText}</small></p>
                            </div>
                        </div>
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuStyle(0, 2)} onMouseEnter={() => onMouseEnterSubmenu(2)} onMouseLeave={() => onMouseLeaveSubmenu(2)} onClick={() => onClickSubmenu(2)} ref={submenuList[2]}>
                            <h6>{searchFilter[0].submenu[2]}</h6>
                            <div>
                                <p><small>{searchDateStay.toText === '' && 'Add dates'}</small></p>
                                <p><small>{searchDateStay.toText !== '' && searchDateStay.toText}</small></p>
                            </div>
                        </div>
                        <DateInput open={searchSubmenu === 1 || searchSubmenu === 2} mode={true} submenu={searchSubmenu} date={searchDateStay} setDate={onEnterSearchDateStay} />

                        <div className={styles.searchFieldMenu} style={getSubmenuStyle(0, 3)} onMouseEnter={() => onMouseEnterSubmenu(3)} onMouseLeave={() => onMouseLeaveSubmenu(3)} ref={submenuList[3]}>
                            <h6 onClick={() => onClickSubmenu(3)}>{searchFilter[0].submenu[3]}</h6>
                            <div onClick={() => onClickSubmenu(3)}>
                                <p><small>{searchGuest.total === '' && 'Add guests'}</small></p>
                                <p><small>{searchGuest.total !== '' && searchGuest.total}</small></p>
                            </div>
                            <span className={styles.searchIcon} onClick={(e) => changeRoute(e, '/search', { location: searchLocation, checkin: searchDateStay.from, checkout: searchDateStay.to, guest: searchGuest })}><SearchRoundedIcon /></span>
                        </div>
                        <GuestInput open={searchSubmenu === 3} guest={searchGuest} setGuest={onEnterSearchGuest}/>

                        {/* second submenu group */}
                        <div className={styles.searchFieldMenu} style={getSubmenuStyle(1, 1)} onMouseEnter={() => onMouseEnterSubmenu(4)} onMouseLeave={() => onMouseLeaveSubmenu(4)} ref={submenuList[4]}>
                            <h6 onClick={() => onClickSubmenu(4)}>{searchFilter[1].submenu[1]}</h6>
                            <div onClick={() => onClickSubmenu(4)}>
                                <p><small>{searchDateExperience.text === '' && 'Add when you want to go'}</small></p>
                                <p><small>{searchDateExperience.text !== '' && searchDateExperience.text}</small></p>
                            </div>
                            <span className={styles.searchIcon} onClick={(e) => changeRoute(e, '/search', { location: searchLocation, checkin: searchDateExperience.from, checkout: searchDateExperience.to })}><SearchRoundedIcon /></span>
                        </div>
                        <DateInput open={searchSubmenu === 4} mode={false} submenu={searchSubmenu} date={searchDateExperience} setDate={onEnterSearchDateExperience} />
                    </animated.div>
                </animated.div>
            </div>

            {/* menu */}
            <div className={styles.menu}>
                <h5 className={styles.menuItem}>Become a host</h5>
                <LanguageRoundedIcon fontSize='small' className={styles.menuItem} />

                <div className={styles.avatar}>
                    <MenuRoundedIcon fontSize='small' style={{ marginRight: '8px'}} />
                    <AccountCircleIcon fontSize='large' style={{ color: 'var(--grey007)'}} />
                </div>
            </div>

            {/* header background */}
            <div className={styles.background} style={backgroundStyle} />

            {/* screen cover */}
            <div id='screenCover' className='screenCover' style={{ display: openSearch ? 'block' : 'none' }} onClick={() => onClickScreenCover()} />
        </div>
    );
}

export default Header;