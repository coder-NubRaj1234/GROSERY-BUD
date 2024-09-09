// select some elemets form html file.................................................................................

const alert = document.querySelector(".alert");
const from = document.querySelector("#form-area");
const input = document.querySelector("#input");
const submit = document.querySelector("#submit");
const itemsContainer = document.querySelector("#items-container");
const clearAllitems = document.querySelector("#clear-btn");
const clearCtnContainer = document.querySelector("#clear-btn-container");
//for eding some varibles.....

let editElement;
let editFlage = false;
let editId = "";

//events here .................

//Submit Event..........................
from.addEventListener("submit", addItem);
//clear items ...............
clearAllitems.addEventListener("click", clearAllItemsfunction);
//setup all items in display............
window.addEventListener("DOMContentLoaded" , setUpItems);

//**************Functions********************************
function addItem(e) {
    e.preventDefault();

    let inputValue = input.value;
    let id = new Date().getTime().toString();

    if (inputValue && !editFlage) {
        createLlistItems(id , inputValue)
        clearCtnContainer.classList.add("visible");
        alertFun("Item Added to the list", "val-sucess");

        //set the data in localStorage ...........
        addToLocalStorage(id, inputValue);

        //set to the default values like input edite..
        setToBackDafult();
    }
    //edit the items..............
    else if (inputValue && editFlage) {
        editElement.innerText = inputValue;
        alertFun("Item was changed !!", "val-sucess");

        editLocalStorage(editId, inputValue);
        setToBackDafult();
    }
    else {
        alertFun("Please Enter Value !!", "val-enter");
    };
};

function alertFun(text, action) {

    input.value = "";
    alert.innerText = text;
    alert.classList.add(`alert-${action}`);

    //remove class Lists

    setTimeout(function () {
        alert.innerText = "";
        alert.classList.remove(`alert-${action}`);
    }, 3000);

};
//delete function............................................................
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement.parentElement;
    const id = element.dataset.id;
    removeItemsFromLocalStorage(id);
    itemsContainer.removeChild(element);

    if (itemsContainer.children.length === 0) {
        clearCtnContainer.classList.remove("visible");
    };

    alertFun("Item removed!!", "val-clear");
    setToBackDafult();
};

//edit the items.......

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement.parentElement;
    editElement = element.firstElementChild;
    let value = editElement.innerText;
    editId = element.dataset.id;
    editFlage = true;

    input.value = value;
    submit.innerText = "Edit";
};
//clear all itrems
function clearAllItemsfunction() {
    const element = itemsContainer.querySelectorAll(".item-list");

    if (element.length > 0) {
        element.forEach(function (item) {
            itemsContainer.removeChild(item);
            clearCtnContainer.classList.remove("visible");
            alertFun("All Data Were Clear.. !!", "val-clear");
        });
    };
    localStorage.removeItem("lists");
    setToBackDafult();
};

//set to the dafult ...........
function setToBackDafult() {
    input.value = "";
    editFlage = false;
    editId = "";
    submit.textContent = "Submit";
}
//add the items in local storage............
function addToLocalStorage(id, value) {
    const grosory = { id, value };
    let lists = getlocalStroageList();
    lists.push(grosory);

    localStorage.setItem("lists", JSON.stringify(lists));
    // console.log(lists)
};

//remove fromlocal storage .....
function removeItemsFromLocalStorage(id) {
    let lists = getlocalStroageList();
    lists = lists.filter(function (item) {
        if (item.id !== id) {
            return item;
        };
    });
    localStorage.setItem("lists", JSON.stringify(lists));
    // console.log(lists);
};
//edit items in localstorage........
function editLocalStorage(id, value) {
    let lists = getlocalStroageList();
    lists = lists.map(function (item) {
        if (item.id === id) {
            item.value = value;
        };
        return item;
    });
    localStorage.setItem("lists", JSON.stringify(lists));
};
//get localStroge lists data........
function getlocalStroageList() {
    return localStorage.getItem("lists") ? JSON.parse(localStorage.getItem("lists")) : [];
};

//set OF All Values

function setUpItems(){
    let lists  = getlocalStroageList();
   if(lists.length > 0){
    lists.forEach(function(item){
        createLlistItems(item.id , item.value); 
    });
    clearCtnContainer.classList.add("visible");
   };
};

function createLlistItems(id , inputValue){

        //create element here..........
    const element = document.createElement("div");
    element.classList.add("item-list");

    //create id attribute..........
    let att = document.createAttribute("data-id");
    att.value = id;

    element.setAttributeNode(att);

    element.innerHTML = `
            <p class="title">${inputValue}</p>
            <div class="button-container">
            <div class="edit">
            <button class="edit-btn"><i class="fa-regular fa-pen-to-square"></i></button>
            </div>
            <div class="delete">
          <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
       </div>
    </div>
`;

    const deleteElm = element.querySelector(".delete-btn");
    const editElm = element.querySelector(".edit-btn");

    deleteElm.addEventListener("click", deleteItem);
    editElm.addEventListener("click", editItem);

    itemsContainer.appendChild(element);
}