import { UPLOAD_URL } from "./config.js";
import { fetchAndCreateFile } from "./ddingers-fetch.js";
import { logger } from "./mylogger.js";
import { upload } from "./ddingers-upload.js";





fetchAndCreateFile("listings")
    .then(() => {
        logger.info("Fetch Complete")
        upload("listings")
        .then(() => logger.info("Upload Complete"))
    })
    .catch(err => console.log("CompletE Error",err))


