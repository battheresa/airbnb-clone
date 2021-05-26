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
    const [ offset, setOffset ] = useState({ offsetX: 0, offsetY: 0 });
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

export function useMouseoverTarget(targetId) {
    const [ target, setTarget ] = useState('');
    const windowExist = typeof window !== 'undefined';

    useEffect(() => {
        if (windowExist) {
            function handleMouseover(event) {
                if (event.target.id.split('_')[0] === targetId) {
                    setTarget(event.target.id);
                }
            }
        
            window.addEventListener('mouseover', handleMouseover);
            return () => window.removeEventListener('mouseover', handleMouseover);
        }
    }, [windowExist]);
    
    return target;
}