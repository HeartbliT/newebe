function(doc) {
  if("Picture" == doc.doc_type) {
    if(doc.tags === undefined || doc.tags === null) 
      doc.tags = ["all"]
    doc.tags.forEach(function(tag) {
      emit([tag, doc.date], doc);
    });
  }
}

