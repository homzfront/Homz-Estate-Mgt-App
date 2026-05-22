/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Pagination from '@/app/(dashboard)/components/pagination';
import useClickOutside from '@/app/utils/useClickOutside';
import CustomModal from '@/components/general/customModal';
import DotLoader from '@/components/general/dotLoader';
import AddRound from '@/components/icons/addRound';
import ApproveIcon from '@/components/icons/approveIcon';
import ArrowDown from '@/components/icons/arrowDown';
import Close from '@/components/icons/Close';
import DeclineIcon from '@/components/icons/declineIcon';
import ExportIcon from '@/components/icons/estateManager&Resident/desktop/exportIcon';
import Eye from '@/components/icons/Eye';
import MinusRound from '@/components/icons/minusRound';
import Ticked from '@/components/icons/ticked';
import UnTicked from '@/components/icons/unTicked';
import UserAdd from '@/components/icons/userAdd';
import { ResidentData, useRequestSlice } from '@/store/useRequestStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import api from '@/utils/api';
import Image from 'next/image';
import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';
import EmptyEstateState from '../../components/emptyEstateState';

const TABS = [
    { label: 'Pending',  value: 'pending'   },
    { label: 'Approved', value: 'accepted'  },
    { label: 'Declined', value: 'rejected'  },
];

const Request = () => {
    const router = useRouter();
    const ability = useAbility();

    React.useEffect(() => {
        if (!ability.can('read', 'residents')) {
            router.push('/dashboard');
        }
    }, [ability, router]);

    const { requestResponse, isLoading, getRequest } = useRequestSlice();

    // FIX: removed clearRequest() on mount — that was wiping data on every navigation
    // FIX: hasFetched tracks whether we have done at least one fetch for the current tab
    const [hasFetched, setHasFetched] = React.useState(false);

    const [selectedRows, setSelectedRows]     = React.useState<string[]>([]);
    const [selectAll, setSelectAll]           = React.useState(false);
    const [popUpMenu, setPopUpMenu]           = React.useState(false);
    const [selectedId, setSelectedId]         = React.useState<string | null>(null);
    const [pageNo, setPageNo]                 = React.useState<number>(1);
    const pageSize                            = 6;
    const menuRef                             = useRef<HTMLElement>(null);
    const [modelOpen, setModelOpen]           = React.useState('');
    const [selectedData, setSelectedData]     = React.useState<null | ResidentData>(null);
    const [isRequesting, setIsRequesting]     = React.useState<boolean>(false);
    const [detailsOpen, setDetailsOpen]       = React.useState(false);
    const [search, setSearch]                 = React.useState<string>('');
    const [activeStatus, setActiveStatus]     = React.useState<string>('pending');
    const [actionsMenuOpen, setActionsMenuOpen] = React.useState(false);
    const searchTimeoutRef                    = useRef<NodeJS.Timeout | null>(null);
    const actionsMenuRef                      = useRef<HTMLDivElement>(null);
    const [isSearching, setIsSearching]       = React.useState(false);
    const [menuPortalStyle, setMenuPortalStyle] = React.useState<React.CSSProperties | null>(null);
    const actionButtonRefs                    = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    useClickOutside(actionsMenuRef as any, () => setActionsMenuOpen(false));

    // ── Portal dropdown positioning ─────────────────────────────────────────
    React.useEffect(() => {
        if (!popUpMenu || !selectedId || !actionButtonRefs.current[selectedId]) {
            setMenuPortalStyle(null);
            return;
        }
        const updatePos = () => {
            const btn = actionButtonRefs.current[selectedId];
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            setMenuPortalStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                left: rect.right - 180,
                zIndex: 99999,
            });
        };
        updatePos();
        window.addEventListener('scroll', updatePos, true);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [popUpMenu, selectedId]);

    useClickOutside(menuRef as any, () => setPopUpMenu(false));

    // ── Debounced search ─────────────────────────────────────────────────────
    // FIX: pass search as 4th param (search), not 3rd (status)
    const debouncedSearch = useCallback((searchValue: string) => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(() => {
            getRequest(pageNo, pageSize, activeStatus, searchValue).finally(() => setIsSearching(false));
        }, 600);
    }, [pageNo, pageSize, activeStatus, getRequest]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    React.useEffect(() => {
        return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
    }, []);

    // ── Main fetch: runs when page, estate, or tab changes ──────────────────
    // FIX: reset hasFetched when tab changes so loading state shows correctly
    // FIX: also reset selected rows when switching tabs
    React.useEffect(() => {
        setHasFetched(false);
        setSelectedRows([]);
        setSelectAll(false);
        setSearch('');
        if (selectedCommunity?.estate?._id) {
            getRequest(pageNo, pageSize, activeStatus)
                .finally(() => setHasFetched(true));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNo, selectedCommunity, activeStatus]);

    // ── Selection ────────────────────────────────────────────────────────────
    const handleSelectAll = () => {
        if (!requestResponse) return;
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(requestResponse.results.map(r => r._id));
        }
        setSelectAll(!selectAll);
    };

    const handleRowSelect = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleToggleMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setSelectedId(id);
        setPopUpMenu(prev => !prev);
    };

    // ── Approve ──────────────────────────────────────────────────────────────
    const handleApprove = async () => {
        if (!selectedData) return;
        setIsRequesting(true);
        try {
            await api.post(
                `/resident-invitation/residents/${selectedData._id}/accept/tokens/${selectedData.invitationToken}`,
                {
                    validationIds: {
                        estateId: selectedData.associatedIds?.estateId,
                        organizationId: selectedData.associatedIds?.organizationId,
                    },
                }
            );
            toast.success('Invitation approved');
            setModelOpen('');
            setPopUpMenu(false);
            // FIX: just refresh current tab — don't change tab after approve
            // The approved request will disappear from "pending" and appear in "accepted"
            // User can switch to "Approved" tab themselves to verify
            getRequest(pageNo, pageSize, activeStatus).finally(() => setHasFetched(true));
        } catch (error: any) {
            const msg = error?.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : (msg || error?.message || 'Failed to approve'), {
                position: 'top-center',
            });
        } finally {
            setIsRequesting(false);
        }
    };

    // ── Decline ──────────────────────────────────────────────────────────────
    const handleDecline = async () => {
        if (!selectedData) return;
        setIsRequesting(true);
        try {
            await api.post(
                `/resident-invitation/residents/${selectedData._id}/reject/tokens/${selectedData.invitationToken}`,
                {
                    validationIds: {
                        estateId: selectedData.associatedIds?.estateId,
                        organizationId: selectedData.associatedIds?.organizationId,
                    },
                }
            );
            toast.success('Invitation declined');
            setModelOpen('');
            setPopUpMenu(false);
            // FIX: refresh current tab, don't force-switch tabs
            getRequest(pageNo, pageSize, activeStatus).finally(() => setHasFetched(true));
        } catch (error: any) {
            const msg = error?.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : (msg || error?.message || 'Failed to decline'), {
                position: 'top-center',
            });
        } finally {
            setIsRequesting(false);
        }
    };

    // ── Bulk actions ─────────────────────────────────────────────────────────
    const handleBulkAction = async (type: 'approve' | 'decline') => {
        if (!selectedRows.length) {
            toast.error('No requests selected');
            return;
        }
        setIsRequesting(true);
        for (const id of selectedRows) {
            const data = requestResponse?.results.find(r => r._id === id);
            if (!data) continue;
            try {
                const payload = {
                    validationIds: {
                        estateId: data.associatedIds?.estateId,
                        organizationId: data.associatedIds?.organizationId,
                    },
                };
                if (type === 'approve') {
                    await api.post(`/resident-invitation/residents/${data._id}/accept/tokens/${data.invitationToken}`, payload);
                    toast.success(`Approved ${data.firstName} ${data.lastName}`);
                } else {
                    await api.post(`/resident-invitation/residents/${data._id}/reject/tokens/${data.invitationToken}`, payload);
                    toast.success(`Declined ${data.firstName} ${data.lastName}`);
                }
            } catch (error: any) {
                const msg = error?.response?.data?.message;
                toast.error(Array.isArray(msg) ? msg[0] : (msg || error?.message || 'An error occurred'));
            }
        }
        setIsRequesting(false);
        setActionsMenuOpen(false);
        setSelectedRows([]);
        setSelectAll(false);
        // Refresh current tab
        getRequest(pageNo, pageSize, activeStatus).finally(() => setHasFetched(true));
    };

    // ── Pagination ────────────────────────────────────────────────────────────
    const handlePageClick = (page: number) => setPageNo(page);
    const handleNext = () => {
        if (requestResponse && pageNo < requestResponse.totalPages) setPageNo(pageNo + 1);
    };
    const handlePrev = () => {
        if (pageNo > 1) setPageNo(pageNo - 1);
    };

    // FIX: tab switch resets page to 1
    const handleTabChange = (value: string) => {
        setActiveStatus(value);
        setPageNo(1);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    const hasResults = !!(requestResponse?.results && requestResponse.results.length > 0);

    return (
        <div className='p-4 md:p-8'>
            {/* Confirm modal */}
            <CustomModal isOpen={modelOpen !== ''} onRequestClose={() => setModelOpen('')}>
                <div className='p-6 min-w-[340px] w-full md:w-[600px] bg-white rounded-[12px]'>
                    <div className='flex flex-col gap-6 items-center justify-center'>
                        <Image
                            src={modelOpen === 'approve' ? '/success_icon.svg' : '/decline.png'}
                            height={48}
                            width={46}
                            alt=''
                        />
                        <div className='flex flex-col'>
                            <p className='text-[14px] md:text-[20px] font-[700] leading-[17.64px] md:leading-[25.2px] text-center mb-1'>
                                {modelOpen === 'approve' ? 'Approve Request?' : 'Decline Request?'}
                            </p>
                            <p className='leading-[19.5px] text-[13px] md:text-[16px] font-[400] md:leading-[24px] text-center'>
                                {modelOpen === 'approve'
                                    ? `Are you sure you want to approve this request? ${selectedData?.firstName} will be added as a resident to ${selectedData?.estateName}.`
                                    : 'This action will notify the resident that their request was declined.'}
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center mt-4 gap-4'>
                        <button
                            className={`flex-1 ${modelOpen === 'approve' ? 'bg-BlueHomz' : 'bg-error'} text-white rounded-[4px] h-[48px] p-[12px] ${isRequesting ? 'pointer-events-none flex justify-center items-center' : ''}`}
                            onClick={() => {
                                if (modelOpen === 'approve' && selectedData) handleApprove();
                                if (modelOpen === 'decline' && selectedData) handleDecline();
                            }}
                        >
                            {isRequesting ? <DotLoader /> : modelOpen === 'approve' ? 'Yes, Approve' : 'Decline Request'}
                        </button>
                        <button
                            disabled={isRequesting}
                            className='flex-1 text-BlackHomz border border-BlackHomz rounded-[4px] font-normal text-sm hover:text-GrayHomz cursor-pointer h-[48px]'
                            onClick={() => setModelOpen('')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </CustomModal>

            {/* No estate selected */}
            {!selectedCommunity ? (
                <div>
                    <h1 className='text-BlackHomz font-medium text-[16px] md:text-[20px] mb-6'>Join Requests</h1>
                    <EmptyEstateState />
                </div>
            ) : (
                <div>
                    {/* Header */}
                    <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-4'>
                        <div>
                            <h1 className='text-BlackHomz font-medium text-[16px] md:text-[20px]'>Join Requests</h1>
                            <h3 className='mt-1 text-GrayHomz font-normal text-sm md:text-[14px] max-w-[500px]'>
                                {activeStatus === 'accepted'
                                    ? 'Residents whose join requests have been approved.'
                                    : activeStatus === 'rejected'
                                    ? 'Join requests that were declined.'
                                    : 'View and manage pending requests from residents who want to join the estate.'}
                            </h3>
                        </div>

                        {/* Search + Actions */}
                        <div className='flex gap-2 mt-3 md:mt-0 md:justify-end md:items-center relative'>
                            {/* Search */}
                            <div className='flex items-center h-[40px] rounded-[4px] border border-GrayHomz2 px-2 py-1'>
                                <svg width='16' height='16' fill='none' stroke='currentColor' className='text-GrayHomz2 mr-2'>
                                    <circle cx='7' cy='7' r='6' strokeWidth='2' />
                                    <line x1='11' y1='11' x2='15' y2='15' strokeWidth='2' />
                                </svg>
                                <input
                                    type='text'
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder='Search by name...'
                                    className='bg-transparent h-[40px] rounded-[4px] outline-none text-GrayHomz2 text-sm w-[180px]'
                                />
                                {isSearching && <div className='w-4 h-4 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin ml-1' />}
                            </div>

                            {/* Actions */}
                            {ability.can('update', 'residents') && (
                                <div className='relative' ref={actionsMenuRef}>
                                    <button
                                        onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
                                        className='flex items-center gap-1 border border-BlueHomz text-BlueHomz px-3 py-2 rounded font-medium text-sm'
                                    >
                                        Actions <ArrowDown />
                                    </button>
                                    {actionsMenuOpen && (
                                        <div className='absolute top-12 right-0 z-50 w-[240px] bg-white border rounded shadow-lg flex flex-col p-2'>
                                            <button
                                                className='flex items-center gap-2 p-2 hover:bg-whiteblue text-GrayHomz text-sm text-left'
                                                onClick={() => handleBulkAction('approve')}
                                                disabled={isRequesting}
                                            >
                                                <AddRound /> Approve selected requests
                                            </button>
                                            <button
                                                className='flex items-center gap-2 p-2 hover:bg-whiteblue text-GrayHomz text-sm text-left'
                                                onClick={() => handleBulkAction('decline')}
                                                disabled={isRequesting}
                                            >
                                                <MinusRound /> Decline selected requests
                                            </button>
                                            <button
                                                className='flex items-center gap-2 p-2 hover:bg-whiteblue text-GrayHomz text-sm text-left'
                                                onClick={() => toast('Export coming soon')}
                                            >
                                                <ExportIcon /> Export as <ArrowDown className='#4E4E4E' />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status tabs */}
                    <div className='flex gap-2 mt-3 mb-3'>
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`px-4 h-[34px] rounded-[4px] text-sm font-medium transition-all ${
                                    activeStatus === tab.value
                                        ? 'bg-BlueHomz text-white'
                                        : 'bg-whiteblue text-BlueHomz'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Loading */}
                    {isLoading || !hasFetched ? (
                        <div className='h-[400px] w-full flex justify-center items-center'>
                            <LoaderIcon />
                        </div>
                    ) : !hasResults ? (
                        /* FIX: proper empty state per tab, not a single generic one */
                        <div className='h-[400px] w-full flex justify-center items-center'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className='flex w-[100px] h-[100px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                                    <UserAdd />
                                </div>
                                <p className='mt-2 text-BlueHomz font-medium text-[16px]'>
                                    {activeStatus === 'accepted'
                                        ? 'No approved requests yet'
                                        : activeStatus === 'rejected'
                                        ? 'No declined requests'
                                        : 'No pending requests'}
                                </p>
                                <p className='text-center text-sm font-normal text-GrayHomz max-w-[320px]'>
                                    {activeStatus === 'accepted'
                                        ? 'Approved residents will appear here.'
                                        : activeStatus === 'rejected'
                                        ? 'Declined requests will appear here.'
                                        : "You'll see requests here when residents respond to invitations."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Table */
                        <>
                            <div className='mt-2 border overflow-x-auto scrollbar-container'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz'>
                                            {ability.can('update', 'residents') && activeStatus === 'pending' && (
                                                <th className='cursor-pointer text-left pl-4 w-[40px]' onClick={handleSelectAll}>
                                                    {selectAll ? <Ticked /> : <UnTicked />}
                                                </th>
                                            )}
                                            <th className='text-left pl-4 w-auto md:w-[160px]'>Resident Name</th>
                                            <th className='hidden md:table-cell text-left w-[180px]'>Email</th>
                                            <th className='hidden md:table-cell text-left w-[130px]'>Street</th>
                                            <th className='hidden md:table-cell text-left w-[120px]'>Building</th>
                                            <th className='hidden md:table-cell text-left w-[110px]'>Apartment</th>
                                            <th className='hidden md:table-cell text-left w-[120px]'>Requested On</th>
                                            <th className='text-left w-[110px]'>Status</th>
                                            {ability.can('update', 'residents') && activeStatus === 'pending' && (
                                                <th className='text-left w-[80px]'>Action</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestResponse!.results.map((data) => (
                                            <tr key={data._id} className='border-t min-h-[60px] bg-white hover:bg-whiteblue transition-colors'>
                                                {ability.can('update', 'residents') && activeStatus === 'pending' && (
                                                    <td onClick={() => handleRowSelect(data._id)} className='cursor-pointer py-[15px] pl-4 w-[40px]'>
                                                        {selectedRows.includes(data._id) ? <Ticked /> : <UnTicked />}
                                                    </td>
                                                )}
                                                <td className='py-[15px] pl-4 text-GrayHomz4 font-[500] text-[11px]'>
                                                    {data.firstName} {data.lastName}
                                                </td>
                                                <td className='hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]'>{data.email}</td>
                                                <td className='hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]'>{data.streetName}</td>
                                                <td className='hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]'>{data.building}</td>
                                                <td className='hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]'>{data.apartment}</td>
                                                <td className='hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]'>
                                                    {new Date(data.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className='py-[15px] text-GrayHomz font-[500] text-[11px]'>
                                                    <span className={`rounded-md py-1 px-3 inline-flex items-center justify-center capitalize text-[10px] ${
                                                        data.status === 'accepted'
                                                            ? 'bg-[#CDEADD] text-[#039855]'
                                                            : data.status === 'rejected'
                                                            ? 'bg-[#FDF2F2] text-error'
                                                            : 'bg-warningBg text-warning'
                                                    }`}>
                                                        {data.status === 'accepted' ? 'Approved' : data.status === 'rejected' ? 'Declined' : data.status}
                                                    </span>
                                                </td>
                                                {ability.can('update', 'residents') && activeStatus === 'pending' && (
                                                    <td className='py-[15px] w-[80px]'>
                                                        <button
                                                            ref={(el) => { actionButtonRefs.current[data._id] = el; }}
                                                            className='ml-4'
                                                            onClick={(e) => handleToggleMenu(data._id, e)}
                                                        >
                                                            ⋮
                                                        </button>

                                                        {popUpMenu && selectedId === data._id && menuPortalStyle && ReactDOM.createPortal(
                                                            <div
                                                                ref={menuRef as any}
                                                                style={menuPortalStyle}
                                                                className='w-[180px] text-GrayHomz font-[500] text-[13px] border p-2 rounded-md bg-white flex flex-col shadow-lg z-[99999]'
                                                            >
                                                                <button
                                                                    className='flex md:hidden gap-2 items-center w-full text-left px-4 py-2 text-GrayHomz hover:bg-whiteblue'
                                                                    onClick={() => { setSelectedData(data); setDetailsOpen(true); setPopUpMenu(false); }}
                                                                >
                                                                    <Eye className='h-4 w-4' /> View
                                                                </button>
                                                                <button
                                                                    className='flex gap-2 items-center w-full text-left px-4 py-2 text-Success hover:bg-whiteblue'
                                                                    onClick={() => { setSelectedData(data); setModelOpen('approve'); setPopUpMenu(false); }}
                                                                >
                                                                    <ApproveIcon /> Approve
                                                                </button>
                                                                <button
                                                                    className='flex gap-2 items-center w-full text-left px-4 py-2 text-error hover:bg-whiteblue'
                                                                    onClick={() => { setSelectedData(data); setModelOpen('decline'); setPopUpMenu(false); }}
                                                                >
                                                                    <DeclineIcon /> Decline
                                                                </button>
                                                            </div>,
                                                            document.body
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {requestResponse && requestResponse.totalPages > 1 && (
                                <div className='mt-6'>
                                    <Pagination
                                        firstThreePages={[1, 2, 3]}
                                        currentPage={pageNo}
                                        totalPages={requestResponse.totalPages}
                                        handleNext={handleNext}
                                        handlePageClick={handlePageClick}
                                        handlePrev={handlePrev}
                                        lastThreePages={[
                                            requestResponse.totalPages - 2,
                                            requestResponse.totalPages - 1,
                                            requestResponse.totalPages,
                                        ]}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Details modal */}
                    {detailsOpen && selectedData && (
                        <CustomModal isOpen={detailsOpen} onRequestClose={() => setDetailsOpen(false)}>
                            <div className='p-6 min-w-[340px] w-full md:w-[400px] bg-white rounded-[12px]'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-[16px] text-BlueHomz font-bold mb-2'>Join Request Details</h2>
                                        <button onClick={() => setDetailsOpen(false)} className='border border-GrayHomz h-6 w-6 rounded-[8px] flex justify-center items-center'>
                                            <Close />
                                        </button>
                                    </div>
                                    <div className='grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] bg-inputBg py-2 px-3 rounded-[12px] text-GrayHomz font-normal'>
                                        <span>Resident Name:</span>
                                        <span className='text-BlackHomz'>{selectedData.firstName} {selectedData.lastName}</span>
                                        <span>Estate:</span>
                                        <span className='text-BlackHomz'>{selectedData.estateName}</span>
                                        <span>Zone:</span>
                                        <span className='text-BlackHomz'>{selectedData.zone || '-'}</span>
                                        <span>Street:</span>
                                        <span className='text-BlackHomz'>{selectedData.streetName}</span>
                                        <span>Building:</span>
                                        <span className='text-BlackHomz'>{selectedData.building}</span>
                                        <span>Apartment:</span>
                                        <span className='text-BlackHomz'>{selectedData.apartment}</span>
                                        <span>Requested On:</span>
                                        <span className='text-BlackHomz'>{new Date(selectedData.createdAt).toLocaleDateString()}</span>
                                        <span>Status:</span>
                                        <span className='text-BlackHomz'>{selectedData.status}</span>
                                    </div>
                                    {ability.can('update', 'residents') && selectedData.status === 'pending' && (
                                        <div className='flex gap-2 mt-4'>
                                            <button
                                                className='flex-1 bg-Success text-white text-base rounded h-[40px] font-medium flex items-center gap-1 justify-center'
                                                onClick={() => { setDetailsOpen(false); setModelOpen('approve'); }}
                                            >
                                                <AddRound color='#FFFFFF' /> Approve
                                            </button>
                                            <button
                                                className='flex-1 bg-white border border-error text-error text-base rounded h-[40px] font-medium flex items-center gap-1 justify-center'
                                                onClick={() => { setDetailsOpen(false); setModelOpen('decline'); }}
                                            >
                                                <MinusRound color='#D92D20' colorTwo='#D92D20' /> Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CustomModal>
                    )}
                </div>
            )}
        </div>
    );
};

export default Request;