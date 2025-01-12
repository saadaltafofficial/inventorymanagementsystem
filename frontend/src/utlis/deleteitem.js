export async function deleteitem(id, token) {
    try {
        const response = await fetch('http://localhost:3000/admin/deleteitem', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                itemId: id
            })
        })
        if (response.ok) {
            const data = await response.json()
            console.log(data)
        } else {
            throw new Error('Network response was not ok.')
        }

    } catch (error) {
        console.log('There has been a problem with your fetch operation:', error)
    }
}
