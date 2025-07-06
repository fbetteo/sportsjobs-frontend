'use client';

import { useEffect } from 'react';

const SenjaMarquee = () => {
    useEffect(() => {
        // Add the Senja widget script
        const script = document.createElement('script');
        script.src = 'https://widget.senja.io/widget/0424f2b5-ea48-4d14-9898-446108903f99/platform.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);

        // Cleanup script on unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            className="senja-embed"
            data-id="0424f2b5-ea48-4d14-9898-446108903f99"
            data-mode="shadow"
            data-lazyload="false"
            style={{ display: 'block', width: '100%' }}
        />
    );
};


export default SenjaMarquee;
