const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

/* STATIC */
app.use(express.static(__dirname));

/* USERS */
io.on("connection",socket=>{

    console.log("USER CONNECTED:",socket.id);

    /* JOIN ROOM */
    socket.on("join-room",room=>{

        socket.join(room);

        socket.room = room;

        /* SEND TO OTHERS */
        socket.to(room).emit(
            "user-joined",
            socket.id
        );

    });

    /* OFFER */
    socket.on("offer",data=>{

        io.to(data.to).emit("offer",{
            from:socket.id,
            offer:data.offer
        });

    });

    /* ANSWER */
    socket.on("answer",data=>{

        io.to(data.to).emit("answer",{
            from:socket.id,
            answer:data.answer
        });

    });

    /* ICE */
    socket.on("ice",data=>{

        io.to(data.to).emit("ice",{
            from:socket.id,
            candidate:data.candidate
        });

    });

    /* DISCONNECT */
    socket.on("disconnect",()=>{

        console.log("USER LEFT:",socket.id);

        if(socket.room){

            socket.to(socket.room).emit(
                "user-left",
                socket.id
            );

        }

    });

});

/* START */
const PORT = 3000;

server.listen(PORT,()=>{

    console.log(`
====================================
NovaMeet Server Started
http://localhost:${PORT}
====================================
`);

});