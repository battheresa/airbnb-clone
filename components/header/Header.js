import { useState, useEffect } from 'react';

import PrimaryLarge from './primary/Large';
import PrimarySmall from './primary/Small';
import SecondaryLarge from './secondary/Large';
import SecondarySmall from './secondary/Small';

import { useWindowDimensions } from '../../utilities/customHooks'; 

function Header({ mode }) {
    const { width, height } = useWindowDimensions();

    return (
        <>
        {(mode === 'primary' && width > 740) && <PrimaryLarge />}
        {(mode === 'primary' && width <= 740) && <PrimarySmall />}
        {(mode === 'secondary' && width > 740) && <SecondaryLarge />}
        {(mode === 'secondary' && width <= 740) && <SecondarySmall />}
        </>
    );
}

export default Header;
