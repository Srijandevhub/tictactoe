const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyparser = require("body-parser");
const databaseConfig = require("./databaseConfig");
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(bodyparser.json());
app.use(cors());
app.use("/game", require("./routes/gameRoute"));
app.get("/getuid", (req, res) => {
    const uniqueGUID = generateGUID();
    res.json(uniqueGUID);
})
function generateGUID() {
    return uuidv4();
}
databaseConfig(process.env.URI);
app.listen(process.env.PORT, () => {
    console.log(`Server Connected at ${process.env.PORT}`);
})