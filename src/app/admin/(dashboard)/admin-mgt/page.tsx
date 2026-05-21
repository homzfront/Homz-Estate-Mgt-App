'use client';
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useAdminStore } from '@/store/admin/useAdminStore';

interface Admin {
    _id: string;
    userId?: string | { $oid: string } | any;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    phone?: string;
    role?: string;
    roleName?: string;
    status?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface Role {
    _id: string;
    userId?: string | { $oid: string } | any;
    name?: string;
    roleName?: string;
}

// Add Admin Modal
function AddAdminModal({ roles, onClose, onSuccess }: { roles: Role[]; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', roleId: '' });
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    const handleAdd = async () => {
        if (!form.fullName.trim() || !form.email.trim()) return toast.error('Name and email required');
        setSaving(true);
        try {
            const [firstName, ...rest] = form.fullName.trim().split(' ');
            await api.post('/admin/invite', { email: form.email, fullName: form.fullName.trim(), phoneNumber: form.phone, role: form.roleId || 'ADMIN' });
            setDone(true);
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to add admin');
        } finally { setSaving(false); }
    };

    if (done) {
        return (
            <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                <div className='bg-white rounded-[16px] w-full max-w-[420px] p-8 shadow-xl text-center'>
                    <div className='w-16 h-16 rounded-full border-4 border-[#2E7D32] flex items-center justify-center mx-auto mb-5'>
                        <svg width='28' height='28' viewBox='0 0 24 24' fill='none'>
                            <path d='M20 6L9 17l-5-5' stroke='#2E7D32' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                    </div>
                    <h2 className='text-[20px] font-bold text-[#1A1A1A] mb-3'>Admin Added Successfully</h2>
                    <p className='text-[13px] text-[#9E9E9E] mb-7'>The new Admin has been added and can now access the platform based on assigned permissions.</p>
                    <button onClick={() => { onSuccess(); onClose(); }}
                        className='w-full h-[50px] bg-[#006AFF] text-white rounded-[10px] text-[14px] font-semibold hover:bg-[#0055CC]'>
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-[16px] w-full max-w-[520px] shadow-xl'>
                <div className='px-8 pt-8 pb-6'>
                    <h2 className='text-[20px] font-bold text-[#1A1A1A] text-center mb-1'>Add New Admin</h2>
                    <p className='text-[13px] text-[#9E9E9E] text-center mb-7'>Create a new admin account and assign appropriate roles</p>

                    <div className='space-y-4'>
                        <div>
                            <label className='block text-[13px] font-medium text-[#1A1A1A] mb-1.5'>Full Name</label>
                            <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                placeholder='Jane Emma'
                                className='w-full h-[52px] border border-[#E8E8E8] rounded-[10px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                        </div>
                        <div>
                            <label className='block text-[13px] font-medium text-[#1A1A1A] mb-1.5'>Email Address</label>
                            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder='Myemail@gmail.com' type='email'
                                className='w-full h-[52px] border border-[#E8E8E8] rounded-[10px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                        </div>
                        <div>
                            <label className='block text-[13px] font-medium text-[#1A1A1A] mb-1.5'>Phone</label>
                            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder='081265236621'
                                className='w-full h-[52px] border border-[#E8E8E8] rounded-[10px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                        </div>
                        <div>
                            <label className='block text-[13px] font-medium text-[#1A1A1A] mb-1.5'>Admin Role</label>
                            <div className='relative'>
                                <select value={form.roleId} onChange={e => setForm(f => ({ ...f, roleId: e.target.value }))}
                                    className='w-full h-[52px] border border-[#E8E8E8] rounded-[10px] px-4 text-[13px] outline-none focus:border-[#006AFF] bg-white appearance-none'>
                                    <option value=''>Super Admin</option>
                                    {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                                </select>
                                <svg className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none' width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                    <path d='M6 9l6 6 6-6' stroke='#9E9E9E' strokeWidth='1.5' strokeLinecap='round' />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='px-8 pb-8 space-y-3'>
                    <button onClick={handleAdd} disabled={saving}
                        className='w-full h-[52px] bg-[#006AFF] text-white rounded-[10px] text-[14px] font-semibold hover:bg-[#0055CC] disabled:opacity-60 flex items-center justify-center gap-2'>
                        {saving && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                        Add Admin
                    </button>
                    <button onClick={onClose}
                        className='w-full h-[52px] border border-[#E8E8E8] rounded-[10px] text-[14px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5]'>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// Action dropdown menu

function EditAdminModal({ admin, onClose, onSuccess }: { admin: Admin; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({
        firstName: admin.firstName || '',
        lastName:  admin.lastName  || '',
        email:     admin.email     || '',
        phoneNumber: admin.phoneNumber || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            // userId may be ObjectId object or string - extract correctly
            const rawId = admin.userId || admin._id;
            const targetId = typeof rawId === 'object' ? (rawId as any)?.$oid || String(rawId) : rawId;
            await api.patch(`/admin/users/${targetId}`, form);
            toast.success('Admin updated successfully');
            await onSuccess(); // re-fetch list first
            onClose();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to update');
        } finally { setSaving(false); }
    };

    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
            <div className='bg-white rounded-[16px] w-full max-w-[480px] p-6'>
                <div className='flex items-center justify-between mb-5'>
                    <h3 className='text-[16px] font-bold text-[#1A1A1A]'>Edit Admin</h3>
                    <button onClick={onClose} className='w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M18 6L6 18M6 6l12 12' stroke='#1A1A1A' strokeWidth='2' strokeLinecap='round'/></svg>
                    </button>
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>First Name</label>
                            <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                placeholder='First name'
                                className='h-[42px] w-full px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]' />
                        </div>
                        <div>
                            <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>Last Name</label>
                            <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                placeholder='Last name'
                                className='h-[42px] w-full px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]' />
                        </div>
                    </div>
                    <div>
                        <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>Email Address</label>
                        <input type='email' value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder='admin@example.com'
                            className='h-[42px] w-full px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]' />
                    </div>
                    <div>
                        <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>Phone Number</label>
                        <input value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                            placeholder='08012345678'
                            className='h-[42px] w-full px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]' />
                    </div>
                </div>
                <div className='flex gap-3 mt-6'>
                    <button onClick={onClose}
                        className='flex-1 h-[42px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className='flex-1 h-[42px] bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-60'>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ActionMenu({ admin, onRefresh }: { admin: Admin; onRefresh: () => void }) {
    const [open, setOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + window.scrollY + 4,
                right: window.innerWidth - rect.right,
            });
        }
        setOpen(v => !v);
    };

    const handleDeactivate = async () => {
        setOpen(false);
        try {
            await api.patch(`/admin/manage/${admin._id}/status`, { isActive: !admin.isActive }); // uses profile _id
            toast.success(admin.isActive === false ? 'Admin activated' : 'Admin deactivated');
            onRefresh();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed');
        }
    };

    return (
        <>
            <button ref={btnRef} onClick={handleOpen}
                className='w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5] rounded mx-auto'>
                <svg width='4' height='16' viewBox='0 0 4 20' fill='none'>
                    <circle cx='2' cy='2' r='2' fill='#9E9E9E' />
                    <circle cx='2' cy='10' r='2' fill='#9E9E9E' />
                    <circle cx='2' cy='18' r='2' fill='#9E9E9E' />
                </svg>
            </button>

            {open && typeof document !== 'undefined' && ReactDOM.createPortal(
                <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 9999 }}
                    className='bg-white border border-[#E8E8E8] rounded-[10px] shadow-xl min-w-[170px] overflow-hidden'>
                    <button onClick={() => { setOpen(false); setShowEditModal(true); }}
                        className='block w-full text-left px-4 py-3 text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] border-b border-[#F5F5F5]'>
                        Edit Admin
                    </button>
                    <button onClick={handleDeactivate}
                        className='block w-full text-left px-4 py-3 text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] border-b border-[#F5F5F5]'>
                        {admin.isActive === false ? 'Activate Admin' : 'Deactivate Admin'}
                    </button>
                    <button onClick={() => { setOpen(false); setShowDeleteConfirm(true); }}
                        className='block w-full text-left px-4 py-3 text-[13px] text-[#C62828] hover:bg-[#FFF5F5]'>
                        Remove Admin
                    </button>
                </div>,
                document.body
            )}

            {showEditModal && (
                <EditAdminModal
                    admin={admin}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={onRefresh}
                />
            )}
            {showDeleteConfirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[360px] p-6'>
                        <h3 className='text-[15px] font-bold text-[#1A1A1A] mb-1'>Remove Admin?</h3>
                        <p className='text-[13px] text-[#6B6B6B] mb-5'>
                            {`${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email} will be deactivated and lose access.
                        </p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowDeleteConfirm(false)}
                                className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={async () => {
                                setShowDeleteConfirm(false);
                                try {
                                    await api.patch(`/admin/manage/${admin._id}/status`, { isActive: false });
                                    toast.success('Admin removed');
                                    onRefresh();
                                } catch { toast.error('Failed to remove admin'); }
                            }} className='flex-1 h-[40px] bg-[#EF4444] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#DC2626]'>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



export default function AdminMgtPage() {
    const router = useRouter();
    const { admin: currentAdmin } = useAdminStore();
    const isSuperAdmin = currentAdmin?.role === 'SUPER_ADMIN';
    const storeLoaded = currentAdmin !== null;
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showRoleFilter, setShowRoleFilter] = useState(false);

    useEffect(() => { if (isSuperAdmin) { fetchAdmins(); fetchRoles(); } }, [page, roleFilter, statusFilter, isSuperAdmin]);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page) };
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.isActive = statusFilter;
            const res = await api.get('/admin/manage', { params });
            const d = res.data?.data || res.data || {};
            const list = d.results || d.data || (Array.isArray(d) ? d : []);
            console.log('[Admins] first record:', JSON.stringify(list[0]));
            setAdmins(list);
            setTotalPages(d.totalPages || Math.ceil((d.totalCount || 0) / 20) || 1);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchRoles = async () => {
        // No roles API endpoint - roles are freetext strings on the admin profile
        setRoles([
            { _id: 'ADMIN', name: 'Admin', roleName: 'ADMIN' },
            { _id: 'SUPER_ADMIN', name: 'Super Admin', roleName: 'SUPER_ADMIN' },
        ]);
    };

    const formatDate = (d?: string) => new Date(d || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/');

    if (storeLoaded && !isSuperAdmin) return (
        <div className='flex flex-col items-center justify-center h-[60vh] gap-4'>
            <div className='w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center'>
                <svg width='28' height='28' viewBox='0 0 24 24' fill='none'>
                    <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' stroke='#EF4444' strokeWidth='1.5' strokeLinecap='round'/>
                </svg>
            </div>
            <h2 className='text-[18px] font-bold text-[#1A1A1A]'>Access Restricted</h2>
            <p className='text-[13px] text-[#6B6B6B] text-center max-w-[300px]'>
                Admin Management is only accessible to Super Admins.
            </p>
        </div>
    );

    return (
        <div className='p-8 w-full'>
            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[22px] font-bold text-[#1A1A1A]'>Admin Management</h1>
                    <p className='text-[13px] text-[#9E9E9E] mt-0.5 max-w-[400px]'>Manage all platform administrators, assign roles, and control access permissions.</p>
                </div>
                <button onClick={() => setShowAdd(true)}
                    className='h-[44px] px-5 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] flex items-center gap-2 flex-shrink-0'>
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                        <path d='M12 5v14M5 12h14' stroke='white' strokeWidth='2' strokeLinecap='round' />
                    </svg>
                    Add Admin
                </button>
            </div>

            {/* Filters */}
            <div className='flex items-center justify-between mb-4'>
                
                <div className='flex gap-2'>
                    {/* Status filter */}
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className='h-[36px] px-3 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] focus:outline-none bg-white'>
                        <option value=''>All Status</option>
                        <option value='true'>Active</option>
                        <option value='false'>Inactive</option>
                    </select>
                    {/* Role filter */}
                    <div className='relative'>
                        <button onClick={() => setShowRoleFilter(v => !v)}
                            className='h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] bg-white flex items-center gap-1.5 hover:bg-[#F5F5F5]'>
                            {roleFilter ? roles.find(r => r._id === roleFilter)?.name || 'Role' : 'Role'}
                            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                                <path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                            </svg>
                        </button>
                        {showRoleFilter && (
                            <div className='absolute right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg z-10 min-w-[140px]'>
                                <button onClick={() => { setRoleFilter(''); setShowRoleFilter(false); }}
                                    className='block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] text-[#9E9E9E]'>All Roles</button>
                                {roles.map(r => (
                                    <button key={r._id} onClick={() => { setRoleFilter(r._id); setShowRoleFilter(false); }}
                                        className={`block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] ${roleFilter === r._id ? 'text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Table */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] overflow-hidden'>
                <table className='w-full' style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr className='bg-[#F5F7FF]'>
                            {['Name', 'Role', 'Email', 'Phone', 'Date Joined', 'Status', 'Actions'].map(h => (
                                <th key={h} className='px-4 py-3.5 text-[12px] font-semibold text-[#1A1A1A] text-center first:text-left last:text-center'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className='text-center py-16'>
                                <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin mx-auto' />
                            </td></tr>
                        ) : admins.length === 0 ? (
                            <tr><td colSpan={7} className='text-center py-16 text-[13px] text-[#9E9E9E]'>No admins found</td></tr>
                        ) : admins.map((a, i) => (
                            <tr key={a._id} className={`border-t border-[#F5F5F5] ${i % 2 === 0 ? '' : ''} hover:bg-[#FAFAFA]`}>
                                <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A]'>{`${a.firstName || ''} ${a.lastName || ''}`.trim() || '—'}</td>
                                <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center'>{a.role || '—'}</td>
                                <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center'>{a.email}</td>
                                <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center'>{a.phoneNumber || '—'}</td>
                                <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center'>{formatDate(a.createdAt)}</td>
                                <td className='px-4 py-3.5 text-center'>
                                    <span className={`text-[12px] font-semibold ${a.isActive === false ? 'text-[#9E9E9E]' : 'text-[#2E7D32]'}`}>
                                        {a.isActive === false ? 'Inactive' : 'Active'}
                                    </span>
                                </td>
                                <td className='px-4 py-3.5 text-center'>
                                    <ActionMenu admin={a} onRefresh={fetchAdmins} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className='flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]'>
                        <p className='text-[12px] text-[#9E9E9E]'>Page {page} of {totalPages}</p>
                        <div className='flex gap-2'>
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Prev</button>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Next</button>
                        </div>
                    </div>
                )}
            </div>

            {showAdd && <AddAdminModal roles={roles} onClose={() => setShowAdd(false)} onSuccess={fetchAdmins} />}
        </div>
    );
}