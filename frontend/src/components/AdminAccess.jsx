import React, { useEffect, useState } from 'react'
import { RiDeleteBinLine } from "react-icons/ri";
import Header from './Header'
import { deleteitem } from '../utlis/deleteitem';
import { useAuth } from './AuthContext';
import GenerateQr from './GenerateQr';
import { Link } from 'react-router-dom';
import { BiEditAlt } from "react-icons/bi";

const AdminAccess = () => {
    const [items, setItems] = useState([])
    const [qrData, setQrData] = useState([])
    const [ formData, setFormData ] = useState({})
    const [ filtered, setFiltered ] = useState([])
    const { token } = useAuth()


    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({...prev, [name]: value}))
    }
    const formDataValue = formData.search
    const handleSearchFilter = (event) => {
        event.preventDefault()
        const searchfilter = items.filter(item => formDataValue === 'allitems' ? item : null || item.status === formDataValue || item.team === formDataValue)
        setFiltered(searchfilter)
    }

    console.log(filtered)

    async function fetchItems() {
        try {
            const response = await fetch('http://localhost:3000/items/allitems', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response.ok) {
                const data = await response.json()
                setItems(data.items)
                
            } else {
                throw new Error('Network response was not ok.')
            }

        } catch (error) {
            console.log('There has been a problem with your fetch operation:', error)
        }
    }

    // if(formDataValue === 'allitems'){
    //     fetchItems()
    // }

    useEffect(() => {
        fetchItems()
    }, [])

    return (
        <>
            <Header />
            <main className='flex flex-col justify-center items-center h-screen px-2 py-6 bg-[#f3f5f8] mt-16'>
                <section className=' border w-full rounded-[1rem] bg-white px-3 py-4'>
                    <h1 className='font-semibold text-xl text-gray-800 mb-2'>Search Item</h1>
                    <form onSubmit={handleSearchFilter} className='grid tablet:grid-cols-2 gap-3'>
                        <select name="search" id="" value={formData.value} onChange={handleChange} className='"w-full rounded-md bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer'>
                            <option value="allitems">All items</option>
                            <option value="devTeam">Dev Team</option>
                            <option value="creativeTeam">Creative Team</option>
                            <option value="reasearchTeam">Research Team</option>
                            <option value="unassigned">unassigned</option>
                            <option value="assigned">assigned</option>
                            <option value="faulty">faulty</option>
                        </select>
                        <button type='submit' className='bg-gray-800 w-full py-3 rounded-md text-white'>Search</button>
                    </form>
                </section>
                <section className="flex flex-col justify-start items-center h-full my-2 border w-full rounded-[1rem] bg-white ">
                    {items.length > 0 ?
                        <table className="text-center w-full">
                            <thead>
                                <tr className='border-b-2'>
                                    <th className="px-3 py-4">Name</th>
                                    <th className="px-3 py-4 hidden laptop:block">Team</th>
                                    <th className="px-3 py-4 ">Item</th>
                                    <th className="px-3 py-4 hidden laptop:block">Description</th>
                                    <th className="px-3 py-4">Status</th>
                                    <th className="px-3 py-4 hidden laptop:block">Date</th>
                                    <th className="px-3 py-4">Qrcode</th>
                                    <th className="px-3 py-4 ">Edit</th>
                                    <th className="px-3 py-4 hidden laptop:block">Delete</th>
                                </tr>
                            </thead>
                            <tbody >
                                {filtered.length > 0 ? 
                                filtered.map((item) => (
                                    <tr key={item._id} className='border-b'>
                                        <td className="px-3">{item.name}</td>
                                        <td className="px-3 hidden laptop:block">{item.team}</td>
                                        <td className="px-3">{item.item}</td>
                                        <td className="px-3 hidden laptop:block">{item.description.slice(0, 15)}...</td>
                                        <td className="px-3">{item.status}</td>
                                        <td className="px-3 hidden laptop:block">{item.time.split('').slice(0, 10)}</td>
                                        <td className="px-3">
                                            {qrData && <GenerateQr id={item._id} qrData={qrData} items={items} setQrData={setQrData} token={token} />}
                                        </td>
                                        <td className="py-2 px-4"><Link to={`/admin/updateitem/${item._id}`}><BiEditAlt size={18} className='text-center w-full' /></Link></td>
                                        <td className="py-2 px-4 hidden laptop:block text-center">
                                            <RiDeleteBinLine size={18} className='cursor-pointer w-full' color='red' onClick={() => deleteitem(item._id, token)} />
                                        </td>
                                    </tr>
                                )) :                                 
                                items.map((item) => (
                                    <tr key={item._id} className='border-b'>
                                        <td className="px-3">{item.name}</td>
                                        <td className="px-3 hidden laptop:block">{item.team}</td>
                                        <td className="px-3">{item.item}</td>
                                        <td className="px-3 hidden laptop:block">{item.description.slice(0, 15)}...</td>
                                        <td className="px-3">{item.status}</td>
                                        <td className="px-3 hidden laptop:block">{item.time.split('').slice(0, 10)}</td>
                                        <td className="px-3">
                                            {qrData && <GenerateQr id={item._id} qrData={qrData} items={items} setQrData={setQrData} token={token} />}
                                        </td>
                                        <td className="py-2 px-4"><Link to={`/admin/updateitem/${item._id}`}><BiEditAlt size={18} className='text-center w-full' /></Link></td>
                                        <td className="py-2 px-4 hidden laptop:block text-center">
                                            <RiDeleteBinLine size={18} className='cursor-pointer w-full' color='red' onClick={() => deleteitem(item._id, token)} />
                                        </td>
                                    </tr>
                                ))}                            
                            </tbody>
                        </table>
                        : <h1 className='text-center'>No items found</h1>}
                </section>
            </main>
        </>
    )
}


export default AdminAccess