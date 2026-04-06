/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import CustomModal from '@/components/general/customModal';
import ArrowRightSolid from '@/components/icons/arrowRightSolid';
import EstateManagement from '@/components/icons/estateManagement';
import LockIcon from '@/components/icons/lockIcon';
import Resident from '@/components/icons/resident';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useAuthSlice } from '@/store/authStore';
import api from '@/utils/api';
import DotLoader from '@/components/general/dotLoader';

const SelectProfile = () => {
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [navigating, setNavigating] = React.useState<string | null>(null);
    const [profilesLoading, setProfilesLoading] = React.useState(false);
    const { userData, communityProfile, residentProfile, setUserAccountDetails, getCommunityManaProfile } = useAuthSlice();

    const hasCM = !!communityProfile?._id;
    const hasResident = !!residentProfile?._id;
    const hasAccounts = (userData?.accounts?.length ?? 0) > 0;
    const isReturningUser = hasCM || hasResident;

    // If user has accounts but profiles not loaded yet (came from landing page header)
    // Covers: CM owners, invited role members (admin/viewer/security), and residents
    React.useEffect(() => {
        if (!hasAccounts || hasCM || hasResident || profilesLoading) return;

        setProfilesLoading(true);

        // Try loading CM profile first (works for estate owners)
        getCommunityManaProfile()
            .then(() => {
                router.push('/dashboard');
            })
            .catch(() => {
                // getCommunityManaProfile failed — user might be an invited role member
                // (admin/viewer/security) or a resident. Check account types.
                const accounts = userData?.accounts ?? [];
                const accountNames = accounts.map((acc: any) => acc?.name ?? acc?.accountType ?? '');
                const hasCMAccount = accountNames.some((n: string) => n === 'COMMUNITY_MANAGER');
                const hasResidentAccount = accountNames.some((n: string) => n === 'RESIDENT');

                if (hasCMAccount) {
                    // Invited role member — they belong to a CM estate, go to dashboard
                    router.push('/dashboard');
                } else if (hasResidentAccount) {
                    router.push('/resident/dashboard');
                } else {
                    // Unknown — stop loading and show selection cards
                    setProfilesLoading(false);
                }
            });
    }, [hasAccounts, hasCM, hasResident]);

    const data = [
        {
            id: 1,
            text: "Monitor community-wide activities, handle visitor access for residents, & more.",
            header: "Community Manager",
            image: <EstateManagement />,
            imageII: ({ hover }: any) => <EstateManagement className={hover ? "#FF8C00" : "#DC6803"} classNameII={hover ? "#FFFAF0" : "white"} />,
            link: "/estate-form",
            hoverBorderColor: "#DC6803",
            hoverBgColor: "bg-orange-50"
        },
        {
            id: 2,
            text: "As a resident, pay community dues, and request visitor access in one place.",
            header: "Resident",
            image: <Resident />,
            imageII: ({ hover }: any) => <Resident className={hover ? "#df2b1eff" : "#D92D20"} classNameII={hover ? "#FFF5F5" : "white"} />,
            hoverBorderColor: "#D92D20", hoverBgColor: "bg-red-50"
        }
    ];

    // Show loading while fetching profile data
    if (profilesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <CustomModal isOpen={openModal} onRequestClose={() => setOpenModal(false)}>
                <div className={`p-5 rounded-[12px] bg-white flex flex-col justify-center items-center gap-3`}>
                    <LockIcon />
                    <h1 className='text-BlackHomz text-[20px] font-semibold text-center'>An invitation is required to continue</h1>
                    <p className='text-GrayHomz text-[16px] font-normal text-center'>
                        Please notify your community manager to send you an invite link. Once you receive the invite, click the link to resume your onboarding
                    </p>
                </div>
            </CustomModal>
            {/* Header */}
            <div className='w-full bg-gradient-to-r from-BlueHomz2 to-BlueHomzDark py-[60px] px-[24px]'>
                <div className='w-full flex justify-center items-center flex-col gap-2'>
                    <span className='text-[23px] text-center md:text-[36px] font-semibold text-[#FFFFFF]'>
                        {isReturningUser ? 'Which dashboard would you like to enter?' : 'How Would You Like To Use Homz?'}
                    </span>
                    {isReturningUser && (
                        <span className='text-white opacity-80 text-[14px] md:text-[16px] font-normal text-center'>
                            Select the role you'd like to continue as
                        </span>
                    )}
                </div>
            </div>
            {/* Main Content */}
            <div className="max-w-[1240px] mx-auto px-6 py-8 mt-14 w-full">
                <div className="w-full">
                    <div className="mb-8 w-full">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.map((data) => (
                                <div
                                    key={data.id}
                                    onMouseEnter={() => setHoveredCard(data.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className={`w-full flex gap-4 items-center rounded-[8px] p-8 transition-all duration-300 border ${isReturningUser && (
                                            (data.id === 1 && !hasCM) ||
                                            (data.id === 2 && !hasResident)
                                        ) ? 'opacity-40 pointer-events-none' : ''
                                        }`}
                                    style={{
                                        borderColor: hoveredCard === data.id ? data.hoverBorderColor : 'transparent',
                                        borderWidth: hoveredCard === data.id ? '2px' : '1px',
                                        backgroundColor: hoveredCard === data.id ? (data.hoverBgColor || 'inherit') : 'inherit'
                                    }}
                                >
                                    <div>
                                        <div className="group relative">
                                            {data ? (
                                                <div className="group-hover:hidden">
                                                    {data.image}
                                                </div>
                                            ) : null}
                                            {data.imageII && (
                                                <div className="hidden group-hover:block">
                                                    {data.imageII({ hover: true })}
                                                </div>
                                            )}
                                        </div>
                                        <h1 className='mt-4 text-BlackHomz font-semibold text-[20px]'>{data.header}</h1>
                                        <p className='mt-1 text-[#4E4E4E] font-normal text-[16px]'>{data.text}</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (isReturningUser) {
                                                // Returning user — route to existing dashboard
                                                if (data.id === 1 && hasCM) {
                                                    setNavigating('cm');
                                                    try {
                                                        const cmProfile = await api.get("/community-manager/current-profile");
                                                        setUserAccountDetails(cmProfile?.data?.data);
                                                    } catch { /* continue */ }
                                                    router.push("/dashboard");
                                                } else if (data.id === 2 && hasResident) {
                                                    setNavigating('resident');
                                                    router.push("/resident/dashboard");
                                                }
                                            } else {
                                                // First time user — go through setup
                                                if (data.link) {
                                                    router.push(data.link);
                                                } else {
                                                    setOpenModal(true);
                                                }
                                            }
                                        }}
                                        className='cursor-pointer'
                                        disabled={navigating !== null}
                                    >
                                        {navigating === (data.id === 1 ? 'cm' : 'resident')
                                            ? <DotLoader />
                                            : <ArrowRightSolid />
                                        }
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectProfile