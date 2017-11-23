window.onload = function () {
  let addButton = document.getElementById("addBook");
  let library = document.getElementById("library");
  let failedCounter = document.getElementById("failedCounter");

  let url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
  let apiKey;
  let failedCalls = 0;

  authenticate();

  function listBooks() {
      let req = new XMLHttpRequest();
      req.open("GET", "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=b7db74bba79e429784d1f27fe4eb9030");

      req.onreadystatechange = function() {
          if(req.status == 200 && req.readyState == 4) {
              let bookList = JSON.parse(req.response).results;
              bookList.forEach(function(book) {
                  addBook({title: book.title, author: book.author});
              });

              viewBooks();
          }
      }
      req.send();
  }

  function authenticate() {
      let req = new XMLHttpRequest();
      req.open("GET", url + "requestKey");

      req.onreadystatechange = function() {
          if(req.status == 200 && req.readyState == 4) {
              apiKey = JSON.parse(req.response).key;
              listBooks();
          }
      }
      req.send();
  }

  function modifyBook(data) {
      let req = new XMLHttpRequest();
      req.open("POST", url + "op=update&key=" + apiKey + "&id=" + data.id + "&title=" + data.title + "&author=" + data.author);

      req.onreadystatechange = function () {
        if(req.readyState == 4 && req.status == 200){
            viewBooks();
        }
      }

      req.send();
  }

  function viewBooks() {
      let req = new XMLHttpRequest();
      req.open("GET", url + "op=select&key=" + apiKey);
      req.onreadystatechange = function() {
          if(req.readyState == 4 && req.status == 200 && JSON.parse(req.response).status == "success") {
              let books = JSON.parse(req.response).data;

              books.forEach(function(book) {
                console.log(book.title);
                  let bookDiv = document.createElement("div");
                  bookDiv.innerHTML = "<input class'titleInput hidden' type='text' value=" + book.title + " />";
                  bookDiv.innerHTML += "<h3 class='titleText'>" + book.title + "</h3>";
                  bookDiv.innerHTML += "<input class='authorInput hidden' type='text' value=" + book.author + " />";
                  bookDiv.innerHTML += "<p class='authorText'>" + book.author + "</p>";
                  bookDiv.id = book.id;


                  let del = document.createElement("button");
                  del.innerHTML = "Delete Book";
                  del.classList.add("delete");
                  del.addEventListener("click", function() {
                      deleteBook(book.id);
                  });

                  bookDiv.appendChild(del);

                  let authorText = bookDiv.getElementsByClassName("authorText")[0];
                  let authorInput = bookDiv.getElementsByClassName("authorInput")[0];

                  authorText.addEventListener("click", function() {
                      authorText.classList.add("hidden");
                      authorInput.classList.remove("hidden");

                      authorInput.value = authorText.innerHTML;
                  });

                  authorInput.addEventListener("onblur", function() {
                      modifyBook({id: book.id, author: authorInput.value, title: titleInput.value});

                      authorText.classList.remove("hidden");
                      authorInput.classList.add("hidden");
                  });

                  let titleText = bookDiv.getElementsByClassName("titleText")[0];
                  let titleInput = bookDiv.getElementsByClassName("titleInput")[0];

                  titleText.addEventListener("click", function(){
                      titleText.classList.add("hidden");
                      titleInput.classList.remove("hidden");
                      titleInput.value = titleText.innerHTML;
                  });

                      titleInput.addEventListener("onblur", function(){
                      modifyBook({id: book.id, title: titleInput.value, author: authorInput.value});

                      titleText.classList.remove("hidden");
                      titleInput.classList.add("hidden");
                  });


                  library.appendChild(bookDiv);
              });
          }
      }

      req.send();
  }

  function addBook(data) {
      let req = new XMLHttpRequest();
      req.open("POST", url + "op=insert&key=" + apiKey + "&title=" + data.title + "&author=" + data.author);
      req.onreadystatechange = function () {
        if(req.readyState == 4 && req.status == 200){
            if(JSON.parse(req.response).status == "success"){


            }
            else {
                failedCalls++;
                failedCounter.innerHTML = failedCalls;
            }
        }
      }

      req.send();
  }

  function deleteBook(id) {

  }

  addButton.addEventListener("click", function() {
      let author = document.getElementById("author").value;
      let title = document.getElementById("title").value;

      addBook({author: author, title: title});
  });

}
