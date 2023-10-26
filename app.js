require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const express = require("express");

var cors = require("cors");
const app = express();

//connectDB
const connectDB = require("./db/connect");
//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticateUser = require("./middleware/authentication");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit);
// extra packages

// routes
// routes
app.get("/", (req, res) => {
    res.send("jobs api");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
