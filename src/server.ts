import { PrismaClient, User } from "@prisma/client";
import cors from "cors";
import express from "express";
// import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();


const app = express();
const SECRET = process.env.SECRET!;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const port = 4001;
const prisma = new PrismaClient({ log: ["error", "info", "query", "warn"] });

function getToken(id: number) {
    return jwt.sign({ id: id }, SECRET, {
        expiresIn: "7 days",
    });
}
async function getCurrentUser(token: string) {
    const decodedData = jwt.verify(token, SECRET);
    const user = await prisma.user.findUnique({
        // @ts-ignore
        where: { id: decodedData.id }


    });
    if (!user) return null
    return user



}


app.get("/users", async (req, res) => {
    try{
    const users = await prisma.user.findMany({
        include: { ticket: true }
    })
    res.send(users)}catch(error){
        console.log(error)
    }





})
app.get("/user/:id", async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.user.findUnique({
        where: { id },
        include: { ticket: true }


    })
    res.send(user)





})
app.get("/users/:id/tickets", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const tickets = await prisma.ticket.findMany({
            where: { userId: id }



        })
        res.send(tickets)
    } catch (error) {
        console.log(error)
    }





})


app.delete('/user/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const user = await prisma.user.delete({
            where: { id }
        })
        res.send(user)
    } catch (error) {
        console.log(error)
    }
})
app.patch('/userupdate/:id', async (req, res) => {
    try { const id = Number(req.params.id)
    const user = await prisma.user.update({
        where: { id },
        data: req.body,
    })
    res.send(user)}catch(error){
        console.log(error)
    }
})
app.delete('/ticket/:id', async (req, res) => {
    try { const id = Number(req.params.id)
    const ticket = await prisma.ticket.delete({
        where: {id}
    })
    res.send(ticket)} catch(error){
        console.log(error)
    }
})


app.post("/sign-in", async (req, res) => {
  const User = await prisma.user.findUnique({
        where: { username: req.body.username }
    });
    if (User && bcrypt.compareSync(req.body.password, User.password)) {


        res.send({ token: getToken(User.id) });
    } else {
        res.status(400).send({ error: "Email or password is incorrect" });
    }
});

app.post("/admin/sign-in", async (req, res) => {
    const Useradmin = await prisma.admin.findUnique({
        where: { username: req.body.username }
    });
    if (Useradmin && bcrypt.compareSync(req.body.password, Useradmin.password)) {


        res.send({ token: getToken(Useradmin.id) });
    } else {
        res.status(400).send({ error: "Email or password is incorrect" });
    }
});
app.post("/sign-up", async (req, res) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: { username: req.body.username },
        });
        if (findUser) {
            res.status(400).send({ error: "This user already exists" });
        } else {
            const newUser = await prisma.user.create({
                data: {
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password),
                    balance: 0,
                },

            });
            res.send({ user: newUser, token: getToken(newUser.id) });
        }
    } catch (error) {
        //@ts-ignore
        res.send({ error: error.message });
    }
});
app.get("/tickets", async (req, res) => {
   try{ const tickets = await prisma.ticket.findMany({
        include: { User: true }
    })
    res.send(tickets)}catch(error){
        console.log(error)
    }





})
app.post("/ticket", async (req, res) => {
   try{ const newticket = await prisma.ticket.create({
        data: {
            date: req.body.date,
            ammount: req.body.ammount,
            odd: req.body.odd,
            status: "pending",
            payout: req.body.payout,
            userId: req.body.userId
        }
      });
      res.send(newticket)}catch(error){
        console.log(error)
      }
      
  });


app.get("/validate", async (req, res) => {
    try {
        if (req.headers.authorization) {
            const user = await getCurrentUser(req.headers.authorization);
            // @ts-ignore
            res.send({ user, token: getToken(user.id) });
        }
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message });
    }
});




app.listen(port, () => {
    console.log(`Serveri is running on: http://localhost:${port}`);
});