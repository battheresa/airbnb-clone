import styles from '../styles/Footer.module.css';

import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';

import { navingations } from '../utilities/config.js';

function Footer() {
    return (
        <div className={styles.container}>
            <div className={styles.navigation}>
                {navingations.map(section => (
                    <div key={section.header} className={styles.section}>
                        <h6>{section.header.toUpperCase()}</h6>
                        <div>
                            {section.content.map(item => (
                                <p key={item.text}>{item.text}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.information}>
                {/* copy rights */}
                <div className={styles.credit} name='before'>
                    <p>&copy; 2021 Airbnb Clone Project.</p>
                </div>

                {/* language and currency */}
                <div className={styles.group}>
                    <div className={styles.button}>
                        <LanguageRoundedIcon fontSize='small' style={{ marginRight: '6px' }} />
                        <h5>English (US)</h5>
                    </div>

                    <div className={styles.button}>
                        <AttachMoneyRoundedIcon fontSize='small' style={{ marginRight: '2px' }} />
                        <h5>THB</h5>
                    </div>
                </div>

                {/* social links */}
                <div className={styles.group} name='icon'>
                    <FacebookIcon className={styles.icon} />
                    <TwitterIcon className={styles.icon} />
                    <InstagramIcon className={styles.icon} />
                </div>

                {/* copy rights */}
                <div className={styles.credit} name='after'>
                    <p>&copy; 2021 Airbnb Clone Project.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
