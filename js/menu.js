const hamburger = document.querySelector('.hamburger');
const navlinks = document.querySelector('.navlinks');
const navlinksli = document.querySelectorAll('.navlinks li');
const line1 = document.querySelector('.line1');
const line2 = document.querySelector('.line2');
const line3 = document.querySelector('.line3');
const cta = document.querySelector('.cta');

hamburger.addEventListener('click',()=>{
    navlinks.classList.toggle('open');
    line1.classList.toggle('close');
    line2.classList.toggle('close');
    line3.classList.toggle('close');
    cta.classList.toggle('fade');
    navlinksli.forEach(link =>{
        link.classList.toggle('fade');
    });
});


const loginForm=document.querySelector(".loginwindow");
const signupForm=document.querySelector(".signupwindow");

function openLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
}
function openSignupForm() {
    signupForm.style.display = "flex";
}
    
function closeForm() {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
}