const date = new Date();

const year = date.getFullYear();
const month = date.getMonth() + 1;
let b;

switch (month) {
    case 1: b = "Jan";
        break;
    case 2: b = "Feb";
        break;
    case 3: b = "Mar";
        break;
    case 4: b = "Apr";
        break;
    case 5: b = "May";
        break;
    case 6: b = "June";
        break;
    case 7: b = "July";
        break;
    case 8: b = "Aug";
        break;
    case 9: b = "Sept";
        break;
    case 10: b = "Oct";
        break;
    case 11: b = "Nov";
        break;
    case 12: b = "Dec";
        break;
}

const day = date.getDate();


const d = document.querySelector(".date p");
d.innerText = `${day} ${b}, ${year}`

// reload button
const reload = document.querySelector('#re');
reload.addEventListener('click', () => {
    window.location.reload(true);
})
