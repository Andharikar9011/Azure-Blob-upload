if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
      express = require('express')
    , router = express.Router()

    , multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('file')

    , azureStorage = require('azure-storage')
    , blobService = azureStorage.createBlobService()

    , getStream = require('into-stream')
    
;

const handleError = (err, res) => {
    res.status(500);
    res.render('error', { error: err });
};



router.post('/', uploadStrategy, (req, res) => {
    // console.log(req);
    // console.log(req);
    // console.log(req.body.userid);
    // console.log(req.body.Type);
    var filetype =req.body.Type;
    var cid;
    const d= new Date();
    var timestamp=d.getTime();
     if (filetype=="Image"){
         cid = "imagestorage";
     }else if(filetype=="Video"){
        cid = "videostorage";
     }else if(filetype=="Document"){
        cid = "documentstorage";
     }else if(filetype=="Pdf"){
        cid = "pdfstorage";
     }else{
         cid="extrastorage"
     }
    const
          blobName =(req.file.originalname+' '+timestamp)
        , stream = getStream(req.file.buffer)
        , streamLength = req.file.buffer.length
    ;

    blobService.createBlockBlobFromStream(cid, blobName, stream, streamLength, err => {

        if(err) {
            handleError(err);
            return;
        }

        res.render('success', { 
            message: 'File uploaded to Azure Blob storage.' 
        });
    });
});

module.exports = router;