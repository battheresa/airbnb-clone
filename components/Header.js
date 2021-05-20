import { useState, useEffect } from 'react';

import styles from '../styles/Header.module.css';

// black: https://firebasestorage.googleapis.com/v0/b/airbnb-clone-9ccdf.appspot.com/o/airbnb-logo-black.png?alt=media&token=0886b441-ccda-451b-b158-ff29ce252559
// white: https://firebasestorage.googleapis.com/v0/b/airbnb-clone-9ccdf.appspot.com/o/airbnb-logo-white.png?alt=media&token=8cfc2537-f96f-43b6-8fda-afd44b116429

function Header() {
    const [ logo, setLogo ] = useState('https://firebasestorage.googleapis.com/v0/b/airbnb-clone-9ccdf.appspot.com/o/airbnb-logo-white.png?alt=media&token=8cfc2537-f96f-43b6-8fda-afd44b116429');

    return (
        <div className={styles.container}>
            <div className={styles.upper}>
                <img className={styles.logo} src={logo} alt='airbnb-logo' />
            </div>

            {/* <div className={styles.lower}>
                <h1>bottom</h1>
            </div> */}
        </div>
    );
}

export default Header;
