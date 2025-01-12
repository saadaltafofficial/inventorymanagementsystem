import React, { useEffect, useState } from 'react'
import Header from './Header'

const Allitems = () => {
    const [items, setItems] = useState([])
    
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

    useEffect(() => {
        fetchItems()
    }, [])


    return (
        <>
        <Header />
        <div className='flex flex-col justify-start items-center h-screen px-2 py-6 bg-[#f3f5f8] mt-16 overflow-hidden'>
        <section className="border w-full rounded-[1rem] bg-white ">
            {items.length > 0 ?
                <table className="text-center w-full">
                    <thead>
                        <tr className='border-b'>
                            <th className="px-3 py-4">Name</th>
                            <th className="px-3 py-4 hidden laptop:block">Team</th>
                            <th className="px-3 py-4">Item</th>
                            <th className="px-3 py-4 hidden laptop:block">Description</th>
                            <th className="px-3 py-4">Status</th>
                            <th className="px-3 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody >
                        {items.map((item) => (
                            <tr key={item._id} className='border-b'>
                                <td className="px-3 py-2">{item.name}</td>
                                <td className="px-3 py-2 hidden laptop:block">{item.team}</td>
                                <td className="px-3 py-2">{item.item}</td>
                                <td className="px-3 py-2 hidden laptop:block">{item.description}</td>
                                <td className="px-3 py-2">{item.status}</td>
                                <td className="px-3 py-2 rounde">{item.time.split('').slice(0, 10)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                : <h1 className='text-center'>No items found</h1>}
        </section>
        </div>
        </>
    )
}

export default Allitems