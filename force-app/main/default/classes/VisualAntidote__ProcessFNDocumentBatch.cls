/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ProcessFNDocumentBatch implements Database.Batchable<VisualAntidote.FNDocument> {
    global VisualAntidote.ProcessFNDocumentBatch.FNDocumentIterable fnDocIterable {
        get;
        set;
    }
    global ProcessFNDocumentBatch(Map<String,String> fieldMap) {

    }
    global void execute(Database.BatchableContext BC, List<VisualAntidote.FNDocument> scope) {

    }
    global void finish(Database.BatchableContext BC) {

    }
    global System.Iterable start(Database.BatchableContext info) {
        return null;
    }
global class FNDocumentIterable implements System.Iterable<VisualAntidote.FNDocument> {
    global VisualAntidote.ProcessFNDocumentBatch.FNDocumentIterator fnDocIterator {
        get;
        set;
    }
    global FNDocumentIterable(Map<String,String> fieldMap) {

    }
    global System.Iterator Iterator() {
        return null;
    }
}
global class FNDocumentIterator implements System.Iterator<VisualAntidote.FNDocument> {
    global FNDocumentIterator(Map<String,String> fieldMap) {

    }
    global Boolean hasNext() {
        return null;
    }
    global VisualAntidote.FNDocument next() {
        return null;
    }
}
}
