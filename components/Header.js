import { useState, useEffect } from 'react';

import styles from '../styles/Header.module.css';
import { config, animated, useChain, useSpring, useSpringRef } from "@react-spring/web";

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useWindowOffset, useMousedownTarget, useWindowDimensions } from '../utilities/customHooks';
import { deviceBreakpoint, logoURL, searchMenuList } from '../utilities/database';

function Header() {
    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 
    const target = useMousedownTarget();

    const benchmarkOffsetY = 120;
    const [ curOffsetY, setCurOffsetY ] = useState(0);

    const [ logo, setLogo ] = useState(logoURL.white);
    const [ backgroundStyle, setBackgroundStyle ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });

    const [ search, setSearch ]  = useState(true);
    const [ openSearch, setOpenSearch ] = useState(false);

    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchSubmenu, setSearchSubmenu ] = useState(0);

    // search field animation
    const searchFieldRef = useSpringRef();
    const searchFieldStyle = useSpring({
        ref: searchFieldRef,
        config: { mass: 1, tension: 210, friction: 20, clamp: true },
        from: { 
            top: '0px',
            width: '820px',
            height: '62px',
            opacity: '0',
        },
        to: { 
            top: search || openSearch ? '62px' : '0px', 
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

    // update styling based on open search and offset
    useEffect(() => {
        let nlogo = logoURL.white;

        let nBackground = {};
        nBackground.backgroundColor = 'var(--transparent)';
        nBackground.boxShadow = 'none';
        nBackground.top = '-140px';

        if (offsetY > benchmarkOffsetY) {
            nlogo = logoURL.black;

            nBackground.backgroundColor = 'var(--white)';
            nBackground.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.1)';
            nBackground.top = search ? '0px' : '-90px';
        }

        setOpenSearch(Math.abs(curOffsetY - offsetY) > benchmarkOffsetY + 50 ? false : openSearch);
        setSearch(offsetY > benchmarkOffsetY ? openSearch : true);

        setLogo(nlogo);
        setBackgroundStyle(nBackground);
    }, [search, openSearch, offsetY]);

    // update click outside header to close search field
    useEffect(() => {
        if (target === 'screenCover') {
            setOpenSearch(false);
        }
    }, [target]);

    // toggle between search field and search button
    const onClickOpenSearch = () => {
        setOpenSearch(!openSearch);
        setCurOffsetY(offsetY);
    };

    // get styling of each submenu depending on current menu opened and each submenu
    const getSubmenuStyling = (menu, submenu) => {
        let styling = {};
        styling.display = (searchMenu === menu || submenu === 0) ? 'flex' : 'none';
        
        if (!search) { styling.color = 'var(--white)'; }
        if (submenu === 0) { styling.maxWidth = searchMenu === 0 ? '240px' : '50%'; }
        if (submenu === 3) { styling.minWidth = '240px'; }

        return styling;
    };

    return (
        <div className={styles.container} style={{ color: `${offsetY > benchmarkOffsetY ? 'var(--black)' : 'var(--white)'}` }}>
            
            {/* logo */}
            <img className={styles.logo} src={logo} alt='airbnb-logo' />

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
                        <div key={`menu_${item.menu}`} className={`${styles.searchMenuButton} ${searchMenu === i ? styles.searchMenuButtonActive : styles.searchMenuButtonInactive}`} onClick={() => setSearchMenu(i)}>
                            <p>{item.menu}</p>
                            <div style={{ backgroundColor: `${offsetY > benchmarkOffsetY ? 'var(--black)' : 'var(--white)' }` }} />
                        </div>
                    ))}
                </div>}

                {/* search field */}
                <animated.div className={styles.searchField} style={searchFieldStyle}>
                    {searchMenuList.map((item, i) => (
                        <div style={{ display: `${searchMenu === i ? 'flex' : 'none'}` }}>
                            <animated.div key={`submenu_${item.menu}`} style={searchFieldMenuStyle}>

                                {/* common submenu */}
                                <div className={styles.searchFieldMenu} style={getSubmenuStyling(-1, 0)} name='firstMenu'>
                                    <h6>{item.submenu[0]}</h6>
                                    <input placeholder='Where are you going?' />
                                </div>
                                
                                {/* first submenu group */}
                                <div className={styles.searchFieldMenu} style={getSubmenuStyling(0, 1)}>
                                    <h6>{item.submenu[1]}</h6>
                                    <p><small>something</small></p>
                                </div>
                                <div className={styles.searchFieldMenu} style={getSubmenuStyling(0, 2)}>
                                    <h6>{item.submenu[2]}</h6>
                                    <p><small>something</small></p>
                                </div>
                                <div className={styles.searchFieldMenu} style={getSubmenuStyling(0, 3)} name='lastMenu'>
                                    <h6>{item.submenu[3]}</h6>
                                    <p><small>with icon</small></p>
                                    <span className={styles.searchIcon}><SearchRoundedIcon /></span>
                                </div>

                                {/* second submenu group */}
                                <div className={styles.searchFieldMenu} style={getSubmenuStyling(1, 1)} name='lastMenu'>
                                    <h6>{item.submenu[1]}</h6>
                                    <p><small>with icon</small></p>
                                    <span className={styles.searchIcon}><SearchRoundedIcon /></span>
                                </div>
                            </animated.div>
                        </div>
                    ))}
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
