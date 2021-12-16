
{
    var collectionName = 'productcategories';

    var collection = db.getCollection(collectionName);
    var existingDocuments = collection.find({});
    var index = 1;
    while(existingDocuments.hasNext()){
        updateDocument(collectionName, existingDocuments.next(), { $set: { DisplayIndex: index++ } })
    }
}