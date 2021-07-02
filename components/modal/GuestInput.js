import { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import styles from '../../styles/modal/GuestInput.module.css';

function GuestInput({ open, inline, guest, setGuest }) {
    const [ adults, setAdults ] = useState(guest.adults);
    const [ children, setChildren ] = useState(guest.children);
    const [ infants, setInfants ] = useState(guest.infants);

    // add guest
    const addGuest = (group) => {
        let nAdults = adults;
        let nChildren = children;
        let nInfants = infants;

        if ((group === 'children' || group === 'infants') && adults === 0)
            nAdults = 1;

        if (group === 'adults')
            nAdults += 1;

        if (group === 'children')
            nChildren += 1;

        if (group === 'infants')
            nInfants += 1;

        let nTotal = `${nAdults + nChildren} guest${nAdults + nChildren <= 1 ? '' : 's'}`;
        if (nInfants > 0)
            nTotal += `, ${nInfants} infant${nInfants <= 1 ? '' : 's'}`;

        if (nAdults + nChildren + nInfants === 0)
            nTotal = '';

        setAdults(nAdults);
        setChildren(nChildren);
        setInfants(nInfants);
        setGuest({ total: nTotal, adults: nAdults, children: nChildren, infants: nInfants });
    };

    // remove guest
    const removeGuest = (group) => {
        if (group === 'adults' && adults === 1 && (children !== 0 || infants !== 0))
            return;

        let nAdults = adults;
        let nChildren = children;
        let nInfants = infants;

        if (group === 'adults' && nAdults >= 1)
            nAdults -= 1;

        if (group === 'children' && nChildren >= 1)
            nChildren -= 1;

        if (group === 'infants' && nInfants >= 1)
            nInfants -= 1;

        let nTotal = `${nAdults + nChildren} guest`;
        if (nInfants > 0)
            nTotal += `, ${nInfants} infant${nInfants === 1 ? '' : 's'}`;

        if (nAdults + nChildren + nInfants === 0)
            nTotal = '';
        
        setAdults(nAdults);
        setChildren(nChildren);
        setInfants(nInfants);
        setGuest({ total: nTotal, adults: nAdults, children: nChildren, infants: nInfants });
    };

    return (
        <div className={styles.container} style={{ display: open ? 'flex' : 'none' }} mode={inline ? 'inline' : 'modal'}>
            <div className={styles.group}>
                <div className={styles.text}>
                    <h4>Adults</h4>
                    <p><small>Age 13 or above</small></p>
                </div>
                <div className={styles.toggle}>
                    <div onClick={() => removeGuest('adults')} status={adults === 0 ? 'disabled' : 'enabled'}><RemoveIcon fontSize='small' /></div>
                    <p>{adults}</p>
                    <div onClick={() => addGuest('adults')} status='enabled'><AddIcon fontSize='small' /></div>
                </div>
            </div>

            <div className={styles.group}>
                <div className={styles.text}>
                    <h4>Children</h4>
                    <p><small>Age 2-12</small></p>
                </div>
                <div className={styles.toggle}>
                    <div onClick={() => removeGuest('children')} status={children === 0 ? 'disabled' : 'enabled'}><RemoveIcon fontSize='small' /></div>
                    <p>{children}</p>
                    <div onClick={() => addGuest('children')} status='enabled'><AddIcon fontSize='small' /></div>
                </div>
            </div>

            <div className={styles.group}>
                <div className={styles.text}>
                    <h4>Infants</h4>
                    <p><small>Under 2</small></p>
                </div>
                <div className={styles.toggle}>
                    <div onClick={() => removeGuest('infants')} status={infants === 0 ? 'disabled' : 'enabled'}><RemoveIcon fontSize='small' /></div>
                    <p>{infants}</p>
                    <div onClick={() => addGuest('infants')} status='enabled'><AddIcon fontSize='small' /></div>
                </div>
            </div>
        </div>
    );
}

export default GuestInput;
