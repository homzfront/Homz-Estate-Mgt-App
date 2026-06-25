"use client"
import Link from 'next/link'
import React from 'react'

// Replace these with your actual live App Store / Play Store URLs once published
const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.emirace.homz'

const GetAppBanner = () => {
    return (
        <section id="get-the-app" className='bg-BlueHomz py-12 md:py-16 px-4 md:px-8 scroll-mt-20'>
            <div className='max-w-[1100px] m-auto flex flex-col md:flex-row items-center justify-between gap-8'>
                <div className='flex flex-col gap-3 text-center md:text-left max-w-[520px]'>
                    <h2 className='text-[24px] md:text-[32px] font-[700] text-white leading-tight'>
                        Manage Your Community On the Go
                    </h2>
                    <p className='text-[14px] md:text-[16px] text-white/80'>
                        Get the Homz app to manage residents, billing, and visitor access right from your phone — anytime, anywhere.
                    </p>
                    <div className='flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 mt-4'>
                        <Link
                            href={APP_STORE_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='Download on the App Store'
                        >
                            <img
                                src='/app-store-badge.svg'
                                alt='Download on the App Store'
                                width={160}
                                height={48}
                                className='h-[48px] w-auto'
                            />
                        </Link>
                        <Link
                            href={PLAY_STORE_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='Get it on Google Play'
                        >
                            <img
                                src='/google-play-badge.png'
                                alt='Get it on Google Play'
                                width={160}
                                height={48}
                                className='h-[48px] w-auto'
                            />
                        </Link>
                    </div>
                </div>
                <div className='hidden md:block'>
                    <img
                        src='/Homz_app_preview1.png'
                        alt='Homz Community Management App'
                        width={260}
                        height={520}
                        className='w-[500px] h-auto'
                    />
                </div>
            </div>
        </section>
    )
}

export default GetAppBanner