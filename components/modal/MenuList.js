import RoomIcon from '@material-ui/icons/Room';

import styles from '../../styles/modal/MenuList.module.css';

function MenuList({ open, content, setSelected }) {
    return (
        <div className={styles.container} style={{ display: open ? 'flex' : 'none' }}>
            {content.map(item => (
                <div key={item} className={styles.menu} onClick={() => setSelected(item)}>
                    <span><RoomIcon fontSize='small' /></span>
                    <h4>{item}</h4>
                </div>
            ))}
        </div>
    );
}

export default MenuList;
