import { useState, useEffect } from 'react';

import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';

import Calendar from '../utilities/Calendar';

import styles from '../../styles/modal/DateInput.module.css';

import { deviceBreakpoint } from '../../utilities/config';
import { useWindowDimensions } from '../../utilities/customHooks';
import { getMonth, formatDate, isBefore } from '../../utilities/customService';

function DateInput({ open, inline, mode, submenu, date, setDate }) {
    const { width, height } = useWindowDimensions();
    const [ secondCalendar, setSecondCalendar ] = useState(true);
    
    const [ from, setFrom ] = useState(date.from);
    const [ to, setTo ] = useState(date.to);
    
    const [ month1, setMonth1 ] = useState(date.from || formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
    const [ month2, setMonth2 ] = useState(date.to || formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)));

    const [ rows, setRows ] = useState();
    const [ step, setStep ] = useState(0);

    // calculate calendar rows
    useEffect(() => {
        let fromRows = getMonth(new Date(month1.year, month1.month, 1)).rows;
        let toRows = getMonth(new Date(month2.year, month2.year, 1)).rows;
        setRows(Math.max(fromRows, toRows));
    }, []);

    // toggle between single and double calendar
    useEffect(() => {
        if (width && width < deviceBreakpoint.medium - 60) {
            setSecondCalendar(false);
        }
        else {
            setSecondCalendar(true);
        }
    }, [width]);

    // update selected dates
    const setSelectedDate = (selectedDate) => {
        if (step === 0 || submenu === 1 || isBefore(selectedDate, from)) {
            setDate('from', selectedDate);
            setFrom(selectedDate);
            setTo(submenu === 1 ? to && isBefore(selectedDate, to) ? to : undefined : undefined);
            setStep(1);
            return;
        }

        setDate('to', selectedDate);
        setTo(selectedDate);
        setStep(mode ? step : 0);
    };

    // move calendar to left or right
    const moveCalendar = (direction) => {
        let nMonth1 = formatDate(new Date(month1.year, month1.month + direction, 1));
        let nMonth2 = formatDate(new Date(month2.year, month2.month + direction, 1));
        
        let fromRows = getMonth(new Date(nMonth1.year, nMonth1.month, 1)).rows;
        let toRows = getMonth(new Date(nMonth2.year, nMonth2.month, 1)).rows;

        setMonth1(nMonth1);
        setMonth2(nMonth2);
        setRows(Math.max(fromRows, toRows));
    };

    return (
        <div className={styles.container} style={{ display: open ? 'flex' : 'none' }} mode={inline ? 'inline' : 'modal'}>
            <div className={styles.arrows} position={inline ? 'inlineLeft' : 'modalLeft'} onClick={() => moveCalendar(-1)}><ChevronLeftRoundedIcon /></div>

            <div className={styles.calendars}>
                <div><Calendar rows={rows} from={from} to={to} date={month1} setDate={setSelectedDate} /></div>
                <div style={{ display: secondCalendar ? 'block' : 'none' }}><Calendar rows={rows} from={from} to={to} date={month2} setDate={setSelectedDate} /></div>
            </div>

            <div className={styles.arrows} position={inline ? 'inlineRight' : 'modalRight'} onClick={() => moveCalendar(1)}><ChevronRightRoundedIcon /></div>
        </div>
    );
}

export default DateInput;
