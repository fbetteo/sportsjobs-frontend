'use client';

import { useEffect } from 'react';

const SenjaRecruiterWidget = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://widget.senja.io/widget/56a25424-4d00-49fd-9a10-f2a5c5a9b0ee/platform.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            className="senja-embed"
            data-id="56a25424-4d00-49fd-9a10-f2a5c5a9b0ee"
            data-mode="shadow"
            data-lazyload="false"
            style={{ display: 'block' }}
        />
    );
};

export default SenjaRecruiterWidget;
