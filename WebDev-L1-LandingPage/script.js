const burgerImages = document.querySelectorAll('.burger img');
const toggleImages = document.querySelectorAll('.burger-toggle img');
let currentIndex = 0;

toggleImages[currentIndex].classList.add('active');

burgerImages.forEach((img, index) => {
img.addEventListener('click', () => {
toggleImages.forEach(toggleImg => toggleImg.classList.remove('active'));
toggleImages [currentIndex].classList.add('active');
toggleImages [currentIndex].src = burgerImages [index].src;
currentIndex = (currentIndex + 1) % toggleImages.length;
});
});
function createStars(){
	const starsContainer = document.getElementById('stars');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    for (let i=0; i < 100; i++) {
    	const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * windowWidth}px`;
        star.style.top = `${Math.random() * windowHeight}px`;
        starsContainer.appendChild(star);
    }
}
window.addEventListener('load',createStars);
