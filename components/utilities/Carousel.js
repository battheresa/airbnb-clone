import { useState, useEffect } from 'react';
import styles from '../../styles/utilities/Carousel.module.css';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

function Carousel({ content }) {
    const [ slide, setSlide ] = useState(0);

    // change slide
    const changeSlide = (page) => {
        setSlide(page === content.length ? 0 : page === -1 ? content.length - 1 : page);
    };

    // calculate display of each slide
    const getDisplay = (cur, index) => {
        let display = 'none';

        if (index >= cur - 1 && index <= cur + 1)
            display = 'flex';

        if ((index === 0 && cur === content.length - 1) || (index === content.length - 1 && cur === 0))
            display = 'flex';

        return display;
    }

    // calculate position of each slide
    const getPosition = (cur, index) => {
        let position = (index - cur) * 100;

        if (cur === 0 && index === content.length - 1)
            position = -100;
                    
        if (cur === content.length - 1 && index === 0)
            position = 100;

        return position;
    };
    
    return (
        <div className={styles.container}>
            <button location='left' onClick={() => changeSlide(slide - 1)}><NavigateBeforeIcon /></button>

            {content.map((item, i) => (
                <div key={i} className={styles.slide} style={{ display: getDisplay(slide, i), transform: `translateX(${getPosition(slide, i)}%)` }}>
                    <img className={styles.image} src={item} alt={item} />
                </div>
            ))}

            <button location='right' onClick={() => changeSlide(slide + 1)}><NavigateNextIcon /></button>
        </div>
    );
}

export default Carousel;
