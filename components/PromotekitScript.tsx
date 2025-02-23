'use client'

import Script from 'next/script'

export default function PromotekitScript() {
    const handleLoad = () => {
        console.log('Promotekit script loaded')
        console.log('Referral ID:', (window as any).promotekit_referral)
    }

    return (
        <Script
            src="https://cdn.promotekit.com/promotekit.js"
            data-promotekit="7247f082-1ade-46c5-8f50-8a0c1edba365"
            strategy="lazyOnload"
            onLoad={handleLoad}
        />
    )
}