export async function generateQr(id, token) {
    try {
        const response = await fetch('http://localhost:3000/admin/generateqr', {
            method: 'POST',
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
            return data                     
        } else {
            throw new Error('Network response was not ok.')
        }

    } catch (error) {
        console.log('There has been a problem with your fetch operation:', error)
    }
}

export async function getQrImage(id) {
    try {
        const response = await fetch(`http://localhost:3000/items/item/${id}`, {
            method: 'GET',
        })
        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            throw new Error('Network response was not ok.')
        }

    } catch (error) {
        console.log('There has been a problem with your fetch operation:', error)
    }
}
