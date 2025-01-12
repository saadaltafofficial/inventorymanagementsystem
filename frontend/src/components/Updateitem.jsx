import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useAuth } from './AuthContext'

const Updateitem = () => {
    const { token } = useAuth()
    const [ form, setForm ] = useState({ name: '', team: '', item: '', description: '', status: '' })
    const [ response, setResponse ] = useState([])
    const [ itemId, setItemId ] = useState('')

    function fechId() {
        const location = window.location.href
        setItemId(location.slice(39, ))
    }

    const requiredData = {
        name: form.name,
        team: form.team,
        item: form.item,
        description: form.description,
        status: form.status
    }
    
    const handleChange = (event) => {
        const { name, value } = event.target
        setForm(prevFormdata => ({...prevFormdata, [name]: value }))
    }
    
    const handleSubmit = (event) => {
        event.preventDefault()
        createItem(itemId)
        setForm({ name: '', team: '', item: '', description: '', status: '' })
    }


    async function createItem(itemId) {
        console.log(itemId)
        try {
            const response = await fetch(`http://localhost:3000/admin/updateitem/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(
                    requiredData
                )
            })
            if (response.ok) {
                const data = await response.json()
                setResponse(data)
            } else {
                throw new Error('Network response was not ok.')
            }
            
        } catch (error) {
            console.log('There has been a problem with your fetch operation:', error)
        }
    }

    useEffect(()=> {
        fechId()
    }, [])


  return (
    <>
    <Header />
    <section className='px-8 my-10 text-gray-800 flex flex-col items-center justify-center mt-28'>
        <div className='max-w-[600px] w-full'>
        <h1 className='font-bold text-2xl tracking-wide mb-4'>Update Item</h1>
        <form onSubmit={handleSubmit}  className='flex flex-col gap-3'>
            <label>Name
            <input type="text" required name="name" value={form.name} onChange={handleChange} className='block border p-2 rounded-md w-full'/>
            </label>
            <label>Team
            <select name="team" required value={form.team}  onChange={handleChange} className='block border p-2 rounded-md w-full'>
                <option value="">select team</option>
                <option value="devTeam">Dev Team</option>
                <option value="creativeTeam">Creative Team</option>
                <option value="reasearchTeam">Research Team</option>
            </select>
            </label>
            <label>Item
            <select name="item" value={form.item} required onChange={handleChange} className='block border p-2 rounded-md w-full'>
                <option value="">select iteam</option>
                <option value="LCD">LCD</option>
                <option value="CPU">CPU</option>
                <option value="Mouse">Mouse</option>
            </select>
            </label>
            <label>Status
            <select name="status" value={form.status} onChange={handleChange} className='block border p-2 rounded-md w-full'>
                <option value="">select status</option>
                <option value="unassigned">unassigned</option>
                <option value="assigned">assigned</option>
                <option value="faulty">faulty</option>
            </select>
            </label>
            <label>
                Description
            <textarea name="description" value={form.description} onChange={handleChange} className='mb-4 block border p-2 rounded-md w-full'>
            </textarea>           
            </label>
            <button type='submit' className='bg-slate-800 py-3 rounded-md text-white text-xl '>Update Item</button>
        </form>
        </div>
    </section>
    </>
  )
}

export default Updateitem
