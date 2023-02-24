const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://ammar:theinsurgent12@cluster0.lho89lb.mongodb.net/test", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})