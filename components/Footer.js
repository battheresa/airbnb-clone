import styles from '../styles/Footer.module.css';

import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';

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
                        <LanguageRoundedIcon fontSize='small' style={{ marginRight: '6px' }} />
                        <h5>English (US)</h5>
                    </button>

                    <button className={styles.button}>
                        <AttachMoneyRoundedIcon fontSize='small' style={{ marginRight: '2px' }} />
                        <h5>HKD</h5>
                    </button>
                </div>

                {/* social links */}
                <div className={styles.group}>
                    <FacebookIcon className={styles.button} />
                    <TwitterIcon className={styles.button} />
                    <InstagramIcon className={styles.button} />
                </div>
            </div>
        </div>
    );
}

export default Footer;
