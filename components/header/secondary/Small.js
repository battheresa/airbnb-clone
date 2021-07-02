import { useState, useEffect, useRef } from 'react';

import styles from '../../../styles/header/Small.module.css';

import MenuList from '../../modal/MenuList';
import DateInput from '../../modal/DateInput';
import GuestInput from '../../modal/GuestInput';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import TodayIcon from '@material-ui/icons/Today';
import PeopleIcon from '@material-ui/icons/People';

import { useMousedownTarget, useWindowDimensions, useWindowOffset } from '../../../utilities/customHooks';
import { getMonth, formatDate, isBefore, isSameDate, isSameMonth } from '../../../utilities/customService';

function Header(props) {
    const { locations, benchmarkOffsetY, changeRoute } = props;
    const { searchMenu, onChangeSearchMenu, searchSubmenu, onChangeSearchSubmenu } = props;
    const { searchButtonText, searchLocation, searchGuest, searchDateStay, searchDateExperience } = props;

    const target = useMousedownTarget();
    const { width, height } = useWindowDimensions();
    const { offsetX, offsetY } = useWindowOffset(); 

    const [ backgroundStyle ] = useState({ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--grey004)', top: '-158px' });
    const [ search, setSearch ]  = useState(false);
    const [ curOffsetY, setCurOffsetY ] = useState(0);

    const [ locationList, setLocationList ] = useState([]);
    const [ inputLocation, setInputLocation ] = useState(searchLocation);
    const [ inputDateStay, setInputDateStay ] = useState(searchDateStay);
    const [ inputDateExperience, setInputDateExperience ] = useState(searchDateExperience);
    const [ inputGuest, setInputGuest ] = useState(searchGuest);

    // update background styling
    useEffect(() => {
        setSearch(Math.abs(curOffsetY - offsetY) > benchmarkOffsetY + 50 ? false : search);
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

    // update on click screen cover
    const onClickScreenCover = () => {
        if (target === 'screenCover') 
            setSearch(false);
    };

    // open search menu
    const onClickOpenSearch = (open, submenu) => {
        setSearch(open);
        setCurOffsetY(offsetY);
        onChangeSearchSubmenu(submenu);
    };

    // get new search result
    const getSearchResult = (event, path, params) => {
        setSearch(false);
        changeRoute(event, path, params);
    };

    // update selected location
    const onEnterInputLocation = (input) => {
        setInputLocation(input);
    };

    // update number of guests
    const onEnterInputGuest = (input) => {
        setInputGuest(input);
    };

    // update stays dates
    const onEnterInputDateStay = (step, selectedDate) => {
        if (step === 'from' && inputDateStay.to && isBefore(inputDateStay.to, selectedDate)) {
            setInputDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: undefined, toText: '' });
            onChangeSearchSubmenu(2);
            return;
        }

        if (step === 'from' && searchSubmenu === 1) {
            setInputDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: inputDateStay.to, toText: inputDateStay.toText });
            onChangeSearchSubmenu(2);
            return;
        }
        
        if (step === 'from') {
            setInputDateStay({ from: selectedDate, fromText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date, to: undefined, toText: '' });
            onChangeSearchSubmenu(2);
            return;
        }

        if (isSameDate(inputDateStay.from, selectedDate))
            return;

        setInputDateStay({ from: inputDateStay.from, fromText: inputDateStay.fromText, to: selectedDate, toText: selectedDate.monthText.slice(0, 3) + ' ' + selectedDate.date });
    };

    // update experience dates
    const onEnterInputDateExperience = (step, selectedDate) => {
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
        <div className={styles.container} version='other'>
            
            {/* search */}
            <div className={styles.search}>

                {/* search button */}
                <div className={styles.searchButton} version='other' onClick={() => onClickOpenSearch(true, -1)}>
                    <div>
                        <button onClick={(e) => changeRoute(e, '/')}><NavigateBeforeIcon /></button>
                        {typeof searchButtonText === 'object' && <h5>{searchButtonText?.location?.split(',')[0]}</h5>}
                        {typeof searchButtonText === 'string' && <h5>{searchButtonText}</h5>}
                    </div>
                    <h5>{searchButtonText?.date !== '' ? searchButtonText?.date : <span style={{ color: 'var(--grey006)', fontWeight: '300' }}>Add dates</span>}</h5>
                </div>

                {/* search menu */}
                {search && <div className={styles.searchMenu} version='other'>
                    <h4>Edit your search</h4>
                    <div className={styles.searchSummary}>
                        <h5 onClick={() => onChangeSearchSubmenu(0)}><SearchRoundedIcon /><span>{searchButtonText?.location}</span></h5>
                        <div>
                            <h5 onClick={() => onChangeSearchSubmenu(4)}><TodayIcon /><span>{searchButtonText?.date !== '' ? searchButtonText?.date : <span style={{ color: 'var(--grey006)', fontWeight: '300' }}>Add dates</span>}</span></h5>
                            {searchMenu === 0 && <h5 onClick={() => onChangeSearchSubmenu(3)}><PeopleIcon /><span>{searchButtonText?.guest !== '' ? searchButtonText?.guest : <span style={{ color: 'var(--grey006)', fontWeight: '300' }}>Add guests</span>}</span></h5>}
                        </div>
                    </div>
                </div>}

                {/* search field */}
                <section className={styles.searchField} style={{ top: `${search && searchSubmenu > -1 ? 0 : height + 50}px` }}>
                    {searchSubmenu === 0 && <div>
                        <button onClick={() => onChangeSearchSubmenu(-1)}><NavigateBeforeIcon  /></button>
                        <input placeholder='Where are you going?' value={inputLocation} onChange={(e) => setInputLocation(e.target.value)} />
                    </div>}
                    {searchSubmenu > 0 && <button onClick={() => onChangeSearchSubmenu(-1)}><CloseRoundedIcon /></button>}

                    {searchSubmenu === 0 && <div>
                        <MenuList open={search} mode='inline' content={locationList} type='locations' setSelected={onEnterInputLocation} />
                    </div>}

                    {searchSubmenu === 3 && <div>
                        <h3><big>Who are coming?</big></h3>
                        <GuestInput open={true} inline={true} guest={inputGuest} setGuest={onEnterInputGuest}/>
                    </div>}

                    {searchSubmenu === 4 && <div>
                        <h3><big>When will you be there?</big></h3>
                        <DateInput open={true} inline={true} mode={false} submenu={searchSubmenu} date={searchMenu === 0 ? inputDateStay : inputDateExperience} setDate={searchMenu === 0 ? onEnterInputDateStay : onEnterInputDateExperience} />
                    </div>}

                    <div>
                        <button onClick={(e) => getSearchResult(e, '/search', { location: inputLocation, checkin: inputDateExperience.from, checkout: inputDateExperience.to, guest: inputGuest })}>
                            <SearchRoundedIcon style={{ marginRight: '10px' }} />Search
                        </button>
                    </div>
                </section>
            </div>

            {/* header background */}
            <div className={styles.background} style={backgroundStyle} />

            {/* screen cover */}
            <div id='screenCover' className='screenCover' style={{ display: search ? 'block' : 'none' }} onClick={() => onClickScreenCover()} />
        </div>
    );
}

export default Header;
