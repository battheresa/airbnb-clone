import { useState, useEffect } from 'react';

import styles from '../styles/Header.module.css';

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useWindowOffset, useMousedownTarget } from '../utilities/customHooks';
import { logoURL, searchMenuList } from '../utilities/database';

function Header() {
    const { offsetX, offsetY } = useWindowOffset(); 
    const target = useMousedownTarget();

    const benchmarkOffsetY = 120;
    const [ curOffsetY, setCurOffsetY ] = useState(0);

    const [ logo, setLogo ] = useState(logoURL.white);
    const [ search, setSearch ]  = useState(true);     // true = Field fields, false = button,
    const [ openSearch, setOpenSearch ] = useState(false);
    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchSubmenu, setSearchSubmenu ] = useState(0);

    const [ backgroundStyling, setBackgroundStyling ] = useState({ backgroundColor: 'var(--transparent)', boxShadow: 'none', top: '-140px' });
    const [ searchFieldStyling, setSearchFieldStyling ] = useState({ opacity: '1', width: '820px', height: '62px', top: '62px', left: 'calc(50% - 410px)' });

    // update styling based on open search and offset
    useEffect(() => {
        let nlogo = logoURL.white;

        let nBackground = {};
        nBackground.backgroundColor = 'var(--transparent)';
        nBackground.boxShadow = 'none';
        nBackground.top = '-140px';

        let nSearchField = {};
        nSearchField.opacity = '1';
        nSearchField.width = '820px';
        nSearchField.height = '62px';
        nSearchField.top = '62px';
        nSearchField.left = 'calc(50% - 410px)';

        if (offsetY > benchmarkOffsetY) {
            nlogo = logoURL.black;

            nBackground.backgroundColor = 'var(--white)';
            nBackground.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.1)';
            nBackground.top = search ? '0px' : '-90px';

            if (!search) {
                nSearchField.opacity = '0';
                nSearchField.width = '300px';
                nSearchField.height = '44px';
                nSearchField.top = '0';
                nSearchField.left = 'calc(50% - 150px)';
            }
        }

        setOpenSearch(Math.abs(curOffsetY - offsetY) > benchmarkOffsetY + 50 ? false : openSearch);
        setSearch(offsetY > benchmarkOffsetY ? openSearch : true);

        setLogo(nlogo);
        setBackgroundStyling(nBackground);
        setSearchFieldStyling(nSearchField);
    }, [search, openSearch, offsetY]);

    // update click outside header to close search field
    useEffect(() => {
        if (target === 'screenCover') {
            setOpenSearch(false);
        }
    }, [target]);

    // toggle between search field and search button
    const onClickOpenSearch = () => {
        setOpenSearch(!openSearch)
        setCurOffsetY(offsetY);
    };

    // get styling according to each submenu order
    const getSubmenuStyling = (menu, submenu) => {
        let styling = {};
        styling.display = (searchMenu === menu || submenu === 0) ? 'flex' : 'none';

        if (submenu === 0) {
            styling.maxWidth = searchMenu === 0 ? '240px' : '50%';
        }

        if (submenu === 3) {
            styling.minWidth = '240px';
        }

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

                {/* search submenu */}
                <div className={styles.searchField} style={searchFieldStyling}>
                    {searchMenuList.map((item, i) => (
                        <div key={`submenu_${item.menu}`} style={{ display: `${searchMenu === i ? 'flex' : 'none'}` }}>
                            
                            {/* common submenu */}
                            <div className={styles.searchFieldMenu} style={getSubmenuStyling(-1, 0)}>
                                <h6>{item.submenu[0]}</h6>
                                <input placeholder='Where are you going?' />
                            </div>
                            
                            {/* first menu submenu */}
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

                            {/* second menu submenu */}
                            <div className={styles.searchFieldMenu} style={getSubmenuStyling(1, 1)} name='lastMenu'>
                                <h6>{item.submenu[1]}</h6>
                                <p><small>with icon</small></p>
                                <span className={styles.searchIcon}><SearchRoundedIcon /></span>
                            </div>
                        </div>
                    ))}
                </div>
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
            <div className={styles.background} style={backgroundStyling} />

            {/* screen cover */}
            <div id='screenCover' className='screenCover' style={{ display: `${openSearch ? 'block' : 'none'}` }} />
        </div>
    );
}

export default Header;
