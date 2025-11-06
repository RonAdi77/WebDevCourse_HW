let currentSkin = 0;
const skins = ['SKINS/dark.css', 'SKINS/basic.css', 'SKINS/modern.css'];

function changeSkin() {
    currentSkin = (currentSkin + 1) % skins.length;
    const linkElement = document.querySelector('link[rel="stylesheet"]');
    linkElement.href = skins[currentSkin];
}

document.querySelector('button').addEventListener('click', changeSkin);