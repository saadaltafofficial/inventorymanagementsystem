import React, { useState } from 'react'
import Header from './Header'
import { useAuth } from './AuthContext'

const CreateItem = () => {
    const { token } = useAuth()
    const [ form, setForm ] = useState({ name: '', team: '', item: '', description: '', status: '' })
    const [ response, setResponse ] = useState([])

    console.log(token)
    console.log(response)

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
        createItem()
        setForm({ name: '', team: '', item: '', description: '', status: '' })
    }


    async function createItem() {
        try {
            const response = await fetch('http://localhost:3000/admin/createitem', {
                method: 'POST',
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


  return (
    <>
    <Header />
    <section className='px-4 text-gray-800 flex flex-col items-center justify-start mt-16 h-screen bg-[#f3f5f8]'>
        <div className='max-w-[600px] w-full border p-4 mt-6 rounded-[1rem] bg-white'>
        <h1 className='font-bold text-2xl tracking-wide mb-4'>Create Item</h1>
        <form onSubmit={handleSubmit}  className='flex flex-col gap-3'>
            <label>Name
            <input type="text" required name="name" placeholder='Enter name' value={form.name} onChange={handleChange} className='block border p-2 rounded-md w-full outline-gray-300'/>
            </label>
            <label>Team
            <select name="team" required value={form.team}  onChange={handleChange} className='block border p-2 rounded-md w-ful outline-gray-300'>
                <option value="">select team</option>
                <option value="devTeam">Dev Team</option>
                <option value="creativeTeam">Creative Team</option>
                <option value="reasearchTeam">Research Team</option>
            </select>
            </label>
            <label>Item
            <select name="item" value={form.item} required onChange={handleChange} className='block border p-2 rounded-md w-full outline-gray-300'>
                <option value="">select iteam</option>
                <option value="LCD">LCD</option>
                <option value="CPU">CPU</option>
                <option value="Mouse">Mouse</option>
            </select>
            </label>
            <label>Status
            <select name="status" value={form.status} onChange={handleChange} className='block border p-2 rounded-md w-full outline-gray-300'>
                <option value="">select status</option>
                <option value="unassigned">unassigned</option>
                <option value="assigned">assigned</option>
                <option value="faulty">faulty</option>
            </select>
            </label>
            <label>
                Description
            <textarea name="description" value={form.description} onChange={handleChange} placeholder='Enter description' className='mb-4 h-32 block border p-2 rounded-md w-full resize-none outline-gray-300'>
            </textarea>           
            </label>
            <button type='submit' className='bg-slate-800 py-3 rounded-md text-white text-xl'>Create Item</button>
        </form>
        </div>
    </section>
    </>
  )
}

export default CreateItem


// {
//     "name": "Saad",
//     "team": "Dev",
//     "item": "CPU",
//     "description": "items assigned multiple",
//     "status": "assigned"
// }