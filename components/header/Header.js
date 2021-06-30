import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import PrimaryLarge from './primary/Large';
import PrimarySmall from './primary/Small';
import SecondaryLarge from './secondary/Large';
import SecondarySmall from './secondary/Small';

import { getSearchLocations } from '../../utilities/services';
import { useWindowDimensions } from '../../utilities/customHooks'; 
import { formatDate, isBefore, isSameDate, isSameMonth } from '../../utilities/customService';

function Header({ mode }) {
    const router = useRouter();
    const benchmarkOffsetY = 120;
    const { width, height } = useWindowDimensions();

    const [ locations, setLocations ] = useState([]);
    const [ searchMenu, setSearchMenu ] = useState(0);
    const [ searchSubmenu, setSearchSubmenu ] = useState(-1);

    const [ searchButtonText, setSearchButtonText ] = useState('Start your search');

    const [ searchLocation, setSearchLocation ] = useState('');
    const [ searchDateStay, setSearchDateStay ] = useState({ from: undefined, fromText: '', to: undefined, toText: '' });
    const [ searchDateExperience, setSearchDateExperience ] = useState({ from: undefined, to: undefined, text: '' });
    const [ searchGuest, setSearchGuest ] = useState({ total: '', adults: 0, children: 0, infants: 0 });

    // get search locations
    useEffect(() => {
        getSearchLocations().then(content => setLocations(content));
    }, []);

    // parse search menu from url
    useEffect(() => {
        if (router.query.menu) {
            setSearchMenu(parseInt(router.query.menu));
        }
    }, [router.query.menu]);

    // parse search query from url
    useEffect(() => {
        if (mode === 'secondary' && router.query.location) {
            // format dates
            let from = router.query.checkin.split('-');
            let dateFrom = formatDate(new Date(parseInt(from[0]), parseInt(from[1]), parseInt(from[2])));
            
            let to = router.query.checkout.split('-');
            let dateTo = formatDate(new Date(parseInt(to[0]), parseInt(to[1]), parseInt(to[2])));
            
            // format location text
            let location = router.query.location.replaceAll('-', ', ');
            for (let i = location.length - 1; i > 0; i--) {
                if (location[i] === location[i].toUpperCase()) {
                    location = location.substring(0, i) + ' ' + location.substring(i);
                }
            }
            setSearchLocation(location);

            // fotmat button text
            let buttonText = { location: location, date: '', guest: '' };
            
            // format checkin and checkout dates text
            if (router.query.checkin && router.query.checkout) {
                if (parseInt(router.query.menu) === 0) {
                    buttonText.date = dateFrom.monthText.slice(0, 3) + ' ' + dateFrom.date + ' - ' + (dateFrom.month === dateTo.month ? dateTo.date : dateTo.monthText.slice(0, 3) + ' ' + dateTo.date);
                    setSearchDateStay({ from: dateFrom, fromText: dateFrom.monthText.slice(0, 3) + ' ' + dateFrom.date, to: dateTo, toText: dateTo.monthText.slice(0, 3) + ' ' + dateTo.date });
                    setSearchDateExperience({ from: undefined, to: undefined, text: '' });
                }

                if (parseInt(router.query.menu) === 1) {
                    let dateText = dateFrom.monthText + ' ' + dateFrom.date;
                    dateText += dateFrom.month === dateTo.month ? ' - ' : ' - ' + dateTo.monthText.slice(0, 3) + ' ';
                    dateText += dateTo.date;

                    buttonText.date = dateText;
                    setSearchDateStay({ from: undefined, fromText: '', to: undefined, toText: '' });
                    setSearchDateExperience({ from: dateFrom, to: dateTo, text: dateText });
                }
            }
            else {
                setSearchDateStay({ from: dateFrom, fromText: '', to: dateTo, toText: '' });
                setSearchDateExperience({ from: dateFrom, to: dateTo, text: '' });
            }

            // format guest text
            if (router.query.guest) {
                let guest = router.query.guest.split('-');
                let guestText = `${parseInt(guest[0]) + parseInt(guest[1])} guest${parseInt(guest[0]) + parseInt(guest[1]) <= 1 ? '' : 's'}`;

                if (parseInt(guest[2]) > 0)
                    guestText += `, ${parseInt(guest[2])} infant${parseInt(guest[2]) === 1 ? '' : 's'}`;

                if (parseInt(guest[0]) + parseInt(guest[1]) + parseInt(guest[2]) === 0)
                    guestText = '';

                buttonText.guest = guestText.split(',')[0];
                setSearchGuest({ total: guestText, adults: parseInt(guest[0]), children: parseInt(guest[1]), infants: parseInt(guest[2]) });
            }
            else {
                setSearchGuest({ total: '', adults: 0, children: 0, infants: 0 });
            }

            setSearchButtonText(buttonText);
        }
    }, [router.query.location, router.query.checkin, router.query.checkout, router.query.guest]);

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
                    if (item[1].date)
                        fullPath += item[1].year + '-' + item[1].month + '-' + item[1].date;

                    if (item[1].adults)
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

    // update search menu
    const onChangeSearchMenu = (menu) => {
        setSearchMenu(menu);
    };

    // update search submenu
    const onChangeSearchSubmenu = (menu) => {
        setSearchSubmenu(menu);
    };

    return (
        <>
        {(mode === 'primary' && width > 740) && 
            <PrimaryLarge 
                locations={locations} 
                benchmarkOffsetY={benchmarkOffsetY}
                changeRoute={changeRoute} 
                searchMenu={searchMenu}
                onChangeSearchMenu={onChangeSearchMenu}
                searchSubmenu={searchSubmenu}
                onChangeSearchSubmenu={onChangeSearchSubmenu}
            />
        }
        {(mode === 'primary' && width <= 740) && 
            <PrimarySmall 
                locations={locations} 
                changeRoute={changeRoute} 
                searchMenu={searchMenu}
                onChangeSearchMenu={onChangeSearchMenu}
                searchSubmenu={searchSubmenu}
                onChangeSearchSubmenu={onChangeSearchSubmenu}
            />
        }
        {(mode === 'secondary' && width > 740) && 
            <SecondaryLarge 
                locations={locations} 
                changeRoute={changeRoute} 
                searchMenu={searchMenu}
                onChangeSearchMenu={onChangeSearchMenu}
                searchSubmenu={searchSubmenu}
                onChangeSearchSubmenu={onChangeSearchSubmenu}
                searchButtonText={searchButtonText}
                searchLocation={searchLocation}
                searchDateStay={searchDateStay}
                searchDateExperience={searchDateExperience}
                searchGuest={searchGuest}
            />
        }
        {(mode === 'secondary' && width <= 740) && 
            <SecondarySmall 
                locations={locations} 
                changeRoute={changeRoute} 
                searchMenu={searchMenu}
                onChangeSearchMenu={onChangeSearchMenu}
                searchSubmenu={searchSubmenu}
                onChangeSearchSubmenu={onChangeSearchSubmenu}
                searchButtonText={searchButtonText}
                searchLocation={searchLocation}
                searchDateStay={searchDateStay}
                searchDateExperience={searchDateExperience}
                searchGuest={searchGuest}
            />
        }
        </>
    );
}

export default Header;
