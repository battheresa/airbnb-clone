import { useState, useEffect } from 'react';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import styles from '../../styles/modal/Gallery.module.css';
import { shuffle } from '../../utilities/customService';
import { useWindowDimensions } from '../../utilities/customHooks'; 

function Gallery({ content, open, onClose }) {
    const { width, height } = useWindowDimensions();
    const [ gallery, setGallery ] = useState([]);

    // categorise images into portrait and landscape
    const categoriseImages = (images) => {
        const image = new Image();
        let landscape = [];
        let portrait = [];
        
        images.forEach(item => {
            image.src = item;

            if (image.height < image.width) {
                landscape.push(item);
            }
            else {
                portrait.push(item);
            }
        });

        return { portrait: portrait, landscape: landscape };
    };

    // group images 
    const groupImages = (portrait, landscape) => {
        let group = [];
        group.push([landscape[0]]);
        landscape.shift();

        const portraitPairs = Math.floor((portrait.length - 1) / 2);

        for (let i = 0; i < portraitPairs; i++) {
            let pair = portrait.slice(0, 2);
            portrait.splice(0, 2);
            group.push(pair);
        }

        if (portrait.length > 0) {
            let subgroup = [];
            subgroup.push(portrait[0]);
            portrait.splice(0, 1);

            subgroup.push(landscape[0]);
            subgroup.push(landscape[1]);
            landscape.splice(0, 2);

            group.push(subgroup);
        }

        const landscapePair = Math.floor((landscape.length - 1) / 2);

        for (let i = 0; i < landscapePair; i++) {
            let pair = landscape.slice(0, 2);
            landscape.splice(0, 2);
            group.push(pair);
        }

        if (landscape.length > 0) {
            group.push(landscape);
        }

        return group;
    };

    const formatSingle = (key, images) => {
        return [
            <div key={key} className={styles.single}>
                <img className={styles.image} src={images} alt={images} />  
            </div>
        ];
    };

    const formatPair = (key, images) => {
        const image = new Image();
        image.src = images[0];

        const mode = image.height < image.width ? 'landscape' : 'portrait';
        const shift = mode === 'landscape' ? 'balance' : Math.random() >= 0.5 ? 'left' : 'right';

        return [
            <div key={key} className={styles.pair} mode={mode} template={shift}>
                <img className={styles.image} src={images[0]} alt={images[0]} />  
                <img className={styles.image} src={images[1]} alt={images[1]} />  
            </div>
        ];
    };

    const formatGroup = (key, images) => {
        return [
            <div key={key} className={styles.group}>
                <img className={styles.image} src={images[0]} alt={images[0]} />  
                <img className={styles.image} src={images[1]} alt={images[1]} />  
                <img className={styles.image} src={images[2]} alt={images[2]} />  
            </div>
        ];
    };

    const formGallery = (images) => {
        let layout = [];

        images.forEach((item, i) => {
            switch (item.length) {
                case 2:
                    layout.push(formatPair(i, item));
                    break;
                case 3:
                    layout.push(formatGroup(i, item));
                    break;
                default: 
                    layout.push(formatSingle(i, item));
                    break;
            }
        });

        const first = layout[0];
        const rest = shuffle(layout.slice(1));

        return [ first, ...rest ];
    };

    // categorise image
    useEffect(() => {
        if (content.length > 0) {
            const { portrait, landscape } = categoriseImages(content);
            const group = groupImages(portrait, landscape);
            setGallery(formGallery(group));
        }
    }, [content]);

    return (
        <section className={styles.container} style={{ transform: `translateY(${open ? 0 : height}px)` }}>
            <button onClick={() => onClose()}><NavigateBeforeIcon fontSize='large' /></button>

            <div className={styles.layout}>
                {gallery}
            </div>
        </section>
    );
}

export default Gallery;
