//TODAS LAS FUNCIONES QUE NECESITO Y QUE PUSE EN RESOURCES. LOS HANDLERS

// Models
const { Book } = require('../models');
const { param } = require('../resources/bookResources');
const { validationResult } = require('express-validator');

const getByParameters = (req,res)=>{
  const array = []
  const {query,params} = req

  // Read all books from the model
  Book.getAll((books) => {
  const Parameters=Object.keys(query)
  let book = null

  if(Parameters.includes('guid')){
    book = books.filter(ent => {
      return ent['guid'] == query['guid']});
  }

  if(Parameters.includes('publicationYear')){
    const num = query['publicationYear']
    query['publicationYear'] = parseInt(num)
  }

  //Filter is just one parameter in request
  if(Parameters.length ===1){
    const parameter =  Parameters[0]    
      book = books.filter(ent => {
        if(Array.isArray(ent[parameter])){
          return ent[parameter].includes(query[parameter])
        }
        return ent[parameter] == query[parameter]});
  }

  //Filter with two parameters
  if(Parameters.length ===2){
      book = books.filter(ent => {
        if(Parameters.includes('tags')){
          newParams = Parameters.filter(elem=> elem!=='tags')
          return ent['tags'].includes(query['tags']) && ent[newParams[0]] === query[newParams[0]]
        }

        return ent[Parameters[0]] === query[Parameters[0]] && ent[Parameters[1]] === query[Parameters[1]] });
  }

  //filter with 3 parameters
  if(Parameters.length ===3){
      book = books.filter(ent => {
        if(Parameters.includes('tags')){
          newParams = Parameters.filter(elem=> elem!=='tags')
          return ent['tags'].includes(query['tags']) && ent[newParams[0]] === query[newParams[0]] && ent[newParams[1]] === query[newParams[1]]
        }

        return ent[Parameters[0]] === query[Parameters[0]] && ent[Parameters[1]] === query[Parameters[1]] && ent[Parameters[2]] === query[Parameters[2]] });
  }

  //filter with 4 parameters
  if(Parameters.length ===4){
    book = books.filter(ent => {
      newParams = Parameters.filter(elem=> elem!=='tags')
      return ent['tags'].includes(query['tags']) && ent[newParams[0]] === query[newParams[0]] && ent[newParams[1]] === query[newParams[1]] && ent[newParams[2]] === query[newParams[2]]

      });
}

  if (book) {
    res.send(book);
    res.end()
  } else {
    res.status(404).send({
      message: 'Ups!!! Book not found.',
    });
  }
  });



}
// Fecth all books
const getAll = (req, res) => {
 
  Book.getAll((books) => {
    res.send(books);
  });
}


// Get books by guid
const getByGuid = (req, res) => {
  const { guid } = req.params;
  // Read all books
  Book.getAll((books) => {
    // Filter by guid
    const book = books.find(ent => ent.guid === guid);

    if (book) {
      res.send(book);
    } else {
      res.status(404).send({
        message: 'Ups!!! Book not found.',
      });
    }
  });
};


// Add new book to books

const createBook= (req, res) => {
  let boolean = true
  const { body } = req;
  const {title,author, publicationYear} = body
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
  
  if(title===undefined|author===undefined|publicationYear===undefined){
    return res.send({
      message: 'You are no sending the correct data',
    });

  }
  if(title===''|author===''|publicationYear===''){
    return res.send({
      message: 'Some of your data is incomplete',
    });

  }
  Book.getAll((books) => {
    books.forEach(book => {
      console.log(book.author ,author ,book.title,title,book.publicationYear,publicationYear)
      if(book.author ===author && book.title === title && book.publicationYear === publicationYear ){
        boolean=false
        return res.send({
          message: 'Book alredy Exist!!!',
        });
      }
    });
    // Create new instance
    if(boolean){
      const newBook = new Book(body);
      // Save in db
      newBook.save();
     return res.send({
        message: 'Book successfully created!!!',
        guid: newBook.getGuid(),
      });
    }
  })

};

// Update an existing book
const updateBook = (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { params: { guid }, body } = req;
  // Read all book
  Book.getAll((books) => {
    // Filter by guid
    const book = books.find(ent => ent.guid === guid);

    if (book) {
      Object.assign(book, body);
      Book.update(books);
      res.send({
        message: 'Book successfully updated!!!',
      });
    } else {
      res.status(404).send({
        message: 'Ups!!! Book not found.',
      });
    }
  });
};

// Delete book from bookss
const deleteBook = (req, res) => {
  const { guid } = req.params;
  // Read all book
  Book.getAll((books) => {
    // Filter by guid
    const bookIdx = books.findIndex(ent => ent.guid === guid);

    if (bookIdx !== -1) {
      books.splice(bookIdx, 1);
      Book.update(books);
      res.send({
        message: 'Book successfully deleted!!!',
      });
    } else {
      res.status(404).send({
        message: 'Ups!!! Book not found.',
      });
    }
  });
};

module.exports = {
  getAll,
  getByGuid,
  getByParameters,
  createBook,
  updateBook,
  deleteBook,
};
