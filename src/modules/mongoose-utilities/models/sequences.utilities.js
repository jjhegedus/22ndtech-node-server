function createSequence(sequenceName){
    var sequence = null;
    
    if (sequenceExists(sequenceName)) {
        print(sequenceName + " already exists");
    } else {
        
        print("creating " + sequenceName);
    
        db.sequences.insertOne({ sequenceName: sequenceName, nextVal: 1 })
    
        sequence = getSequence(sequenceName);
    
        if(sequence){
            print(sequenceName + " created");
            printjson(sequence);
            return true;
        } else {
            return false;
        }
    }
}

function getSequence(sequenceName) {
    var sequence = null;
    var sequences = db.sequences.find({ sequenceName: sequenceName });

    while (sequences.hasNext()) {
        if (sequence != null) {
            throw "Too many " + sequenceName + " records";
        }
    
        sequence = sequences.next();
    }    

    return sequence;
}

function sequenceExists(sequenceName){
    if(getSequence(sequenceName)){
        return true;
    } else {
        return false;
    }
}
