'use client';

import { useEffect } from 'react';
declare global {
    interface Window {
        iFrameResize: any;
    }
}



const SenjaWallOfLove = () => {
    useEffect(() => {
        // Add the iframe resizing script
        const script = document.createElement('script');
        script.src = 'https://widget.senja.io/js/iframeResizer.min.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);

        // Ensure that iFrameResize is called after the script is loaded
        script.onload = () => {
            // Wait until the iFrameResize function is available
            if (window.iFrameResize) {
                window.iFrameResize({ log: false, checkOrigin: false }, '#wall-of-love-rEu5Dj');
            } else {
                console.error('iFrameResize is not available');
            }
        };

        // Cleanup script on unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <iframe
            id="wall-of-love-rEu5Dj"
            src="https://senja.io/p/sportsjobs-online/rEu5Dj?hideNavigation=true&embed=true"
            title="Wall of Love"
            frameBorder="0"
            scrolling="no"
            width="100%"
            style={{ border: '0', minHeight: '800px' }} // Adjust height as needed
        ></iframe>
    );
};


export default SenjaWallOfLove;
