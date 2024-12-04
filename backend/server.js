const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb+srv://siddhantjanbandhu18:LiGJ96tyGApJt8tO@cluster0.2qdy1.mongodb.net/google-docs-clone?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const io = require("socket.io")(https://google-docs-clone-main.vercel.app/, {
  cors: {
    origin: "https://google-docs-clone-main-27i2.vercel.app/documents/877a3549-4147-4e7a-8573-94c4ce998a72",
    methods: ["GET", "POST"],
    //   origin: [
    //     "https://library-management-app-brown.vercel.app", 
    //     "https://library-management-cn0w6owri-siddhant-janbandhus-projects.vercel.app"
    // ], // Allow both origins
    // methods: ["POST", "GET", "PUT", "DELETE"], // Allowed HTTP methods
    // credentials: true, // Allow cookies to be sent
  },
})

const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}
