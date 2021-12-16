
function addNewDocument(collectionName, document){
    var collection = db.getCollection(collectionName);
    var existingDocuments = collection.find(document);
    if(existingDocuments.hasNext()){
        print("document already exists in collection " + collectionMame);
        printjson(document);
        throw "document already exists in collection " + collectionName;
    } else {
        collection.insertOne(document);
    }
}

function updateDocument(collectionName, filter, command){
    var collection = db.getCollection(collectionName);

    printjson(collection.update(filter, command));
}


function updateManyDocuments(collectionName, filter, command){
    var collection = db.getCollection(collectionName);

    printjson(collection.updateMany(filter, command));
}