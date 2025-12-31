/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ReactDOM from 'react-dom'
import LoadingSpinner from '@/components/general/loadingSpinner'
import useClickOutside from '@/app/utils/useClickOutside'
import ArrowDown from '@/components/icons/arrowDown'
import DeleteIcon from '@/components/icons/deleteIcon';
import EditIcon from '@/components/icons/editIcon';
import EyeIcon from '@/components/icons/Eye';
import BillingDetailsModal from './billingDetailsModal';
import CustomModal from '@/components/general/customModal';
import formatBillType from '@/app/utils/formatBillType';
import { useBillPaymentStore } from '@/store/useBillPaymentStore'
import SuccessModal from '@/app/(dashboard)/components/successModal'
import DotLoader from '@/components/general/dotLoader'

interface Props {
    onOpenPaymentModal?: (data?: any) => void
    residentId: string
    apartmentId?: string
}

const Table: React.FC<Props> = ({ onOpenPaymentModal, residentId, apartmentId }) => {
    const [actionDropdown, setActionDropdown] = React.useState<string | null>(null)
    const [activeEdit, setActiveEdit] = React.useState(false)
    const [activeDelete, setActiveDelete] = React.useState(false)
    const [activeView, setActiveView] = React.useState(false)
    const [actionDropdownPortalStyle, setActionDropdownPortalStyle] = React.useState<React.CSSProperties | null>(null)
    const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())
    const [detailsModalOpen, setDetailsModalOpen] = React.useState(false)
    const [selectedGroup, setSelectedGroup] = React.useState<any>(null)
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
    const [deletingItem, setDeletingItem] = React.useState<any>(null)
    const [deleteLoading, setDeleteLoading] = React.useState(false)
    const [successModalOpen, setSuccessModalOpen] = React.useState(false)

    const dropDownRef = React.useRef<HTMLDivElement>(null)
    const actionButtonRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({})

    const {
        items,
        totalPages,
        currentPage,
        initialLoading,
        pageLoading,
        isAppending,
        fetchBillPayments
    } = useBillPaymentStore();

    // console.log("Bill Payments:", items)

    useClickOutside(dropDownRef as any, () => {
        setActionDropdown(null)
    })

    const loaderRef = React.useRef<HTMLDivElement | null>(null)

    // Intersection observer for infinite scrolling
    React.useEffect(() => {
        if (!loaderRef.current) return
        const el = loaderRef.current
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0]
            if (first.isIntersecting && currentPage < totalPages && !pageLoading && !isAppending) {
                loadMore()
            }
        }, { rootMargin: '200px' })
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [loaderRef.current, currentPage, totalPages, pageLoading, isAppending])

    // Calculate portal position for action dropdown
    React.useEffect(() => {
        if (actionDropdown !== null && actionButtonRefs.current[actionDropdown]) {
            const rect = actionButtonRefs.current[actionDropdown]!.getBoundingClientRect()
            setActionDropdownPortalStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 170,
                zIndex: 9999,
            })
        } else {
            setActionDropdownPortalStyle(null)
        }
    }, [actionDropdown])

    const loadMore = () => {
        if (currentPage < totalPages && !pageLoading && !isAppending) {
            fetchBillPayments({ residentId, apartmentId, page: currentPage + 1, append: true })
        }
    }

    const toggleRow = (key: string) => {
        const newSet = new Set(expandedRows)
        if (newSet.has(key)) {
            newSet.delete(key)
        } else {
            newSet.add(key)
        }
        setExpandedRows(newSet)
    }

    const handleViewDetails = (group: any) => {
        setSelectedGroup(group)
        setDetailsModalOpen(true)
        setActionDropdown(null)
    }

    const handleDeletePayment = async () => {
        if (!deletingItem) return

        setDeleteLoading(true)
        try {
            await useBillPaymentStore.getState().deleteBillPayment(
                deletingItem._id,
                deletingItem.billingId,
                apartmentId
            )
            if (residentId && apartmentId) {
                await fetchBillPayments({
                    residentId: residentId,
                    apartmentId: String(apartmentId),
                    silent: true
                })
            }
            setDeleteModalOpen(false)
            setDeletingItem(null)
            setSuccessModalOpen(true)
        } catch (error) {
            console.error('Failed to delete payment:', error)
            // You might want to show an error message here
        } finally {
            setDeleteLoading(false)
        }
    }

    // Group items
    const groupedItems = React.useMemo(() => {
        const groups: { [key: string]: typeof items } = {};
        items.forEach(item => {
            // Group by billingId and periodNumber
            const key = `${item.billingId}-${item.periodNumber}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        return Object.entries(groups).map(([key, groupItems]) => {
            // Sort items by date descending for display
            groupItems.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

            const first = groupItems[0];
            const totalAmount = first.amount;
            const totalPaid = groupItems.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
            const outstanding = Math.max(0, totalAmount - totalPaid);

            // Determine status based on outstanding
            let status = 'pending';
            if (outstanding <= 0) status = 'paid';
            else if (totalPaid > 0) status = 'partialpaid';

            // Latest payment date
            const latestDate = first.paymentDate;

            const paidItem = groupItems.find(item => item.status?.toLowerCase() === 'paid');

            return {
                key,
                items: groupItems,
                billType: first.billType,
                formattedBillType: formatBillType(first.billType),
                frequency: first.frequency,
                amount: totalAmount,
                amountPaid: totalPaid,
                outstanding: outstanding,
                paymentType: paidItem ? paidItem.paymentType : (groupItems.length > 1 ? 'Part Payment' : first.paymentType),
                paymentMode: first.paymentMode,
                status: status,
                paymentDate: latestDate,
                currency: "₦"
            };
        });
    }, [items]);

    const getStatusStyle = (status: string) => {
        const ps = status?.toLowerCase()
        if (ps === 'paid') return { bg: '#CDEADD', color: '#039855', label: 'Paid' }
        if (ps === 'pending') return { bg: '#FCF3EB', color: '#DC6803', label: 'Pending' }
        if (ps === 'partialpaid' || ps === 'partially paid') return { bg: '#FDF2F2', color: '#D92D20', label: 'Partially Paid' }
        return { bg: '#FDF2F2', color: '#D92D20', label: status }
    }

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-full md:w-[200%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                <th className="pl-4 text-left w-auto md:w-[140px]">Bill Amount</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Bill Type</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Frequency</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Payment Type</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Mode of Payment</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Amount Paid</th>
                                <th className="text-left w-[160px]">Outstanding Balance</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Status</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Payment Date</th>
                                <th className="text-left w-[80px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialLoading && (
                                Array.from({ length: 6 }).map((_, sk) => (
                                    <tr key={`sk-${sk}`} className="border-t-[1px]">
                                        <td className="py-[15px] pl-4"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px] hidden md:table-cell"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px] hidden md:table-cell"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px] hidden md:table-cell"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px] hidden md:table-cell"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px] hidden md:table-cell"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px] hidden md:table-cell"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"></td>
                                    </tr>
                                ))
                            )}
                            {!initialLoading && groupedItems.map((group) => {
                                const isExpanded = expandedRows.has(group.key);
                                const statusStyle = getStatusStyle(group.status);
                                // console.log("Rendering group:", group);
                                return (
                                    <React.Fragment key={group.key}>
                                        {/* Parent Row */}
                                        <tr className="border-t min-h-[60px] bg-white hover:bg-gray-50 transition-colors">
                                            <td className="pl-4 py-[15px] text-BlueHomz font-[600] text-[13px] cursor-pointer" onClick={() => toggleRow(group.key)}>
                                                <div className="flex items-center gap-2">
                                                    {group.currency}{group.amount.toLocaleString()}
                                                    <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <ArrowDown className="#006AFF" />
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-[15px] text-GrayHomz4 font-[500] text-[11px] hidden md:table-cell w-[140px]">{group.formattedBillType}</td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]">{group.frequency}</td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]">{group.paymentType}</td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] capitalize">[{group.paymentMode}]</td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]">{group.currency}{group.amountPaid.toLocaleString()}</td>
                                            <td className="py-[15px] text-GrayHomz font-[500] text-[11px]">{group.currency}{group.outstanding.toLocaleString()}</td>
                                            <td className="hidden md:table-cell py-[15px]">
                                                <div
                                                    style={{
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '10px',
                                                        width: 'fit-content',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {statusStyle.label}
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]">-</td>
                                            <td className="py-[15px] relative">
                                                <button
                                                    className="ml-4 text-GrayHomz hover:text-BlueHomz"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionDropdown(group.key);
                                                    }}
                                                    ref={(el) => { actionButtonRefs.current[group.key] = el; }}
                                                >
                                                    ⋮
                                                </button>
                                                {actionDropdown === group.key && actionDropdownPortalStyle && ReactDOM.createPortal(
                                                    <div ref={dropDownRef} className="drop-down z-[999999] w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col items-center justify-around shadow-lg" style={actionDropdownPortalStyle}>
                                                        <div
                                                            onMouseEnter={() => setActiveView(true)}
                                                            onMouseLeave={() => setActiveView(false)}
                                                            className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                            <div className="w-full">
                                                                <div
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setActionDropdown(null)
                                                                        handleViewDetails(group)
                                                                    }}
                                                                    className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                                >
                                                                    <EyeIcon color={activeView ? '#006AFF' : "#4E4E4E"} />
                                                                    <p className={`${activeView ? 'text-BlueHomz' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                        View Details
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>,
                                                    document.body
                                                )}
                                            </td>
                                        </tr>

                                        {/* Child Rows */}
                                        {isExpanded && group.items.map((item) => {
                                            // Calculate outstanding for this specific transaction
                                            const sortedAsc = [...group.items].sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());
                                            let runningPaid = 0;
                                            const itemWithBalance = sortedAsc.map(i => {
                                                runningPaid += i.amountPaid;
                                                return { ...i, balanceAfter: Math.max(0, group.amount - runningPaid) };
                                            });
                                            const displayItem = itemWithBalance.find(i => i._id === item._id);
                                            const balance = displayItem ? displayItem.balanceAfter : 0;

                                            const childStatusStyle = getStatusStyle(item.status);

                                            return (
                                                <tr key={item._id} className="bg-gray-50 border-t border-gray-100">
                                                    <td className="pl-4 py-[15px]"></td>
                                                    <td className="hidden md:table-cell py-[15px]"></td>
                                                    <td className="hidden md:table-cell py-[15px]"></td>
                                                    <td className="hidden md:table-cell py-[15px]"></td>
                                                    <td className="hidden md:table-cell py-[15px]"></td>
                                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]">{group.currency}{item.amountPaid.toLocaleString()}</td>
                                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px]">{group.currency}{balance.toLocaleString()}</td>
                                                    <td className="hidden md:table-cell py-[15px]">
                                                        <div
                                                            style={{
                                                                background: childStatusStyle.bg,
                                                                color: childStatusStyle.color,
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '10px',
                                                                width: 'fit-content',
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {childStatusStyle.label}
                                                        </div>
                                                    </td>
                                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px]">{item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '-'}</td>
                                                    <td className="py-[15px] relative">
                                                        {item.paymentMode === 'offline' && (
                                                            <>
                                                                <button
                                                                    className="ml-4 text-GrayHomz hover:text-BlueHomz"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActionDropdown(item._id);
                                                                    }}
                                                                    ref={(el) => { actionButtonRefs.current[item._id] = el; }}
                                                                >
                                                                    ⋮
                                                                </button>
                                                                {actionDropdown === item._id && actionDropdownPortalStyle && ReactDOM.createPortal(
                                                                    <div ref={dropDownRef} className="drop-down z-[999999] w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col items-center justify-around shadow-lg" style={actionDropdownPortalStyle}>
                                                                        <div
                                                                            onMouseEnter={() => setActiveEdit(true)}
                                                                            onMouseLeave={() => setActiveEdit(false)}
                                                                            className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                                            <div className="w-full">
                                                                                <div
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        setActionDropdown(null)
                                                                                        onOpenPaymentModal?.(item)
                                                                                    }}
                                                                                    className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                                                >
                                                                                    <EditIcon color={activeEdit ? '#006AFF' : "#4E4E4E"} />
                                                                                    <p className={`${activeEdit ? 'text-BlueHomz' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                                        Edit Record
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            onMouseEnter={() => setActiveDelete(true)}
                                                                            onMouseLeave={() => setActiveDelete(false)}
                                                                            className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                                            <div className="w-full">
                                                                                <div
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        setActionDropdown(null)
                                                                                        setDeletingItem(item)
                                                                                        setDeleteModalOpen(true)
                                                                                    }}
                                                                                    className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                                                >
                                                                                    <DeleteIcon className={activeDelete ? '#d92d20' : "#4e4e4e"} />
                                                                                    <p className={`${activeDelete ? 'text-error' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                                        Remove Record
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>,
                                                                    document.body
                                                                )}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </React.Fragment>
                                )
                            })}
                            {currentPage < totalPages && (
                                <tr>
                                    <td colSpan={10} className="py-2">
                                        <div ref={loaderRef} className="h-1" />
                                        {(pageLoading || isAppending) && (
                                            <div className="w-full flex items-center justify-center py-3">
                                                <LoadingSpinner size={24} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            <BillingDetailsModal
                isOpen={detailsModalOpen}
                onRequestClose={() => setDetailsModalOpen(false)}
                selectedGroup={selectedGroup}
            />

            {/* Delete Confirmation Modal */}
            <CustomModal
                isOpen={deleteModalOpen}
                onRequestClose={() => {
                    if (!deleteLoading) {
                        setDeleteModalOpen(false)
                        setDeletingItem(null)
                    }
                }}
            >
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Confirm Deletion
                    </h3>

                    {deletingItem && (
                        <div className="bg-gray-50 p-4 rounded-md mb-6 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500">Amount Paid:</span>
                                <span className="font-medium text-gray-900">₦{deletingItem.amountPaid?.toLocaleString()}</span>

                                <span className="text-gray-500">Bill Type:</span>
                                <span className="font-medium text-gray-900">{formatBillType(deletingItem.billType)}</span>

                                <span className="text-gray-500">Payment Date:</span>
                                <span className="font-medium text-gray-900">
                                    {deletingItem.paymentDate ? new Date(deletingItem.paymentDate).toLocaleDateString() : '-'}
                                </span>

                                <span className="text-gray-500">Payment Mode:</span>
                                <span className="font-medium text-gray-900 capitalize">{deletingItem.paymentMode}</span>
                            </div>
                        </div>
                    )}

                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this bill payment record? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setDeleteModalOpen(false)
                                setDeletingItem(null)
                            }}
                            disabled={deleteLoading}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeletePayment}
                            disabled={deleteLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {deleteLoading ? <><DotLoader color='#ffffff' /></> : 'Delete'}
                        </button>
                    </div>
                </div>
            </CustomModal>

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModalOpen}
                title="Payment Record Deleted"
                successText="The bill payment record has been successfully deleted."
                closeSuccessModal={() => setSuccessModalOpen(false)}
                handleBack={() => setSuccessModalOpen(false)}
            />
        </div>
    )
}

export default Table