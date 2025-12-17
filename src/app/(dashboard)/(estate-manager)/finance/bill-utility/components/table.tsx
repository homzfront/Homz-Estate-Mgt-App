/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ReactDOM from 'react-dom'
import Ticked from '@/components/icons/ticked'
import UnTicked from '@/components/icons/unTicked'
import LoadingSpinner from '@/components/general/loadingSpinner'
import HourGlassLoader from '@/components/general/hourGlassLoader'
import useClickOutside from '@/app/utils/useClickOutside'
import CustomModal from '@/components/general/customModal'
import ArrowDown from '@/components/icons/arrowDown'
import DeleteIcon from '@/components/icons/deleteIcon';
import EditIcon from '@/components/icons/editIcon';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import { useBillStore, BillItem } from '@/store/useBillStore'
import toast from 'react-hot-toast'
import EditBilling from './editBilling'
import { formatDateDisplay } from '@/app/utils/formatDateTime'

interface TableProps {
    onSelectedRowsChange?: (count: number) => void;
    onDeleteMultipleChange?: (handler: () => void) => void;
    onDeletingMultipleChange?: (isDeleting: boolean) => void;
}

const Table = ({ onSelectedRowsChange, onDeleteMultipleChange, onDeletingMultipleChange }: TableProps = {}) => {
    const { items, pageLoading, isAppending, deleteBill, updateBillStatus, fetchBills, currentPage, totalPages } = useBillStore()

    const [statusDropdown, setStatusDropdown] = React.useState<number | null>(null)
    const [actionDropdown, setActionDropdown] = React.useState<number | null>(null)
    const [selectedRows, setSelectedRows] = React.useState<string[]>([])
    const [selectAll, setSelectAll] = React.useState(false)
    const [activeEdit, setActiveEdit] = React.useState(false)
    const [activeDelete, setActiveDelete] = React.useState(false)
    const [modalOpen, setModalOpen] = React.useState(false)
    const [editModalOpen, setEditModalOpen] = React.useState(false)
    const [selectedBill, setSelectedBill] = React.useState<BillItem | null>(null)
    // const [deletingId, setDeletingId] = React.useState<string | null>(null)
    const [updatingStatusId, setUpdatingStatusId] = React.useState<string | null>(null)
    const [deletingMultiple, setDeletingMultiple] = React.useState(false)
    const [statusDropdownPortalStyle, setStatusDropdownPortalStyle] = React.useState<React.CSSProperties | null>(null)
    const [actionDropdownPortalStyle, setActionDropdownPortalStyle] = React.useState<React.CSSProperties | null>(null)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const dropDownRef = React.useRef<HTMLDivElement>(null)
    const statusDropDownRef = React.useRef<HTMLDivElement>(null)
    const statusButtonRefs = React.useRef<{ [key: number]: HTMLButtonElement | null }>({})
    const actionButtonRefs = React.useRef<{ [key: number]: HTMLButtonElement | null }>({})

    useClickOutside(dropDownRef as any, () => {
        setActionDropdown(null)
    })
    useClickOutside(statusDropDownRef as any, () => {
        // setStatusDropdown(null)
    })

    // Calculate portal position for status dropdown
    React.useEffect(() => {
        if (statusDropdown !== null && statusButtonRefs.current[statusDropdown]) {
            const rect = statusButtonRefs.current[statusDropdown]!.getBoundingClientRect()
            setStatusDropdownPortalStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 0,
                zIndex: 9999,
            })
        } else {
            setStatusDropdownPortalStyle(null)
        }
    }, [statusDropdown])

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

    // Infinite scroll for loading more
    React.useEffect(() => {
        if (!loaderRef.current) return
        const el = loaderRef.current
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0]
            if (first.isIntersecting && !isAppending && !pageLoading && currentPage < totalPages) {
                fetchBills({ page: currentPage + 1, append: true })
            }
        }, { rootMargin: '200px' })
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [loaderRef.current, isAppending, pageLoading, currentPage, totalPages, fetchBills])

    React.useEffect(() => {
        setSelectedRows(prev => prev.filter(id => items.some(item => item._id === id)))
        setSelectAll(selectedRows.length === items.length && items.length > 0)
    }, [items])

    // Notify parent about selected rows count
    React.useEffect(() => {
        onSelectedRowsChange?.(selectedRows.length)
    }, [selectedRows.length, onSelectedRowsChange])

    // Notify parent about deleting state
    React.useEffect(() => {
        onDeletingMultipleChange?.(deletingMultiple)
    }, [deletingMultiple, onDeletingMultipleChange])

    // Select all rows
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([])
            setSelectAll(false)
        } else {
            setSelectedRows(items.map(row => row._id))
            setSelectAll(true)
        }
    }

    // Select individual row
    const handleRowSelect = (rowId: string) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter(id => id !== rowId))
            setSelectAll(false)
        } else {
            const newSelected = [...selectedRows, rowId]
            setSelectedRows(newSelected)
            if (newSelected.length === items.length) setSelectAll(true)
        }
    }

    // Delete bill handler (single delete from action dropdown)
    const handleDeleteBill = async (id: string) => {
        // setDeletingId(id)
        // setDeletingId(id)
        try {
            await deleteBill(id)
            toast.success('Bill deleted successfully', { position: 'top-center' })
            setActiveDelete(false)
            setModalOpen(false)
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete bill', { position: 'top-center' })
        } finally {
            // setDeletingId(null)
        }
    }

    // Delete multiple selected bills synchronously
    const handleDeleteSelectedBills = React.useCallback(async () => {
        if (selectedRows.length === 0) {
            toast.error('No bills selected', { position: 'top-center' })
            return
        }

        setDeletingMultiple(true)
        let deletedCount = 0
        const failedBills: string[] = []

        try {
            for (const billId of selectedRows) {
                try {
                    await deleteBill(billId)
                    deletedCount++
                } catch {
                    failedBills.push(billId)
                }
            }

            // Clear selection after deletion
            setSelectedRows([])
            setSelectAll(false)

            // Show result message
            if (failedBills.length === 0) {
                toast.success(`${deletedCount} bill(s) deleted successfully`, { position: 'top-center' })
            } else {
                toast.error(`${deletedCount} deleted, ${failedBills.length} failed`, { position: 'top-center' })
            }
        } finally {
            setDeletingMultiple(false)
        }
    }, [selectedRows, deleteBill])

    // Notify parent about delete handler (must be after handleDeleteSelectedBills declaration)
    React.useEffect(() => {
        onDeleteMultipleChange?.(handleDeleteSelectedBills)
    }, [handleDeleteSelectedBills, onDeleteMultipleChange])

    // Update bill status handler
    const handleUpdateStatus = async (billId: string, newStatus: 'active' | 'inactive') => {
        setUpdatingStatusId(billId)
        try {
            await updateBillStatus(billId, newStatus)
            toast.success('Status updated successfully', { position: 'top-center' })
            setStatusDropdown(null)
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status', { position: 'top-center' })
        } finally {
            setUpdatingStatusId(null)
        }
    }

    const openModal = (bill: any) => {
        setSelectedBill(bill)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedBill(null)
    }

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-full md:w-[150%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                <th className="cursor-pointer text-left pl-4 w-[40px]" onClick={handleSelectAll}>
                                    {selectAll ? <Ticked /> : <UnTicked />}
                                </th>
                                <th className="text-left w-auto md:w-[140px]">Bill Name</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Residence Type</th>
                                <th className="text-left w-auto md:w-[120px]">Amount</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Frequency</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Start Date</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Status</th>
                                <th className="text-left w-auto md:w-[80px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageLoading && items.length === 0 && (
                                Array.from({ length: 6 }).map((_, sk) => (
                                    <tr key={`sk-${sk}`} className="border-t-[1px]">
                                        <td className="py-[15px] pl-4">
                                            <div className="h-3 w-4 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px]">
                                            <div className="h-3 w-28 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px]">
                                            <div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] pr-4"></td>
                                    </tr>
                                ))
                            )}
                            {items.map((row: BillItem, idx: number) => (
                                <tr key={row._id} className="border-t min-h-[60px] bg-white">
                                    <td
                                        onClick={() => handleRowSelect(row._id)}
                                        className="cursor-pointer pr-2 py-[15px] pl-4 font-[500] text-[11px] w-[40px]"
                                    >
                                        {selectedRows.includes(row._id) ? <Ticked /> : <UnTicked />}
                                    </td>
                                    <td className="py-[15px] text-GrayHomz4 font-[500] text-[11px] w-auto md:w-[140px]">{row.billName}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[140px]">
                                        {row.applyToAllResidencyTypes ? (
                                            'All Residency Types'
                                        ) : row.residencyAmounts && row.residencyAmounts.length > 0 ? (
                                            row.residencyAmounts.length === 1 ? (
                                                row.residencyAmounts[0].residencyType
                                            ) : (
                                                <div
                                                    className="flex items-center gap-2 text-BlueHomz cursor-pointer"
                                                    onClick={(e) => { e.stopPropagation(); openModal(row) }}
                                                >
                                                    <span>Multiple Residence</span>
                                                    <span style={{ display: 'inline-flex' }}>
                                                        <ArrowDown className={'#006AFF'} />
                                                    </span>
                                                </div>
                                            )
                                        ) : (
                                            'All Residency Types'
                                        )}
                                    </td>
                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px] w-auto md:w-[120px]">
                                        {row.applyToAllResidencyTypes && row.amount ? (
                                            `${row.currency}${row.amount.toLocaleString()}`
                                        ) : row.residencyAmounts && row.residencyAmounts.length > 0 ? (
                                            row.residencyAmounts.length === 1 ? (
                                                `${row.residencyAmounts[0].currency}${row.residencyAmounts[0].amount.toLocaleString()}`
                                            ) : (
                                                <div
                                                    className="flex items-center gap-2 text-BlueHomz cursor-pointer"
                                                    onClick={(e) => { e.stopPropagation(); openModal(row) }}
                                                >
                                                    <span>View all</span>
                                                    <span style={{ display: 'inline-flex' }}>
                                                        <ArrowDown className={'#006AFF'} />
                                                    </span>
                                                </div>
                                            )
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px] capitalize">{row.frequency}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{formatDateDisplay(row.billingStartDate)}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">
                                        <div style={{ width: 100 }}>
                                            {updatingStatusId === row._id ? (
                                                <div className='flex justify-center items-center w-full'>
                                                    <HourGlassLoader />
                                                </div>  
                                            ) : (
                                                <button
                                                    ref={(el) => { statusButtonRefs.current[idx] = el; }}
                                                    style={{
                                                        width: 100,
                                                        height: 33,
                                                        borderRadius: 4,
                                                        opacity: 1,
                                                        gap: 4,
                                                        padding: '8px 12px',
                                                        background: row.status === 'active' ? '#CDEADD' : '#FDF2F2',
                                                        color: row.status === 'active' ? '#039855' : '#D92D20',
                                                        border: 'none',
                                                        fontFamily: 'Plus Jakarta Sans',
                                                        fontWeight: 400,
                                                        fontSize: 10,
                                                        lineHeight: '150%',
                                                        letterSpacing: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => setStatusDropdown(idx)}
                                                >
                                                    <span>{row.status}</span>
                                                    <span style={{ marginLeft: 8, display: 'inline-flex', transform: statusDropdown === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                                        <ArrowDown className={row.status === 'active' ? '#039855' : '#D92D20'} />
                                                    </span>
                                                </button>
                                            )}
                                            {statusDropdown === idx && updatingStatusId !== row._id && statusDropdownPortalStyle && ReactDOM.createPortal(
                                                <div
                                                    ref={statusDropDownRef}
                                                    style={{
                                                        ...statusDropdownPortalStyle,
                                                        width: 100,
                                                        borderRadius: 4,
                                                        border: '1px solid #E6E6E6',
                                                        background: '#fff',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                                        padding: '8px 8px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 4,
                                                    }}
                                                >
                                                    <button
                                                        className="h-[25px] hover:bg-whiteblue rounded px-2 font-normal text-[10px] leading-[150%] text-[#4E4E4E] bg-transparent border-none mb-1 cursor-pointer text-left"
                                                        onClick={() => handleUpdateStatus(row._id, 'active')}
                                                    >
                                                        Active
                                                    </button>
                                                    <button
                                                        className="h-[25px] hover:bg-whiteblue rounded px-2 font-normal text-[10px] leading-[150%] text-[#4E4E4E] bg-transparent border-none cursor-pointer text-left"
                                                        onClick={() => handleUpdateStatus(row._id, 'inactive')}
                                                    >
                                                        Inactive
                                                    </button>
                                                </div>,
                                                document.body
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-[15px] z-10 sticky right-[-24px] md:right-0 w-auto md:w-[80px]">
                                        <button
                                            ref={(el) => { actionButtonRefs.current[idx] = el; }}
                                            className="ml-4"
                                            onClick={() => setActionDropdown(idx)}
                                        >
                                            ⋮
                                        </button>
                                        {actionDropdown === idx && actionDropdownPortalStyle && ReactDOM.createPortal(
                                            <div ref={dropDownRef} className="drop-down z-[999999] w-[150px] md:w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col items-center justify-around" style={actionDropdownPortalStyle}>
                                                {/* View */}
                                                {/* <div
                                                    onMouseEnter={() => setActiveView(true)}
                                                    onMouseLeave={() => setActiveView(false)}
                                                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                    <div className="w-full">
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActionDropdown(null)
                                                            }}
                                                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                        >
                                                            <Eye className='w-5 h-5' />
                                                            <p className={`${activeView ? 'text-BlueHomz' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                View
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                {/* Edit */}
                                                <div
                                                    onMouseEnter={() => setActiveEdit(true)}
                                                    onMouseLeave={() => setActiveEdit(false)}
                                                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                    <div className="w-full">
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSelectedBill(row)
                                                                setEditModalOpen(true)
                                                                setActionDropdown(null)
                                                            }}
                                                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                        >
                                                            <EditIcon color={activeEdit ? '#006AFF' : "#4E4E4E"} />
                                                            <p className={`${activeEdit ? 'text-BlueHomz' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                Edit
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Delete */}
                                                <div
                                                    onMouseEnter={() => setActiveDelete(true)}
                                                    onMouseLeave={() => setActiveDelete(false)}
                                                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                    <div className="w-full">
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDeleteBill(row._id)
                                                                setActionDropdown(null)
                                                            }}
                                                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                        >
                                                            <DeleteIcon className={activeDelete ? '#d92d20' : "#4e4e4e"} />
                                                            <p className={`${activeDelete ? 'text-error' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                Delete
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>,
                                            document.body
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {currentPage < totalPages && (
                                <tr>
                                    <td colSpan={8} className="py-2">
                                        <div ref={loaderRef} className="h-1" />
                                        {isAppending && (
                                            <div className="w-full max-w-[1000px] flex items-center justify-center py-3">
                                                <LoadingSpinner />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && selectedBill && (
                <CustomModal isOpen={modalOpen} onRequestClose={closeModal}>
                    <div className="min-w-[320px] md:min-w-[600px] bg-white rounded-[12px] px-4 py-7 relative w-full">
                        <div className='flex justify-between items-start'>
                            <h3 className="text-[18px] font-semibold mb-4">{selectedBill.billName}</h3>
                            <button
                                onClick={closeModal}
                            >
                                <CloseTransluscentIcon />
                            </button>
                        </div>
                        <div className="w-full overflow-y-auto max-h-[600px] scrollbar-container">
                            <div className="grid grid-cols-2 bg-[#EEF5FF] px-6 py-3 text-[11px] font-medium text-GrayHomz4">
                                <div>Residence Type</div>
                                <div>Price</div>
                            </div>
                            {selectedBill.residencyAmounts && selectedBill.residencyAmounts.map((ra, i: number) => (
                                <div key={i} className="grid grid-cols-2 px-6 py-4 border-t border-[#D5D5D5] text-[11px] font-medium text-GrayHomz">
                                    <div className='col-span-1'>{ra.residencyType}</div>
                                    <div className='col-span-1'>{ra.currency}{ra.amount.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CustomModal>
            )}

            {editModalOpen && selectedBill && (
                <EditBilling
                    isOpen={editModalOpen}
                    onRequestClose={() => {
                        setEditModalOpen(false)
                        setSelectedBill(null)
                    }}
                    billData={selectedBill}
                    isEditing={true}
                />
            )}

        </div>
    )
}

export default Table