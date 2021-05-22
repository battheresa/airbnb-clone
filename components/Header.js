import { useState, useEffect, useRef } from 'react';

import styles from '../styles/Header.module.css';
import { config, animated, useChain, useSpring, useSpringRef } from "@react-spring/web";

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useWindowDimensions, useWindowOffset, useMousedownTarget } from '../utilities/customHooks';
import { deviceBreakpoint, logoFullURL, logoMiniURL, searchMenuList } from '../utilities/database';

function Header() {
    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 
    const target = useMousedownTarget();

    const benchmarkOffsetY = 120;
    const [ curOffsetY, setCurOffsetY ] = useState(0);

    const [ logo, setLogo ] = useState(logoFullURL.white);
    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });

    const [ search, setSearch ]  = useState(true);
    const [ openSearch, setOpenSearch ] = useState(false);

    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchSubmenu, setSearchSubmenu ] = useState(-1);

    const submenuLocation = useRef();
    const submenuCheckin = useRef();
    const submenuCheckout = useRef();
    const submenuGuest = useRef();
    const submenuDate = useRef();
    const submenuList = [submenuLocation, submenuCheckin, submenuCheckout, submenuGuest, submenuDate];

    // search field animation
    const searchFieldRef = useSpringRef();
    const searchFieldStyle = useSpring({
        ref: searchFieldRef,
        config: { mass: 1, tension: 210, friction: 20, clamp: true },
        from: { 
            top: '0px',
            left: width < deviceBreakpoint.medium - 60 ? '10%' : 'auto',
            width: '820px',
            height: '62px',
            opacity: '0',
        },
        to: { 
            top: search || openSearch ? '62px' : '0px', 
            left: width < deviceBreakpoint.medium - 60 ? '5%' : 'auto',
            width: search || openSearch ? '820px' : '300px',
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

    // update click outside header to close search field
    useEffect(() => {
        if (target === 'screenCover') {
            setOpenSearch(false);
        }
    }, [target]);

    // update content on width change
    useEffect(() => {
        let nlogo = undefined;

        if (width < deviceBreakpoint.medium) {
            nlogo = logoMiniURL.white;

            if (offsetY > benchmarkOffsetY) {
                nlogo = logoMiniURL.black;
            }
        }
        else {
            nlogo = logoFullURL.white;

            if (offsetY > benchmarkOffsetY) {
                nlogo = logoFullURL.black;
            }
        }

        setLogo(nlogo !== undefined ? nlogo : logo);
    }, [width, offsetY]);

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
        if (searchSubmenu === 4) {
            return;
        }

        if (searchSubmenu === -1 || submenu < searchSubmenu - 1 || submenu > searchSubmenu) {
            submenuList[submenu < 3 ? submenu : 0].current.classList.add(styles.searchFieldMenuSeperator);
        }

        if (searchSubmenu !== submenu && submenu - 1 >= 0) {
            submenuList[submenu - 1].current.classList.add(styles.searchFieldMenuSeperator);
        }
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

    return (
        <div className={styles.container} style={{ color: `${offsetY > benchmarkOffsetY ? 'var(--black)' : 'var(--white)'}` }}>
            
            {/* logo */}
            <img className={styles.logo} src={logo} alt='airbnb-logo' />

            {/* search input (small screen) */}
            <div className={styles.searchInput}>
                <SearchRoundedIcon style={{ color: 'var(--black)' }} />
                <input placeholder='Where are you going?' />
            </div>

            {/* search */}
            <div className={styles.search}>

                {/* search button */}
                {!search && <button className={styles.searchButton} onClick={() => onClickOpenSearch()}>
                    <h5>Start your search</h5>
                    <span className={styles.searchIcon}><SearchRoundedIcon fontSize='small' /></span>
                </button>}

                {/* search menu */}
                {search && <div className={styles.searchMenu}>
                    {searchMenuList.map((item, i) => (
                        <div key={`menu_${item.menu}`} className={`${styles.searchMenuButton} ${searchMenu === i ? styles.searchMenuButtonActive : styles.searchMenuButtonInactive}`} onClick={() => onClickMenu(i)}>
                            <p>{item.menu}</p>
                            <div style={{ backgroundColor: `${offsetY > benchmarkOffsetY ? 'var(--black)' : 'var(--white)' }` }} />
                        </div>
                    ))}
                </div>}

                {/* search field */}
                <animated.div className={styles.searchField} style={searchFieldStyle}>
                    <animated.div style={searchFieldMenuStyle}>

                        {/* common submenu */}
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuStyle(-1, 0)} onMouseEnter={() => onMouseEnterSubmenu(0)} onMouseLeave={() => onMouseLeaveSubmenu(0)} onClick={() => onClickSubmenu(0)} ref={submenuLocation}>
                            <h6>{searchMenuList[0].submenu[0]}</h6>
                            <input placeholder='Where are you going?' />
                        </div>
                        
                        {/* first submenu group */}
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuStyle(0, 1)} onMouseEnter={() => onMouseEnterSubmenu(1)} onMouseLeave={() => onMouseLeaveSubmenu(1)} onClick={() => onClickSubmenu(1)} ref={submenuCheckin}>
                            <h6>{searchMenuList[0].submenu[1]}</h6>
                            <p><small>something</small></p>
                        </div>
                        <div className={`${styles.searchFieldMenu} ${styles.searchFieldMenuSeperator}`} style={getSubmenuStyle(0, 2)} onMouseEnter={() => onMouseEnterSubmenu(2)} onMouseLeave={() => onMouseLeaveSubmenu(2)} onClick={() => onClickSubmenu(2)} ref={submenuCheckout}>
                            <h6>{searchMenuList[0].submenu[2]}</h6>
                            <p><small>something</small></p>
                        </div>
                        <div className={styles.searchFieldMenu} style={getSubmenuStyle(0, 3)} onClick={() => onClickSubmenu(3)} onMouseEnter={() => onMouseEnterSubmenu(3)} onMouseLeave={() => onMouseLeaveSubmenu(3)} ref={submenuGuest}>
                            <h6>{searchMenuList[0].submenu[3]}</h6>
                            <p><small>with icon</small></p>
                            <span className={styles.searchIcon}><SearchRoundedIcon /></span>
                        </div>

                        {/* second submenu group */}
                        <div className={styles.searchFieldMenu} style={getSubmenuStyle(1, 1)} onClick={() => onClickSubmenu(4)} onMouseEnter={() => onMouseEnterSubmenu(4)} onMouseLeave={() => onMouseLeaveSubmenu(4)} ref={submenuDate}>
                            <h6>{searchMenuList[1].submenu[1]}</h6>
                            <p><small>with icon</small></p>
                            <span className={styles.searchIcon}><SearchRoundedIcon /></span>
                        </div>
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
            <div id='screenCover' className='screenCover' style={{ display: `${openSearch ? 'block' : 'none'}` }} />
        </div>
    );
}

export default Header;
