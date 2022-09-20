const server = require("./server");
const PORT =process.env.PORT ||  2022;

server.listen(PORT,()=> {
    console.log(`Server Started on http://localhost:${PORT}`, );
})
