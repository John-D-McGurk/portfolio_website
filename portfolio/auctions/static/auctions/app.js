function card_description_format() { 
    cards = document.querySelectorAll('.card-inner-container');
    cards.forEach((card) => {
        card_description = card.querySelector('.card-description');
        card_header = card.querySelector('.card-header')
        description_top_height = `${card.clientHeight - card_header.clientHeight}px`
        description_height = `${card.clientHeight}px`

        card_description.style.top = description_top_height;
        card_description.style.height = description_height;
    });
}
document.addEventListener('DOMContentLoaded', () => {
   card_description_format();
   window.onload = card_description_format
    addEventListener('resize', () => {
        card_description_format();
    });
});