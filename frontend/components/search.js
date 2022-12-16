import { GlobeAmericasIcon, Bars3Icon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import { truncate } from '../utils/string'

import bgImage from '../public/background.png'

function SearchBar() {
    return (
        <div className="landingImage pb-10 flex justify-between"
        // style={{width:"100vw",height:"100vh"}}
        >
            {/* <Image
                src= {bgImage}
                alt="background" 
                fill
            /> */}
            <div className="flex-1 flex flex-wrap xl:justify-center px-6 transition-all duration-300 content-end">
                <button className="flex-1 flex bg-gray-800 items-center justify-between border rounded-full p-2 w-[300px] shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center divide-x">
                        <p className="text-white bg-transparent text-md font-medium px-10" type="text">
                            Anywhere
                        </p>
                        <p className="text-white bg-transparent text-md font-medium px-10" type="text">
                            Any week
                        </p>
                        <p className="text-white bg-transparent text-md font-medium px-10">Add guests</p>
                    </div>
                    <MagnifyingGlassIcon className="h-8 w-8 bg-[#00B1FF] text-white stroke-[3.5px] p-2 rounded-full" />
                </button>
            </div>
        </div>
    )
}

export default SearchBar