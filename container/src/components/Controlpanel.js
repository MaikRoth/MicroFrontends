import { mount } from 'controlpanel/ControlpanelApp';
import React, { useRef, useEffect } from 'react';

export default () => {
    const ref = useRef(null);
    useEffect(() => {
        mount(ref.current);
    }, []);

    return <div ref={ref} />;
}


