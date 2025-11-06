/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Ticked from '@/components/icons/ticked'
import UnTicked from '@/components/icons/unTicked'
import LoadingSpinner from '@/components/general/loadingSpinner'
import useClickOutside from '@/app/utils/useClickOutside'
import CustomModal from '@/components/general/customModal'
import ArrowDown from '@/components/icons/arrowDown'
import Eye from '@/components/icons/Eye';
import DeleteIcon from '@/components/icons/deleteIcon';
import EditIcon from '@/components/icons/editIcon';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import { useBillStore, BillItem } from '@/store/useBillStore'
import toast from 'react-hot-toast'
import EditBilling from './editBilling'
import { formatDateDisplay } from '@/app/utils/formatDateTime'

const Table = () => {
    const { items, pageLoading, isAppending, deleteBill, fetchBills, currentPage, totalPages } = useBillStore()
    
    // const [statusDropdown, setStatusDropdown] = React.useState<number | null>(null)
    const [actionDropdown, setActionDropdown] = React.useState<number | null>(null)
    const [selectedRows, setSelectedRows] = React.useState<string[]>([])
    const [selectAll, setSelectAll] = React.useState(false)
    const [activeView, setActiveView] = React.useState(false)
    const [activeEdit, setActiveEdit] = React.useState(false)
    const [activeDelete, setActiveDelete] = React.useState(false)
    const [modalOpen, setModalOpen] = React.useState(false)
    const [editModalOpen, setEditModalOpen] = React.useState(false)
    const [selectedBill, setSelectedBill] = React.useState<BillItem | null>(null)
    // const [deletingId, setDeletingId] = React.useState<string | null>(null)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const dropDownRef = React.useRef<HTMLDivElement>(null)
    const statusDropDownRef = React.useRef<HTMLDivElement>(null)
    
    useClickOutside(dropDownRef as any, () => {
        setActionDropdown(null)
    })
    useClickOutside(statusDropDownRef as any, () => {
        // setStatusDropdown(null)
    })

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

    // Delete bill handler
    const handleDeleteBill = async (id: string) => {
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
                                        <div className={`text-[10px] px-3 py-2 rounded font-normal capitalize inline-block ${
                                            row.status === 'active' 
                                                ? 'bg-[#CDEADD] text-[#039855]' 
                                                : 'bg-[#FDF2F2] text-[#D92D20]'
                                        }`}>
                                            {row.status}
                                        </div>
                                    </td>
                                    <td className="py-[15px] z-10 sticky right-[-24px] md:right-0 w-auto md:w-[80px]">
                                        <button
                                            className="ml-4"
                                            onClick={() => setActionDropdown(idx)}
                                        >
                                            ⋮
                                        </button>
                                        {actionDropdown === idx && (
                                            <div ref={dropDownRef} className="drop-down absolute top-9 md:top-11 left-[-135px] md:left-[-170px] z-[999999] w-[150px] md:w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col items-center justify-around">
                                                {/* View */}
                                                <div
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
                                                </div>
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
                                            </div>
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