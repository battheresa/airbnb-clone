import { useState, useEffect, useRef } from 'react';

import styles from '../../../styles/header/Large.module.css';
import { config, animated, useChain, useSpring, useSpringRef } from '@react-spring/web';

import MenuList from '../../modal/MenuList';
import DateInput from '../../modal/DateInput';
import GuestInput from '../../modal/GuestInput';

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useWindowDimensions, useWindowOffset, useMousedownTarget } from '../../../utilities/customHooks';
import { isBefore, isSameDate, isSameMonth } from '../../../utilities/customService';
import { deviceBreakpoint, logoFull, logoMini, searchFilter } from '../../../utilities/config';

function Header(props) {
    const { locations, benchmarkOffsetY, changeRoute } = props;
    const { searchMenu, onChangeSearchMenu, searchSubmenu, onChangeSearchSubmenu } = props;

    const target = useMousedownTarget();
    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 

    const [ logo, setLogo ] = useState(logoFull.black);
    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });
    
    const [ curOffsetY, setCurOffsetY ] = useState(0);
    const [ locationList, setLocationList ] = useState([]);
    const submenuList = [useRef(), useRef(), useRef(), useRef(), useRef()];

    const [ search, setSearch ]  = useState(true);
    const [ openSearch, setOpenSearch ] = useState(false);
    
    const [ inputLocation, setInputLocation ] = useState('');
    const [ inputDateStay, setInputDateStay ] = useState({ from: undefined, fromText: '', to: undefined, toText: '' });
    const [ inputDateExperience, setInputDateExperience ] = useState({ from: undefined, to: undefined, text: '' });
    const [ inputGuest, setInputGuest ] = useState({ total: '', adults: 0, children: 0, infants: 0 });

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

            if (offsetY > benchmarkOffsetY)
                nlogo = logoMini.black;
        }
        else {
            nlogo = logoFull.white;

            if (offsetY > benchmarkOffsetY) 
                nlogo = logoFull.black;
        }

        setLogo(nlogo !== undefined ? nlogo : logo);
    }, [width, offsetY]);

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

    // update on click screen cover
    const onClickScreenCover = () => {
        if (target === 'screenCover') 
            setOpenSearch(false);

        onChangeMenu(searchMenu);
    };

    // toggle between search field and search button
    const onClickOpenSearch = () => {
        setOpenSearch(!openSearch);
        setCurOffsetY(offsetY);
    };

    // update styling when click on menu
    const onChangeMenu = (menu) => {
        onChangeSearchMenu(menu);
        onChangeSearchSubmenu(-1);

        for (let i = 0; i < 5; i ++) { 
            submenuList[i].current.classList.remove(styles.searchFieldMenuActive);
            
            if (i < 3)
                submenuList[i].current.classList.add(styles.searchFieldMenuSeperator);
        }

        submenuList[0].current.parentNode.parentNode.style.cssText += 'background-color: var(--white);';
    };

    // update styling when click on submenu
    const onChangeSubmenu = (submenu) => {
        onChangeSearchSubmenu(submenu);

        for (let i = 0; i < 5; i ++) {
            submenuList[i].current.classList.remove(styles.searchFieldMenuActive);

            if (i < 3) 
                submenuList[i].current.classList.add(styles.searchFieldMenuSeperator);
        }

        submenuList[submenu === 4 ? 0 : submenu].current.classList.remove(styles.searchFieldMenuSeperator);
        if (submenu - 1 >= 0) 
            submenuList[submenu - 1].current.classList.remove(styles.searchFieldMenuSeperator);
        
        submenuList[submenu].current.classList.add(styles.searchFieldMenuActive);
        submenuList[submenu].current.parentNode.parentNode.style.cssText += 'background-color: var(--grey002);';
    };

    // update seperator on mouse enter submenu
    const onMouseEnterSubmenu = (submenu) => {
        submenuList[submenu === 4 ? 0 : submenu].current.classList.remove(styles.searchFieldMenuSeperator);
        
        if (submenu - 1 >= 0)
            submenuList[submenu - 1].current.classList.remove(styles.searchFieldMenuSeperator);
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

    // get layout of submenu depending on current menu opened and each submenu
    const getSubmenuLayout = (menu, submenu) => {
        let nStyle = {};
        nStyle.display = (searchMenu === menu || submenu === 0) ? 'flex' : 'none';
        
        if (!search) 
            nStyle.color = 'var(--white)';
        
        if (submenu === 0) 
            nStyle.maxWidth = searchMenu === 0 ? '30%' : '50%';
        
        if (submenu === 3) 
            nStyle.minWidth = '25%';

        return nStyle;
    };

    // update selected location
    const onEnterSearchLocation = (input) => {
        setInputLocation(input);
        onChangeSubmenu(searchSubmenu + 1);
    };

    // update number of guests
    const onEnterSearchGuest = (input) => {
        setInputGuest(input);
    };

    // update stays dates
    const onEnterSearchDateStay = (step, selectedDate) => {
        if (step === 'from' && inputDateStay.to && isBefore(inputDateStay.to, selectedDate)) {
            setInputDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: undefined, toText: '' });
            onChangeSubmenu(2);
            return;
        }

        if (step === 'from' && searchSubmenu === 1) {
            setInputDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: inputDateStay.to, toText: inputDateStay.toText });
            onChangeSubmenu(2);
            return;
        }
        
        if (step === 'from') {
            setInputDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: undefined, toText: '' });
            onChangeSubmenu(2);
            return;
        }

        setInputDateStay({ from: inputDateStay.from, fromText: inputDateStay.fromText, to: selectedDate, toText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date });
    };

    // update experience dates
    const onEnterSearchDateExperience = (step, selectedDate) => {
        if (step === 'from') {
            setInputDateExperience({ from: selectedDate, to: inputDateExperience.to, text: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date });
            return;
        }

        if (isSameDate(inputDateExperience.from, selectedDate))
            return;

        if (isSameMonth(inputDateExperience.from, selectedDate)) {
            setInputDateExperience({ from: inputDateExperience.from, to: selectedDate, text: inputDateExperience.text + ' - ' + selectedDate.date });
            return;
        }

        setInputDateExperience({ from: inputDateExperience.from, to: selectedDate, text: inputDateExperience.text + ' - ' + selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date });
    };

    return (
        <div className={styles.container} style={{ color: offsetY > benchmarkOffsetY ? 'var(--black)' : 'var(--white)' }} version='home'>
            
            {/* logo */}
            <img className={styles.logo} src={logo} alt='airbnb-logo' onClick={(e) => changeRoute(e, '/')} />

            {/* search */}
            <div className={styles.search}>

                {/* search button */}
                {!search && <button className={styles.searchButton} onClick={() => onClickOpenSearch()}>
                    <h5>Start your search</h5>
                    <span className={styles.searchIcon}><SearchRoundedIcon fontSize='small' /></span>
                </button>}

                {/* search menu */}
                {search && <div className={styles.searchMenu}>
                    {searchFilter.map((item, i) => (
                        <div key={`menu_${item.menu}`} className={`${styles.searchMenuButton} ${searchMenu === i ? styles.searchMenuButtonActive : styles.searchMenuButtonInactive}`} onClick={() => onChangeMenu(i)}>
                            <p>{item.menu}</p>
                            <div style={{ backgroundColor: offsetY > benchmarkOffsetY ? 'var(--black)' : 'var(--white)' }} />
                        </div>
                    ))}
                </div>}

                {/* search field */}
                <animated.div className={styles.searchField} style={searchFieldStyle}>
                    <animated.div style={searchFieldMenuStyle}>

                        {/* location submenu */}
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuLayout(-1, 0)} onMouseEnter={() => onMouseEnterSubmenu(0)} onMouseLeave={() => onMouseLeaveSubmenu(0)} onClick={() => onChangeSubmenu(0)} ref={submenuList[0]}>
                            <h6>{searchFilter[0].submenu[0]}</h6>
                            <input placeholder='Where are you going?' value={inputLocation} onChange={(e) => setInputLocation(e.target.value)} />
                        </div>
                        <MenuList open={searchSubmenu === 0} mode='modal' content={locationList} type='locations' setSelected={onEnterSearchLocation} />
                        
                        {/* stays submenu group */}
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuLayout(0, 1)} onMouseEnter={() => onMouseEnterSubmenu(1)} onMouseLeave={() => onMouseLeaveSubmenu(1)} onClick={() => onChangeSubmenu(1)} ref={submenuList[1]}>
                            <h6>{searchFilter[0].submenu[1]}</h6>
                            <div>
                                <p><small>{inputDateStay.fromText === '' && 'Add dates'}</small></p>
                                <p><small>{inputDateStay.fromText !== '' && inputDateStay.fromText}</small></p>
                            </div>
                        </div>
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuLayout(0, 2)} onMouseEnter={() => onMouseEnterSubmenu(2)} onMouseLeave={() => onMouseLeaveSubmenu(2)} onClick={() => onChangeSubmenu(2)} ref={submenuList[2]}>
                            <h6>{searchFilter[0].submenu[2]}</h6>
                            <div>
                                <p><small>{inputDateStay.toText === '' && 'Add dates'}</small></p>
                                <p><small>{inputDateStay.toText !== '' && inputDateStay.toText}</small></p>
                            </div>
                        </div>
                        <DateInput open={searchSubmenu === 1 || searchSubmenu === 2} inline={false} mode={true} submenu={searchSubmenu} date={inputDateStay} setDate={onEnterSearchDateStay} />

                        <div className={styles.searchFieldMenu} style={getSubmenuLayout(0, 3)} onClick={() => onChangeSubmenu(3)} onMouseEnter={() => onMouseEnterSubmenu(3)} onMouseLeave={() => onMouseLeaveSubmenu(3)} ref={submenuList[3]}>
                            <h6>{searchFilter[0].submenu[3]}</h6>
                            <div>
                                <p><small>{inputGuest.total === '' && 'Add guests'}</small></p>
                                <p><small>{inputGuest.total !== '' && inputGuest.total}</small></p>
                            </div>
                            <span className={styles.searchIcon} onClick={(e) => changeRoute(e, '/search', { location: inputLocation, checkin: inputDateStay.from, checkout: inputDateStay.to, guest: inputGuest })}><SearchRoundedIcon /></span>
                        </div>
                        <GuestInput open={searchSubmenu === 3} inline={false} guest={inputGuest} setGuest={onEnterSearchGuest}/>

                        {/* experience submenu group */}
                        <div className={styles.searchFieldMenu} style={getSubmenuLayout(1, 1)} onClick={() => onChangeSubmenu(4)} onMouseEnter={() => onMouseEnterSubmenu(4)} onMouseLeave={() => onMouseLeaveSubmenu(4)} ref={submenuList[4]}>
                            <h6>{searchFilter[1].submenu[1]}</h6>
                            <div>
                                <p><small>{inputDateExperience.text === '' && 'Add when you want to go'}</small></p>
                                <p><small>{inputDateExperience.text !== '' && inputDateExperience.text}</small></p>
                            </div>
                            <span className={styles.searchIcon} onClick={(e) => changeRoute(e, '/search', { location: inputLocation, checkin: inputDateExperience.from, checkout: inputDateExperience.to })}><SearchRoundedIcon /></span>
                        </div>
                        <DateInput open={searchSubmenu === 4} inline={false} mode={false} submenu={searchSubmenu} date={inputDateExperience} setDate={onEnterSearchDateExperience} />
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
            <div id='screenCover' className='screenCover' style={{ display: openSearch || searchSubmenu !== -1 ? 'block' : 'none' }} mode={offsetY < benchmarkOffsetY ? 'transparent' : ''} onClick={() => onClickScreenCover()} />
        </div>
    );
}

export default Header;
