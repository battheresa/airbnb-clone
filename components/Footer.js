import styles from '../styles/Footer.module.css';

import { footerNavigation } from '../utilities/database.js';

function Footer() {
    return (
        <div className={styles.container}>
            <div className={styles.navigation}>
                {footerNavigation.map(section => (
                    <div key={section.header} className={styles.section}>
                        <h6>{section.header.toUpperCase()}</h6>
                        {section.content.map(item => (
                            <p key={item.text}>{item.text}</p>
                        ))}
                    </div>
                ))}
            </div>

            <div className='flexRow'>
                {/* copy rights */}
                <div className={styles.credit}>
                    <p>&copy; 2021 Airbnb Clone Project. No rights reserved.</p>
                </div>

                {/* language and currency */}
                <div className={styles.group}>
                    <button className={styles.button}>
                        {/* <LanguageRoundedIcon fontSize='small' /> */}
                        <h5>English (US)</h5>
                    </button>

                    <button className={styles.button}>
                        {/* <AttachMoneyRoundedIcon fontSize='small' /> */}
                        <h5>HKD</h5>
                    </button>
                </div>

                {/* social links */}
                <div className={styles.group}>
                    {/* <FacebookIcon className='footer__icon' />
                    <TwitterIcon className='footer__icon' />
                    <InstagramIcon className='footer__icon' /> */}
                </div>
            </div>
        </div>
    );
}

export default Footer;
