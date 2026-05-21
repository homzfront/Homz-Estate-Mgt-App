'use client';
import React from 'react';
import Link from 'next/link';

interface SettingsRowProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href?: string;
    onClick?: () => void;
    external?: boolean;
    danger?: boolean;
}

export function SettingsRow({ icon, title, description, href, onClick, external, danger }: SettingsRowProps) {
    const content = (
        <div className={`flex items-center gap-4 px-5 py-4 w-full text-left hover:bg-[#F6F9FF] transition-colors border-b border-[#F5F5F5] last:border-b-0 ${danger ? 'hover:bg-red-50' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-[#EEF5FF]'}`}>
                {icon}
            </div>
            <div className='flex-1 min-w-0'>
                <p className={`text-[14px] font-medium ${danger ? 'text-red-500' : 'text-BlackHomz'}`}>{title}</p>
                {description && <p className='text-[12px] text-GrayHomz mt-0.5'>{description}</p>}
            </div>
            {!danger && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className='flex-shrink-0'>
                    <path d="M9 18l6-6-6-6" stroke="#006AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 18l6-6-6-6" stroke="#006AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
    );

    if (href && external) return <a href={href} target='_blank' rel='noopener noreferrer' className='block'>{content}</a>;
    if (href) return <Link href={href} className='block'>{content}</Link>;
    return <button onClick={onClick} className='w-full'>{content}</button>;
}

interface SettingsSectionProps {
    children: React.ReactNode;
}

export function SettingsSection({ children }: SettingsSectionProps) {
    return (
        <div className='bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden'>
            {children}
        </div>
    );
}