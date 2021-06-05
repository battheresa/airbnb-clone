export const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];

export function getMonth(date) {
    let month = {};

    month.month = date.getMonth();
    month.monthText = months[date.getMonth()];
    month.year = date.getFullYear();

    month.days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    month.startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    month.rows = Math.ceil((month.days + month.startDay) / 7);

    return month;
}

export function formatDate(date) {
    let today = {};

    today.date = date.getDate();
    today.day = weekdays[date.getDay()];
    today.month = date.getMonth();
    today.monthText = months[date.getMonth()];
    today.year = date.getFullYear();

    return today;
}

export function isSameDate(date1, date2) {
    return date1.date === date2.date && date1.month === date2.month && date1.year === date2.year;
}

export function isSameMonth(date1, date2) {
    return date1.month === date2.month;
}

export function isBefore(date1, date2) {
    let nDate1 = new Date(date1.year, date1.month, date1.date);
    let nDate2 = new Date(date2.year, date2.month, date2.date);
    
    return nDate1 < nDate2;
}

export function shuffle(list) {
    return list.sort(() => Math.random() - 0.5);;
}