import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface SidebarCategoriesProps {
    icon: any;
    title: string;
    route: () => void;
}

const SidebarCategories = ({ icon, title, route }: SidebarCategoriesProps) => {
    return (
        <button className='flex flex-row items-center gap-x-2 px-2 py-1 ml-[-5px] bg-gray-100 bg-opacity-0 rounded-md hover:bg-opacity-60'
            onClick={() => {
                route()
            }}
        >
            <FontAwesomeIcon icon={icon} />
            <p className='text-lg'>{title}</p>
        </button>
    )
}

export default SidebarCategories