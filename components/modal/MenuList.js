import RoomIcon from '@material-ui/icons/Room';

import styles from '../../styles/modal/MenuList.module.css';

function MenuList({ open, mode, content, type, setSelected }) {
    return (
        <div className={styles.container} style={{ display: open ? 'flex' : 'none' }} mode={mode}>
            {type === 'locations' && content.map(item => (
                <div key={item} className={styles.menu} type='locations' onClick={() => setSelected(item)}>
                    <span><RoomIcon fontSize='small' /></span>
                    <h4>{item}</h4>
                </div>
            ))}

            {type === 'options' && content.map((item, i) => (
                <div key={item.menu} className={styles.menu} type='options' onClick={(e) => setSelected(e, i)}>
                    <div className={styles.image}>
                        <img src={item.image} />
                    </div>
                    <div>
                        <h4>{item.menu}</h4>
                        <p><small>{item.submenu}</small></p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MenuList;
