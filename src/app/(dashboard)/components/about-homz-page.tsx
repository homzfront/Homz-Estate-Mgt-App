'use client';
import React from 'react';
import ArrowLeft from '@/components/icons/arrowLeft';
import { useRouter } from 'next/navigation';

const EXTERNAL = process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/';

const ABOUT_LINKS = [
    {
        title: 'About Homz',
        description: 'Who we are and what we do',
        href: `${EXTERNAL}about-us`,
    },
    {
        title: 'Terms of Service',
        description: 'Read our terms and conditions',
        href: `${EXTERNAL}terms-and-conditions`,
    },
    {
        title: 'Privacy Policy',
        description: 'How we collect and use your data',
        href: `${EXTERNAL}privacy-policy`,
    },
];

export default function AboutHomzPage() {
    const router = useRouter();

    return (
        <div className='p-8 w-full'>
            <button onClick={() => router.back()} className='mb-6 flex items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                <ArrowLeft /> Back
            </button>

            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>About Homz</h1>
                <p className='text-sm text-GrayHomz mt-0.5'>Learn more about the Homz platform</p>
            </div>

            <div className='bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden max-w-[700px]'>
                {ABOUT_LINKS.map((item, idx) => (
                    <a
                        key={item.title}
                        href={item.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={`flex items-center justify-between px-5 py-4 hover:bg-[#F6F9FF] transition-colors ${idx !== 0 ? 'border-t border-[#F5F5F5]' : ''}`}
                    >
                        <div>
                            <p className='text-[14px] font-medium text-BlackHomz'>{item.title}</p>
                            <p className='text-[12px] text-GrayHomz mt-0.5'>{item.description}</p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className='flex-shrink-0'>
                            <path d="M9 18l6-6-6-6" stroke="#006AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 18l6-6-6-6" stroke="#006AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                ))}
            </div>
        </div>
    );
}