const IMAGE_SIZE = {
    start: [3480, 4640],
    harbor: [4640, 3480],
    cave: [4640, 3480],
    city: [3456, 4608],
    hotel: [4608, 3456],
    'city-night': [4608, 3456],
};

const CLICK_AREA_POS_SIZE = {
    start: {
        harbor: {
            top: 0.35,
            left: 0,
            height: 0.2,
            width: 0.2,
        },
        cave: {
            top: 0.25,
            left: 0.8,
            width: 0.2,
            height: 0.2,
        },
        city: {
            top: 0.45,
            left: 0.2,
            width: 0.5,
            height: 0.4,
        },
        hotel: {
            top: 0.25,
            left: 0.6,
            width: 0.2,
            height: 0.2,
        },
        'city-night': {
            top: 0.25,
            left: 0.2,
            width: 0.4,
            height: 0.2,
        },
    },
};

let STATE;

function addTogether(a, b) {
    return a + b;
}

function State(stateElement) {
    const self = this;
    const state = {
        harbor: 0,
        cave: 0,
        city: 0,
        hotel: 0,
        'city-night': 0,
    };
    const maxScore = Object.values(state).length;

    self.update = (target) => {
        if (typeof target === 'string') {
            state[target] = 1;
        } else {
            try {
                const targetName = Object.keys(state)
                    .filter((key) => target.classList.contains(key))
                    .pop();

                if (targetName) {
                    state[targetName] = 1;
                }
            } catch (e) {
                // pass
            }
        }

        const currentScore = Object.values(state).reduce(addTogether);
        stateElement.innerHTML = `Du hast ${currentScore} von ${maxScore} Bildern gefunden.`;
    };

    self.update();
}

function clickAreaHandler(target) {
    let targetImageContainer = target;

    if (typeof target === 'string') {
        targetImageContainer = document.querySelector(`.image.${target}`);
    }

    STATE.update(target);
    window.scrollTo(targetImageContainer.offsetLeft, targetImageContainer.offsetTop);
}

function initSingleClickArea(imageName, clickAreaDefinition) {
    const [
        clickAreaName,
        {
            top,
            left,
            height,
            width,
        },
    ] = clickAreaDefinition;
    const [imageWidth, imageHeight] = IMAGE_SIZE[imageName];
    const imageRatio = imageWidth / imageHeight;
    const imageContainer = document.querySelector(`.image.${imageName}`);
    const clickArea = imageContainer.querySelector(`.click-area.${clickAreaName}`);
    const imageContainerWidth = imageContainer.clientWidth;
    const imageContainerHeight = imageContainer.clientHeight;
    const imageContainerRatio = imageContainerWidth / imageContainerHeight;

    let imageOffsetLeft = 0;
    let imageOffsetTop = 0;
    let resizeFactor = 1;

    if (imageRatio < imageContainerRatio) {
        resizeFactor = imageContainerHeight / imageHeight;
        imageOffsetLeft = (imageContainerWidth - imageWidth * resizeFactor) / 2;
    } else if (imageRatio > imageContainerRatio) {
        resizeFactor = imageContainerWidth / imageWidth;
        imageOffsetTop = (imageContainerHeight - imageHeight * resizeFactor) / 2;
    }

    clickArea.style.left = `${imageOffsetLeft + left * imageWidth * resizeFactor}px`;
    clickArea.style.top = `${imageOffsetTop + top * imageHeight * resizeFactor}px`;
    clickArea.style.width = `${width * imageWidth * resizeFactor}px`;
    clickArea.style.height = `${height * imageHeight * resizeFactor}px`;

    clickArea.addEventListener('click', clickAreaHandler.bind(undefined, clickAreaName));
}

function initClickAreas(clickAreaDefinitions) {
    const [imageName, clickAreas] = clickAreaDefinitions;

    Object.entries(clickAreas)
        .forEach(initSingleClickArea.bind(undefined, imageName));
}

function initImageContainer(startImage, imageContainer) {
    const closeButton = document.createElement('div');

    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', clickAreaHandler.bind(undefined, startImage));

    imageContainer.appendChild(closeButton);
}

function init() {
    Object.entries(CLICK_AREA_POS_SIZE).forEach(initClickAreas);

    const startImage = document.querySelector('.image.start');
    const images = document.querySelectorAll('.image:not(:first-child)');

    images.forEach(initImageContainer.bind(undefined, startImage));
}

function initState() {
    STATE = new State(document.querySelector('.state'));
}

window.addEventListener('load', init);
window.addEventListener('load', initState);
window.addEventListener('orientationchange', init);
window.addEventListener('resize', init);
