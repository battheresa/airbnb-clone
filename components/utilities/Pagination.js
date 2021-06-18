import { useState, useEffect } from 'react';
import styles from '../../styles/utilities/Pagination.module.css';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

function Pagination({ curPage, totalPage, changePage }) {
    const [ pages, setPages ] = useState([1, 2, 3]);

    // get page numbers
    useEffect(() => {
        let start = Math.min(Math.max(1, curPage - 2), curPage);
        let end = Math.max(Math.min(totalPage, curPage + 2), curPage);
        setPages(Array.from({ length: end - start + 1 }, (_, i) => i + start));
    }, [curPage, totalPage]);

    return (
        <div className={styles.container}>
            <button onClick={() => changePage(1)} disabled={curPage === 1}><FirstPageIcon /></button>
            <button onClick={() => changePage(curPage - 1)} disabled={curPage === 1}><NavigateBeforeIcon /></button>

            {pages.map(i => (
                <button key={i} onClick={() => changePage(i)} className={i === curPage ? styles.thisPage : ''}>
                    <p>{i}</p>
                </button>
            ))}

            <button onClick={() => changePage(curPage + 1)} disabled={curPage === totalPage}><NavigateNextIcon /></button>
            <button onClick={() => changePage(totalPage)} disabled={curPage === totalPage}><LastPageIcon /></button>
        </div>
    );
}

export default Pagination;
