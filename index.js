window.onload = function () {
  let addButton = document.getElementById("addBook");
  let library = document.getElementById("library");
  let failedCounter = document.getElementById("failedCounter");
  let failedMessage = document.getElementById("failedMessage");

  let url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
  let apiKey;
  let failedCalls = 0;

  authenticate();

  function incrementFails(err) {
      failedCalls++;
      failedCounter.innerHTML = failedCalls;
      failedMessage.innerHTML = err;
  }

  function listBooks() {
      fetch("https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=b7db74bba79e429784d1f27fe4eb9030")
      .then(res=>{
        return res.json();
      })
      .then(json=>{
        json.results.forEach(function(book) {
            addBook({title: book.title, author: book.author});
        });
      })
  }

  function authenticate() {
      fetch(url + "requestKey")
      .then(res=>{
          return res.json();
      })
      .then(json=>{
          if(json.status == "success") {
             apiKey = json.key;
             listBooks();
          }
          else {
              incrementFails(json.message);
          }
      });
  }

  function modifyBook(data) {
      console.log("Modify Data:");
      console.log(data);
      let dataUrl = url + "op=update&key=" + apiKey + "&id=" + data.id;
      if(data.title) {
          dataUrl += "&title=" + data.title;
      }
      if(data.author) {
          dataUrl += "&author=" + data.author;
      }

      fetch(dataUrl, {method: "POST"})
      .then(res=>{
          return res.json();
      })
      .then(json=>{
          if(json.status == "success") {
              viewBooks();
          }
          else {
              incrementFails(json.message);
          }
      })
  }

  function viewBooks() {
      fetch(url + "op=select&key=" + apiKey)
      .then(res=>{
          return res.json();
      })
      .then(json=>{
          if(json.status == "success") {
            library.innerHTML = "";

            for(i=0; i<json.data.length; i++){
                  let bookDiv = document.createElement("div");
                  bookDiv.id = json.data[i].id;
                  bookDiv.innerHTML = "<p class='author'><input class='hidden' /><span>" + json.data[i].author + "</span></p>";
                  bookDiv.innerHTML += "<p class='title'><input class='hidden' /><span>" + json.data[i].title + "</span></p>";

                  let del = document.createElement("button");
                  del.innerHTML = "Delete Book";
                  del.classList.add("delete");
                  bookDiv.appendChild(del);
                  del.addEventListener("click", function() {
                      deleteBook(del.parentNode.id);
                  });

                  library.appendChild(bookDiv);

                  let author = bookDiv.getElementsByClassName("author")[0];

                  author.addEventListener("click", function() {
                      let input = author.getElementsByTagName("input")[0];
                      let span = author.getElementsByTagName("span")[0];

                      input.value = span.innerHTML;
                      input.classList.remove("hidden");
                      span.classList.add("hidden");
                      input.focus();


                      input.addEventListener("blur", function() {
                          span.innerHTML = input.value;
                          span.classList.remove("hidden");
                          input.classList.add("hidden");
                          modifyBook({id: json.data[i].id, author: authorInput.value});
                          console.log("Modified Book");
                      });
                  })

                  let title = bookDiv.getElementsByClassName("title")[0];

                  title.addEventListener("click", function(){
                    let input = title.getElementsByTagName("input")[0];
                    let span = title.getElementsByTagName('span')[0];

                    input.value = span.innerHTML;
                    input.classList.remove("hidden");
                    span.classList.add("hidden");
                    input.focus();

                    input.addEventListener("blur", function(){
                      span.innerHTML = input.value;
                      span.classList.remove("hidden");
                      input.classList.add("hidden");
                      modifyBook({id: json.data[i].id, title: titleInput.value});
                      console.log("Modified Book");
                    });
                  })

              }
          }
          else {
              incrementFails(json.message);
          }
      });
  }

  function addBook(data) {
      fetch(url + "op=insert&key=" + apiKey + "&title=" + data.title + "&author=" + data.author, {method: "POST"})
      .then(res=>{
          return res.json();
      })
      .then(json=>{
          if(json.status == "success") {
              console.log("Added book");
              viewBooks();
          }
          else {
              incrementFails(json.message);
          }
      });
  }

  function deleteBook(id) {
      console.log(id);
      fetch(url + "op=delete&key=" + apiKey + "&id=" + id)
      .then(res=>{
          return res.json();
      })
      .then(json=>{
          if(json.status == "success") {
              console.log("Deleted book");
              library.removeChild(document.getElementById(id));
          }
          else {
              incrementFails(json.message);
          }
      })
  }

  addButton.addEventListener("click", function() {
      let author = document.getElementById("author").value;
      let title = document.getElementById("title").value;

      addBook({author: author, title: title});
  });

}
