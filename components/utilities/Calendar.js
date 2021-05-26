import { useState, useEffect } from 'react';

import styles from '../../styles/utilities/Calendar.module.css';

import { useMouseoverTarget } from '../../utilities/customHooks';
import { weekdays, getMonth, formatDate, isSameDate, isSameMonth, isBefore, months } from '../../utilities/customService';

function Calendar({ rows, from, to, date, setDate }) {
    const target = useMouseoverTarget('calendar');

    const today = formatDate(new Date());
    const [ month, setMonth ] = useState(getMonth(new Date(date.year, date.month, 1)));
    const [ calendar, setCalendar ] = useState([]);

    // update month
    useEffect(() => {
        setMonth(getMonth(new Date(date.year, date.month, 1)));
    }, [date]);

    // generate calendar 
    useEffect(() => {
        if (rows) {
            let nCalendar = [];

            let before = new Array(month.startDay).fill(0);
            let dates = Array.from({ length: month.days }, (_, i) => i + 1);
            let after = new Array(Math.max(0, (rows * 7) - month.startDay - month.days)).fill(0);
            let dateList = before.concat(dates).concat(after);

            for (let i = 0; i < dateList.length; i++) {
                let temp = { id: '', index: i, date: dateList[i], month: month.month, monthText: month.monthText, year: month.year, status: dateList[i] };
                
                if (dateList[i] !== 0)
                    temp.id = 'calendar_' + dateList[i] + '_' + month.month;

                if (dateList[i] === 0 && i !== month.startDay - 1 && i !== month.startDay + month.days)
                    temp.status = 'empty';

                if (i === month.startDay - 1)
                    temp.status = -100;

                if (i === month.startDay + month.days)
                    temp.status = 100;
                
                nCalendar.push(temp);
            }

            console.log(rows, nCalendar);
            setCalendar(nCalendar);
        }
    }, [rows, month]);

    // set selected date
    const onSelectDate = (selectedDate) => {
        if (selectedDate.date === 0 || isBefore(selectedDate, today))
            return;

        setDate(formatDate(new Date(selectedDate.year, selectedDate.month, selectedDate.date)));
    };

    // get status of the day
    const getStatus = (statusId) => {
        let hoverExist = target.split('_')[1] !== undefined;
        let hovered = formatDate(new Date(date.year, parseInt(target.split('_')[2]), parseInt(target.split('_')[1])));
        let nSelected = formatDate(new Date(date.year, date.month, statusId));

        if ((statusId === 100 || statusId === -100) && ((from && to && !isSameMonth(from, to)) || (hoverExist && from && !to && isBefore(from, hovered) && !isSameMonth(from, hovered)))) {            
            if (statusId === -100 && from.month < date.month && ((to && date.month <= to.month) || (hoverExist && from && !to && date.month <= hovered.month)))
                return 'gradient gLeft';

            if (statusId === 100 && from.month <= date.month && ((to && date.month < to.month) || (hoverExist && from && !to && date.month < hovered.month)))
                return 'gradient gRight';

            return 'empty';
        }

        if ((from && isBefore(from, nSelected) && to && isBefore(nSelected, to)) || (hoverExist && from && !to && isBefore(from, nSelected) && isBefore(today, nSelected) && isBefore(nSelected, hovered))) {
            if (nSelected.day === 'Sunday')
                return 'between bLeft';

            if (nSelected.day === 'Saturday')
                return 'between bRight';

            return 'between';
        }
        
        if (from && isSameDate(nSelected, from) && to && isSameDate(nSelected, to))
            return 'selected sOne';

        if (from && isSameDate(nSelected, from)) 
            return 'selected sFrom';

        if ((to && isSameDate(nSelected, to) || (hoverExist && from && !to && isSameDate(nSelected, hovered))))
            return 'selected sTo';

        return isBefore(nSelected, today) ? 'before' : 'after';
    };

    return (
        <div className={styles.container}>
            <h4>{date.monthText} {date.year}</h4>
            
            <div id='calendar' className={styles.days}>
                {/* days of the week */}
                {weekdays.map(item => (
                    <h6 key={item}>{item.slice(0, 2)}</h6>
                ))}
                
                {/* calendar content */}
                {calendar.map(item => (
                    <div id={item.id} key={item.index} status={typeof item.status === 'string' ? item.status : getStatus(item.status)} onClick={() => onSelectDate(item)}>
                        <p><small>{item.date !== 0 && item.date}</small></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
