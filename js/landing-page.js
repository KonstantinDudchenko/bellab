document.addEventListener("DOMContentLoaded", () => {

    /*
     * Находим все секции со слайдерами
     */

    const sliders =
        document.querySelectorAll("[data-project-slider]");


    sliders.forEach(section => {

        initProjectSlider(section);

    });


});


/*
 * Инициализация одного слайдера
 */

async function initProjectSlider(section) {

    /*
     * Получаем путь к JSON
     */

    const jsonFile =
        section.dataset.projectSlider;


    /*
     * Элементы внутри конкретной секции
     */

    const slidesContainer =
        section.querySelector(".landing-slides");

    const dotsContainer =
        section.querySelector(".landing-dots");

    const prevButton =
        section.querySelector(".landing-arrow-prev");

    const nextButton =
        section.querySelector(".landing-arrow-next");

    const projectTitle =
        section.querySelector(".landing-project-info h4");

    const projectDescription =
        section.querySelector(".landing-project-info p");

    const featuresContainer =
        section.querySelector(".landing-features");

    const suitableContainer =
        section.querySelector(".landing-suitable span");


    /*
     * Проверяем обязательные элементы
     */

    if (!slidesContainer) {
        console.error(
            "Не найден .landing-slides",
            section
        );

        return;
    }


    /*
     * Переменные слайдера
     */

    let projects = [];

    let currentIndex = 0;


    /*
     * Загрузка JSON
     */

    try {

        const response =
            await fetch(jsonFile);


        if (!response.ok) {

            throw new Error(
                `Не удалось загрузить ${jsonFile}`
            );

        }


        const data =
            await response.json();


        /*
         * Получаем проекты
         */

        projects =
            data.projects || [];


        /*
         * Проверяем наличие проектов
         */

        if (projects.length === 0) {

            throw new Error(
                `В ${jsonFile} нет проектов`
            );

        }


        /*
         * Заполняем возможности
         */

        if (
            featuresContainer &&
            Array.isArray(data.features)
        ) {

            featuresContainer.innerHTML =
                data.features
                    .map(feature => `
                        <li>
                            <i class="bi bi-check2"></i>
                            <span>${feature}</span>
                        </li>
                    `)
                    .join("");

        }


        /*
         * Заполняем "Подходит"
         */

        if (
            suitableContainer &&
            data.suitable
        ) {

            suitableContainer.textContent =
                data.suitable;

        }


        /*
         * Создаём слайды
         */

        createSlides();


        /*
         * Создаём точки
         */

        createDots();


        /*
         * Показываем первый слайд
         */

        updateSlider();


    }
    catch (error) {

        console.error(error);


        slidesContainer.innerHTML = `
            <div class="landing-error">
                Не удалось загрузить проекты.
            </div>
        `;


        return;

    }


    /*
     * ==========================================
     * СОЗДАНИЕ СЛАЙДОВ
     * ==========================================
     */

    function createSlides() {

        slidesContainer.innerHTML =
            projects
                .map((project, index) => {

                    return `
                        <div
                            class="landing-slide"
                            data-index="${index}">

                            <img
                                src="${project.image}"
                                alt="${project.title}"
                                loading="${
                                    index === 0
                                        ? "eager"
                                        : "lazy"
                                }">

                        </div>
                    `;

                })
                .join("");

    }


    /*
     * ==========================================
     * СОЗДАНИЕ ТОЧЕК
     * ==========================================
     */

    function createDots() {

        if (!dotsContainer) {
            return;
        }


        dotsContainer.innerHTML =
            projects
                .map((_, index) => {

                    return `
                        <button
                            type="button"
                            class="landing-dot"
                            data-index="${index}"
                            aria-label="Проект ${index + 1}">
                        </button>
                    `;

                })
                .join("");


        /*
         * Обработчик клика по точке
         */

        dotsContainer
            .querySelectorAll(".landing-dot")
            .forEach(dot => {

                dot.addEventListener(
                    "click",
                    () => {

                        currentIndex =
                            Number(
                                dot.dataset.index
                            );

                        updateSlider();

                    }
                );

            });

    }


    /*
     * ==========================================
     * ОБНОВЛЕНИЕ СЛАЙДЕРА
     * ==========================================
     */

    function updateSlider() {

        const slides =
            slidesContainer
                .querySelectorAll(
                    ".landing-slide"
                );


        /*
         * Сбрасываем классы
         */

        slides.forEach(slide => {

            slide.classList.remove(
                "active",
                "previous",
                "next"
            );

        });


        /*
         * Активный слайд
         */

        slides[currentIndex]
            ?.classList.add("active");


        /*
         * Предыдущий слайд
         */

        slides[getPreviousIndex()]
            ?.classList.add("previous");


        /*
         * Следующий слайд
         */

        slides[getNextIndex()]
            ?.classList.add("next");


        /*
         * Информация о проекте
         */

        const project =
            projects[currentIndex];


        if (projectTitle) {

            projectTitle.textContent =
                project.title;

        }


        if (projectDescription) {

            projectDescription.textContent =
                project.description;

        }


        /*
         * Обновляем точки
         */

        if (dotsContainer) {

            dotsContainer
                .querySelectorAll(".landing-dot")
                .forEach((dot, index) => {

                    dot.classList.toggle(
                        "active",
                        index === currentIndex
                    );

                });

        }

    }


    /*
     * ==========================================
     * ПРЕДЫДУЩИЙ ИНДЕКС
     * ==========================================
     */

    function getPreviousIndex() {

        return currentIndex === 0
            ? projects.length - 1
            : currentIndex - 1;

    }


    /*
     * ==========================================
     * СЛЕДУЮЩИЙ ИНДЕКС
     * ==========================================
     */

    function getNextIndex() {

        return currentIndex === projects.length - 1
            ? 0
            : currentIndex + 1;

    }


    /*
     * ==========================================
     * СЛЕДУЮЩИЙ СЛАЙД
     * ==========================================
     */

    function nextSlide() {

        currentIndex =
            getNextIndex();

        updateSlider();

    }


    /*
     * ==========================================
     * ПРЕДЫДУЩИЙ СЛАЙД
     * ==========================================
     */

    function previousSlide() {

        currentIndex =
            getPreviousIndex();

        updateSlider();

    }


    /*
     * ==========================================
     * КНОПКА "ВПЕРЁД"
     * ==========================================
     */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextSlide
        );

    }


    /*
     * ==========================================
     * КНОПКА "НАЗАД"
     * ==========================================
     */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            previousSlide
        );

    }


    /*
     * ==========================================
     * КЛАВИАТУРА
     * ==========================================
     */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Проверяем,
             * находится ли курсор/фокус
             * внутри этой секции
             */

            const activeElement =
                document.activeElement;


            if (
                activeElement &&
                section.contains(activeElement)
            ) {

                if (event.key === "ArrowRight") {

                    nextSlide();

                }


                if (event.key === "ArrowLeft") {

                    previousSlide();

                }

            }

        }
    );


    /*
     * ==========================================
     * SWIPE
     * ==========================================
     */

    let touchStartX = 0;

    let touchEndX = 0;


    /*
     * Начало касания
     */

    slidesContainer.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    /*
     * Конец касания
     */

    slidesContainer.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

        },
        {
            passive: true
        }
    );


    /*
     * Обработка свайпа
     */

    function handleSwipe() {

        const distance =
            touchStartX - touchEndX;


        /*
         * Слишком маленькое движение
         */

        if (Math.abs(distance) < 50) {

            return;

        }


        /*
         * Свайп влево
         */

        if (distance > 0) {

            nextSlide();

        }


        /*
         * Свайп вправо
         */

        else {

            previousSlide();

        }

    }

}


/*
document.addEventListener("DOMContentLoaded", async () => {

    const slidesContainer =
        document.getElementById("landingSlides");

    const dotsContainer =
        document.getElementById("landingDots");

    const prevButton =
        document.getElementById("landingPrev");

    const nextButton =
        document.getElementById("landingNext");

    const projectTitle =
        document.getElementById("landingProjectTitle");

    const projectDescription =
        document.getElementById("landingProjectDescription");

    const featuresContainer =
        document.getElementById("landingFeatures");

    const suitableContainer =
        document.getElementById("landingSuitable");


    let projects = [];
    let currentIndex = 0;


    */
/*
     * Загрузка JSON
     *//*


    try {

        const response =
            await fetch("data/landing-pages.json");

        if (!response.ok) {
            throw new Error("Не удалось загрузить JSON");
        }

        const data = await response.json();

        projects = data.projects;


        */
/*
         * Заполняем список возможностей
         *//*


        featuresContainer.innerHTML =
            data.features
                .map(feature => `
                    <li>
                        <i class="bi bi-check2"></i>
                        <span>${feature}</span>
                    </li>
                `)
                .join("");


        suitableContainer.textContent =
            data.suitable;


        */
/*
         * Создаём слайды
         *//*


        createSlides();

        createDots();

        updateSlider();


    } catch (error) {

        console.error(error);

        slidesContainer.innerHTML = `
            <div class="landing-error">
                Не удалось загрузить проекты.
            </div>
        `;

    }


    */
/*
     * Создание слайдов
     *//*


    function createSlides() {

        slidesContainer.innerHTML =
            projects
                .map((project, index) => {

                    return `
                        <div
                            class="landing-slide"
                            data-index="${index}">

                            <img
                                src="${project.image}"
                                alt="${project.title}"
                                loading="${index === 0 ? "eager" : "lazy"}">

                        </div>
                    `;

                })
                .join("");
    }


    */
/*
     * Создание точек
     *//*


    function createDots() {

        dotsContainer.innerHTML =
            projects
                .map((_, index) => `
                    <button
                        type="button"
                        class="landing-dot"
                        data-index="${index}"
                        aria-label="Проект ${index + 1}">
                    </button>
                `)
                .join("");


        dotsContainer
            .querySelectorAll(".landing-dot")
            .forEach(dot => {

                dot.addEventListener("click", () => {

                    currentIndex =
                        Number(dot.dataset.index);

                    updateSlider();

                });

            });
    }


    */
/*
     * Обновление слайдера
     *//*


    function updateSlider() {

        const slides =
            document.querySelectorAll(".landing-slide");

        slides.forEach((slide, index) => {

            slide.classList.remove(
                "active",
                "previous",
                "next"
            );


            if (index === currentIndex) {

                slide.classList.add("active");

            }

            else if (
                index ===
                getPreviousIndex()
            ) {

                slide.classList.add("previous");

            }

            else if (
                index ===
                getNextIndex()
            ) {

                slide.classList.add("next");

            }

        });


        */
/*
         * Информация проекта
         *//*


        const project =
            projects[currentIndex];

        projectTitle.textContent =
            project.title;

        projectDescription.textContent =
            project.description;


        */
/*
         * Точки
         *//*


        document
            .querySelectorAll(".landing-dot")
            .forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            });

    }


    */
/*
     * Предыдущий индекс
     *//*


    function getPreviousIndex() {

        return currentIndex === 0
            ? projects.length - 1
            : currentIndex - 1;

    }


    */
/*
     * Следующий индекс
     *//*


    function getNextIndex() {

        return currentIndex === projects.length - 1
            ? 0
            : currentIndex + 1;

    }


    */
/*
     * Следующий проект
     *//*


    function nextSlide() {

        currentIndex =
            getNextIndex();

        updateSlider();

    }


    */
/*
     * Предыдущий проект
     *//*


    function previousSlide() {

        currentIndex =
            getPreviousIndex();

        updateSlider();

    }


    nextButton.addEventListener(
        "click",
        nextSlide
    );


    prevButton.addEventListener(
        "click",
        previousSlide
    );


    */
/*
     * Управление клавиатурой
     *//*


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "ArrowRight") {
                nextSlide();
            }

            if (event.key === "ArrowLeft") {
                previousSlide();
            }

        }
    );


    */
/*
     * Swipe для смартфона
     *//*


    let touchStartX = 0;

    let touchEndX = 0;


    slidesContainer.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    slidesContainer.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

        },
        { passive: true }
    );


    function handleSwipe() {

        const distance =
            touchStartX - touchEndX;


        if (Math.abs(distance) < 50) {
            return;
        }


        if (distance > 0) {
            nextSlide();
        } else {
            previousSlide();
        }

    }

});*/
