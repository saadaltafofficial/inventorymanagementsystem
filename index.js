const Express = require('express');
const mongoose = require('mongoose');
const app = Express();
require('dotenv').config()
const { userRouter } = require('./routes/user')
const { adminRouter } = require('./routes/admin')
const { itemRouter } = require('./routes/item')
const cors = require('cors')

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(Express.json());
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/items', itemRouter)

async function main(){
    try {
        await mongoose.connect(process.env.MONGOOSE_URL)
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port`, process.env.PORT)
        })
        
    } catch (error) {
        console.error(error)
        throw Error('OOps! Something went wrong.')        
    }
}

main()