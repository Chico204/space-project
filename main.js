const hamburger = document.querySelector('.hamburger')
const mobile = document.querySelector('.mobile-menu')
hamburger.addEventListener('click',function(){
    mobile.classList.toggle('active')
})

const btns = document.querySelectorAll('.tab-btn')
const about = document.querySelector('.about')
const articles = document.querySelectorAll('.content')
about.addEventListener('click', function(e){
    const id = e.target.dataset.id
    if(id){
        btns.forEach(function(btn){
            btn.classList.remove('acti')
            e.target.classList.add('acti')
        })
        articles.forEach(function(article){
            article.classList.remove('activ')

        })
        const element = document.getElementById(id)
        element.classList.add('activ')
    }
})