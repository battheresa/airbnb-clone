import { useState, useEffect } from 'react';

import PrimaryLarge from './primary/Large';
import PrimarySmall from './primary/Small';
import SecondaryLarge from './secondary/Large';
import SecondarySmall from './secondary/Small';

import { useWindowDimensions } from '../../utilities/customHooks'; 

function Header({ mode }) {
    const { width, height } = useWindowDimensions();
    const [ code, setCode ] = useState('LP');

    useEffect(() => {
        let nCode = mode === 'primary' ? 'P' : 'S';
        nCode += width > 740 ? 'L' : 'S';
        setCode(nCode);
    }, [width]);

    return (
        <>
        {code === 'PL' && <PrimaryLarge />}
        {code === 'PS' && <PrimarySmall />}
        {code === 'SL' && <SecondaryLarge />}
        {code === 'SS' && <SecondarySmall />}
        </>
    );
}

export default Header;
