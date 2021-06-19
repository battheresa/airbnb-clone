import { useState } from 'react';
import styles from '../../styles/utilities/SearchCard.module.css';

import Carousel from './Carousel';

import StarRateRoundedIcon from '@material-ui/icons/StarRateRounded';

import { formatNumber } from '../../utilities/customService';

function SearchCard({ content }) {
    const { title, intro, gallery, rooms, rating, price, currency } = content;
    const unit = currency === 'THB' ? '฿' : '$';

    return (
        <div className={styles.container}>
            <div className={styles.image}>
                <Carousel content={gallery} />
            </div>

            <div className={styles.detail}>
                <div className={styles.header}>
                    <p><small>{intro}</small></p>
                    <h4><big>{title}</big></h4>

                    <div className={styles.structure}>
                        <p><small>{rooms.guest} guest{rooms.guest > 1 ? 's' : ''}</small></p>
                        <p><small>{rooms.bedroom} bedroom{rooms.bedroom > 1 ? 's' : ''}</small></p>
                        <p><small>{rooms.bed} bed{rooms.bed > 1 ? 's' : ''}</small></p>
                        <p><small>{rooms.bath} bath{rooms.bath > 1 ? 's' : ''}</small></p>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div>
                        <StarRateRoundedIcon style={{ color: 'crimson' }} />
                        <h5>{rating}</h5>
                    </div>
                    <div>
                        <h3><span>{unit}{formatNumber(price)}</span> / night</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchCard;
