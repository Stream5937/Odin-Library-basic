//globals
const myLibrary = [];
const libraryRemoved = [];
let bookCount = 0; 
const ulist = document.querySelector('ul');

/*----------------  event listeners  -----------------*/
const addBook = document.querySelector('.add');  //show form to add new book
const create = document.querySelector('.new');  //create new book from form data
const library = document.querySelector('.books>ul'); //the library list


/*----------------  object constructor  -------------------*/
// a book object constructor access via key word new
function Book(title, author, pages, read) {
  //cater for incorrect invocation i.e not using 'new' keyword
	if(!(this instanceof Book)) {
	     //throw error:
	     //throw Error('Error: Incorrect invocation');
	     //or
	     //return new book:
	     return new Book(title, author, pages, read);
	 }else{
    this.bookNumber = ++bookCount;    //first = book 1
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read=read;
    this.info= function() {
        let msgRead = this.read ? 'read':'not read yet';
        const info = `${this.title} by ${this.author}, ${this.pages} pages, ${msgRead}`;
        return info;
    }
  }
}

/*---------------  prototype functions  ------------------*/
Book.prototype.toggleRead = function() {
  console.log('at prototype: this is: '+ JSON.stringify(this));
  console.log(this.read);
  this.read = this.read ? false : true;   //swap existing value true -> false -> true;
  console.log(this.read);
}

/*----------------  functions  -------------------*/

function addBookToLibrary(Book) {
  //bookCount++;
  myLibrary.push(Book);
  showBook(Book);
  
}

function displayBooks() {
    for(Book in myLibrary){
      showBook(Book);
      
    } 
}

/* ALTERNATIVE WITH BUTTON POSITIONS */
function showBook(book){
    // create li & span & variables
    let li = document.createElement('li');
    li.classList.add('card');
    li.appendChild(addHeaderBtn(book.bookNumber));
    li.appendChild(addPara('Title', book.title));
    li.appendChild(addPara('Author', book.author));
    li.appendChild(addPara('Pages', book.pages));
    li.appendChild(addParaBtn('Read', book.read , book.bookNumber));
   
    ulist.appendChild(li);
}

function addHeaderBtn(bookNumber) {
  let p = document.createElement('p');
  let he = document.createElement('h2');
  let btn = document.createElement('button');
  btn.textContent='Delete';
  btn.classList.add('btnDelete');
  btn.dataset.bookNum = bookNumber;
  he.textContent='Book number: '+ bookNumber;
  p.appendChild(he);
  p.appendChild(btn);
  return p;
}

function addPara(label, item){
  let pa = document.createElement('p');
  let sp = document.createElement('span');
  pa.textContent=(label+":");
  pa.classList.add(label.toLowerCase());
  sp.textContent=item;
  pa.appendChild(sp);
  return pa;
}

function addParaBtn(label, item, bookNumber){
  let pa = document.createElement('p');
  let sp = document.createElement('span');
  pa.textContent=(label+":");
  pa.classList.add(label.toLowerCase());
  sp.textContent=item;
  pa.appendChild(sp);
  let btn = document.createElement('button');
  btn.textContent='Toggle';
  btn.classList.add('btnRead');
  btn.dataset.bookNum = bookNumber;
  pa.appendChild(btn);
  return pa;
}


function logData(book) {
  console.log("new book created from data submitted: ");
  console.log(`Book Title:  ${book.title}`);
  console.log(`Author:  ${book.author}`);
  console.log(`Number of pages:  ${book.pages}`);
  console.log(`I have read yet?:  ${book.read}`);
  console.log(`Total Books registered to Library number ${bookCount}`);
  console.log(`Books available in Library now number ${myLibrary.length}`);
  console.log(`Books removed from  Library now number ${libraryRemoved.length}`);
}

/*----------------  button  actions  -----------------------*/

//show form for new book entry
addBook.addEventListener('click', e =>{
  //display for for new book entry
  const form = document.querySelector('#bookForm');
  form.style.display= 'grid';
  addBook.style.display='none';
});


//create new book from form data and add to library
create.addEventListener('click', e =>{
  //create new book built from form data
  const title = document.querySelector('#book-title'); 
  const author = document.querySelector('#author');
  const pages = document.querySelector('#pages'); 
  const read = document.querySelector('#read'); 

  let readValue = false;
  if (read.checked) { readValue = true; }
  //check all data available
  if((title.value != '')&&(author.value != '')&&(pages.value > 0)) {
    console.log('All data has been entered');
    let newBook = new Book(title.value, author.value, pages.value, readValue);
    addBookToLibrary(newBook);
    logData(newBook);
    //hide the form
    const form = document.querySelector('#bookForm');
    form.style.display= 'none';
    //clear form data
    title.value = "";
    author.value = "";
    pages.value = 0;
    read.checked= false;
    addBook.style.display='grid';
  }else{
    console.log('Some data is missing');
    //display dialogue box
    const dialog = document.getElementById("dialog");
    dialog.style.display= 'grid';
    //add close button
    const closeButton = document.querySelector(".dialogbutton");
    closeButton.addEventListener("click", () => {
      dialog.style.display='none';
      console.log("closing dialog");
    });
  }
});


//capture by event bubling book button clicks
library.addEventListener('click', event =>{
  //console.log(event);
  let e = event.target.closest('button');
  //console.log(e);
  if (!e) return;
  //console.log('must be still here at e');
  //console.log(e.tagName);
  if (e.tagName != 'BUTTON') return;
  //console.log('must be still here at e.tagname');
  //console.log(this);  //is window!
  //NB all book numbers unique and not repeated
  //console.log('Book number = ' + e.dataset['bookNum']);
  //console.log('button classList: '+ e.classList);
  
  //check if just clicked book delete button
  if(e.classList.contains('btnDelete')){
    let bookNumber = parseInt(e.dataset['bookNum']);
    //console.log('e.dataset.bookNum is ' + e.dataset['bookNum']);
    //console.log('bookNumber is '+bookNumber);
    let libIndex = null;
    for (book in myLibrary) {
     // console.log(JSON.stringify(myLibrary[book]));
     // console.log(e.dataset);
      
      if(Object.values(myLibrary[book]).includes(bookNumber)){
       libIndex = book;
        //console.log(`found lib index = ${libIndex} also == book is ${book}`);
      }
      
    }
    
    console.log(`deleting ${bookNumber} at myLibrary[${libIndex}]`);
    console.log('my library (before delete):' + JSON.stringify(myLibrary));
    console.log('library removed (before delete): ' + JSON.stringify(libraryRemoved));
  
    libraryRemoved.push(myLibrary.splice((libIndex),1));

    console.log('my library now:' + JSON.stringify(myLibrary));
     console.log('library removed: ' + JSON.stringify(libraryRemoved));
      
    let parent = e.parentNode;
    let element = parent.parentNode;
    let bknum = e.dataset.bookNum;
    //console.log('bknum = ' +bknum);
    element.parentNode.removeChild(element);
    //--bookCount;  //retain unique book number
    //displayBooks();
  }
  if(e.classList.contains('btnRead')){

    let bookNumber = parseInt(e.dataset['bookNum']);
    //console.log('e.dataset.bookNum is ' + e.dataset['bookNum']);
    //console.log('bookNumber is '+bookNumber);
    let libIndex = null;
    for (book in myLibrary) {
     // console.log(JSON.stringify(myLibrary[book]));
     // console.log(e.dataset);
      
      if(Object.values(myLibrary[book]).includes(bookNumber)){
        libIndex = book;
        //console.log(`found lib index = ${libIndex} also == book is ${book}`);
        console.log('read- before : ' + myLibrary[libIndex].read );
        //call prototype function toggleRead()
        myLibrary[libIndex].toggleRead();
        console.log('read- after : ' + myLibrary[libIndex].read );
        let parent = e.parentNode;
        let element = parent.parentNode;
        parent.parentNode.removeChild(parent);
        element.appendChild(addParaBtn('Read', myLibrary[libIndex].read, myLibrary[libIndex].bookNumber));
      }
    
    }
    
  }
});




/*----------------  Actions  -------------------*/
//example output: The Hobbit by J.R.R. Tolkien, 295 pages, not read yet"
//instantiate some books
const book1 = new Book('The Hobbit', 'J.R.R. Tolkein', 295, true);
const book2 = new Book("1000 years of Joys and Sorrows", 'Ai Weiwei' , 380, false );

//add books to library
addBookToLibrary(book1);
addBookToLibrary(book2);


