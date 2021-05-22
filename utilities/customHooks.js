import { useState, useEffect } from 'react';

export function useWindowDimensions() {
    const [ dimension, setDimension ] = useState({ width: undefined, height: undefined });
    const windowExist = typeof window !== 'undefined';

    useEffect(() => {
        if (windowExist) {
            function handleResize() {
                setDimension({ width: window.innerWidth, height: window.innerHeight });
            }
        
            window.addEventListener('resize', handleResize);
            handleResize();
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [windowExist]);
    
    return dimension;
}

export function useWindowOffset() {
    const [ offset, setOffset ] = useState({ offsetX: undefined, offsetY: undefined });
    const windowExist = typeof window !== 'undefined';

    useEffect(() => {
        if (windowExist) {
            function handleScroll() {
                setOffset({ offsetX: window.pageXOffset, offsetY: window.pageYOffset });
            }
        
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [windowExist]);
    
    return offset;
}

export function useMousedownTarget() {
    const [ target, setTarget ] = useState('');
    const windowExist = typeof window !== 'undefined';

    useEffect(() => {
        if (windowExist) {
            function handleMousedown(event) {
                setTarget(event.target.id);
            }
        
            window.addEventListener('mousedown', handleMousedown);
            return () => window.removeEventListener('mousedown', handleMousedown);
        }
    }, [windowExist]);
    
    return target;
}
