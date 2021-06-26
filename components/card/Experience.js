import { useState, useEffect } from 'react';

import styles from '../../styles/card/Experience.module.css';
import StarRateRoundedIcon from '@material-ui/icons/StarRateRounded';

import { formatNumber } from '../../utilities/customService';

function Experience({ content, setSelected }) {
    const { title, gallery, rating, price, currency } = content;
    const unit = currency === 'THB' ? '฿' : '$';

    const [ play, setPlay ] = useState(false);
    const [ reset, setReset ] = useState(false);

    const [ slide, setSlide ] = useState(0);
    const [ size, setSize ] = useState(100);
    const [ offset, setOffset ] = useState(0);
    const [ transition, setTransition ] = useState(0);

    // change slide and reset animation
    useEffect(() => {
        if (play) {
            const interval = setInterval(() => {
                setSlide(slide + 1 >= gallery.length ? 0 : slide + 1);
                setSize(100);
                setOffset(0);
                setTransition(0);
                setReset(true);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [slide]);

    // play animation
    useEffect(() => {
        if (play && reset) {
            const interval = setInterval(() => {
                setSize(110);
                setOffset(5);
                setTransition(3);
                setReset(false);
            }, 100);

            return () => clearInterval(interval);
        }
    }, [reset]);

    // initialize animation
    useEffect(() => {
        if (play) {
            setSlide(slide + 1);
            setSize(110);
            setOffset(5);
            setTransition(3);
        }
        else {
            setSlide(0);
            setSize(100);
            setOffset(0);
            setTransition(0);
        }
    }, [play]);
    
    return (
        <div className={styles.container} onClick={() => setSelected(gallery)} onMouseEnter={() => setPlay(true)} onMouseLeave={() => setPlay(false)}>
            <div className={styles.image}>
                <img src={gallery[slide]} style={{ marginTop: `-${offset}%`, marginLeft: `-${offset}%`,  width: `${size}%`, height: `${size}%`, transition: `${transition}s` }} />
            </div>

            <div className={styles.rating}>
                <StarRateRoundedIcon style={{ color: 'crimson' }} />
                <h5>{rating}</h5>
            </div>

            <h4>{title}</h4>
            <h4><strong>From {unit} {formatNumber(price)}</strong> / person</h4>
        </div>
    );
}

export default Experience;
