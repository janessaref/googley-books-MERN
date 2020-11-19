import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import Results from "../components/Results"
import APIbooks from '../utils/booksAPI'
import Jumbotron from "../components/Jumbotron";
import "./style.css";


function Search() {

    const [searchState, setSearchState] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalClass, setModalClass] = useState("modal hideModal");
    const [text, setText] = useState("Saved!");
    const [ids, setIds] = useState([]);

    useEffect(() => {
    }, [modalClass]);

    function modalClose() {
        setModalClass("modal hideModal");
    }


    const handleSearchChange = (e) => {
        const { value } = e.target
        setSearchState(value)
        console.log(searchState)
    };


    const searchBooks = async () => {

        let newBooks = await APIbooks.getBooks(searchState)
            .then((res) => {
                setLoading(false);
                return res.data.items;
            })
        // console.log("newBooks: ", newBooks);
        console.log("newBooks", newBooks);
        setBooks(newBooks);
    }

    const saveBook = (book) => {
        // console.log("savebook: ", book);
        var image;
        if (book.volumeInfo.imageLinks === undefined) {
            image = "./googlebookslogo.png"
        } else {
            image = book.volumeInfo.imageLinks.thumbnail
        }
        
        console.log("book id: ", book.id);
        if(!ids.includes(book.id)){
            setIds([...ids, book.id]);
            setModalClass("modal showModal");
            setText(book.volumeInfo.title + " was saved!");
        }else{
            setModalClass("modal showModal");
            setText(book.volumeInfo.title + " is already saved!");
        }
        // APIbooks.getApiBooks()
        //     .then(res => {
        //         // saved.push(res.data.id);
        //         console.log("save response: ", res);
        //         // console.log("saved ids: ", saved)
        //         if (res.data.includes(book.id)) {
        //             setModalClass("modal showModal");
        //             setText(book.volumeInfo.title + " is already saved!");
        //         } else {
        //             setModalClass("modal showModal");
        //             setText(book.volumeInfo.title + " was saved!");
        //         }
        //     })


        const data = {
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors,
            description: book.volumeInfo.description,
            image: image,
            link: book.volumeInfo.infoLink,
            id: book.id
        }

        APIbooks.addBook(data).then(res => {
            console.log("saved", res)


        }).then(err => {
            console.log("error", err);

        });
    }



    return (
        <div>
            <Navbar />
            <Jumbotron />

            <SearchBar
                handleSearchChange={handleSearchChange}
                searchBooks={searchBooks} />
            <Results
                data={books}
                saveBook={saveBook}
                modalClose={modalClose}
                text={text}
                modalClass={modalClass}
            />


        </div>
    )
}

export default Search;