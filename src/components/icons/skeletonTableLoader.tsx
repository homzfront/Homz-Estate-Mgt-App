import React from 'react'

const SkeletonTableLoader = () => {
    return (
        <tr className="w-2 border-t-[1px] items-center">
            <td className="flex items-center gap-1 pr-2 py-[15px] pl-4">
                <div className="h-[40px] w-[40px] flex justify-center items-center bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-[15px]">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="sticky right-[-24px] md:right-0 bg-white py-[15px] pr-4 z-10">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            </td>
        </tr>
    );
};

export default SkeletonTableLoader