
// =========>looder<=========//
$(document).ready(() => {
    const containerData = document.getElementById('data');
    const searchSection = document.getElementById('searchSection');
    const contactContainer = document.getElementById('contact');
    const formRegex = {
        name: /^[a-zA-Z]+\s*[a-zA-Z]+$/,
        email: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])+$/,
        phone: /^01[0125][0-9]{8}$/,
        age: /^[1-9][0-9]?$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    }
    containerData.innerHTML = "  ";


    function looding() {
        $('.loader').fadeOut(500, () => {
            $('.loading').removeClass('d-flex');
            $('.loading').addClass('d-none')
        })
    }
    looding(document.body)

    $('.sidebar-icon').click(toggleSideBar)

    function toggleSideBar() {
        console.log($('.sidebar').css('left'));
        let sideSize = ($('.sidebar').css('left'));

        if (sideSize === '-269.75px') {
            openSideBar()
        } else {
            closeSideBar()
        }
    }
    function openSideBar() {
        let sideBarSize = 269.75

        // console.log('open');
        $('.sidebar').animate({
            left: 0
        }, 500);
        $('.sidebar-nav').animate({
            left: sideBarSize
        }, 500);
        $('.fa-open-close').removeClass('fa-align-justify', 500);
        $('.fa-open-close').addClass('fa-x', 500);
        for (let i = 0; i < 5; i++) {
            $('.side-header ul li').eq(i).animate({
                top: 0
            }, (i + 5) * 100)
        }
    }
    function closeSideBar() {
        let sideBarSize = 269.75

        // console.log('close');
        $('.sidebar').animate({
            left: -sideBarSize
        }, 500);
        $('.sidebar-nav').animate({
            left: 0
        }, 500);
        $('.fa-open-close').removeClass('fa-x', 500);
        $('.fa-open-close').addClass('fa-align-justify', 500);
        for (let i = 0; i < 5; i++) {
            $('.side-header ul li').eq(i).animate({
                top: '300px'
            }, (i + 6) * 100)
        }
    }

    //===================>getDataMeels <=====================//
    async function getDataMeels(file, quiry, input) {
        $(".inner-loading").fadeIn(500);
        const initialRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/${file}?${quiry}=${input} `
        );
        const intialData = await initialRsepon.json();
        $(".inner-loading").fadeOut(500);

        displatDataMeals(intialData.meals)
        return intialData;
    }
    console.log(getDataMeels("search.php", "s", " "));

    function displatDataMeals(arr) {
        let boxData = ``
        for (let i = 0; i < arr.length; i++) {
            boxData += `
           <div class="col-md-3 ">
           <div class="inner position-relative overflow-hidden dataMeals pointer" data-meals="${arr[i].strMeal}">
             <img class="img-fluid rounded-2" src="${arr[i].strMealThumb}" alt="">
             <div class="inner-layar border-2 rounded-2  position-absolute w-100 h-100  d-flex flex-column justify-content-center align-items-start px-2 ">
               <h3>${arr[i].strMeal}</h3>
             </div>
           </div>
         </div>`
        }
        containerData.innerHTML = boxData;
        $(".dataMeals").click(async (e) => {
            // getCategryMeals(e.currentTarget.dataset.)
            getMealsDelails(e.currentTarget.dataset.meals)
            console.log(getMealsDelails(e.currentTarget.dataset.meals));
        })
    }

    //===================>getMealsDelails <=====================//
    async function getMealsDelails(mealName) {
        containerData.innerHTML = "";
        $(".inner-loading").fadeIn(500);
        const detailsMealRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
        );
        const detailsMealData = await detailsMealRsepon.json();
        $(".inner-loading").fadeOut(500);
        showDetailsMeal(detailsMealData.meals)
        return detailsMealData;
    }
    function showDetailsMeal(arrMeal) {
        const mealMap = new Map(Object.entries(arrMeal[0]));
        // console.log(mealMap);
        let ingredients = ``
        for (let i = 1; i <= mealMap.size; i++) {
            let measure = mealMap.get(`strMeasure${i}`);
            let ingredient = mealMap.get(`strIngredient${i}`);
            if (
                measure !== "" &&
                measure !== undefined &&
                measure !== null &&
                measure !== " "
            ) {
                ingredients += `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`
            }
        }
        let tags = mealMap.get(`strTags`);
        let tagsHtml = ``

        if (tags !== null &&
            tags !== undefined &&
            tags !== "" &&
            tags !== " "
        ) {
            let tagsStr = tags.split(",")
            // console.log(tagsStr);
            for (let i = 0; i < tagsStr.length; i++) {
                tagsHtml += `
                <li class="alert alert-danger m-2 p-1">${tagsStr[i]}</li>`
            }
        }

        let mealBox = ``
        for (let i = 0; i < arrMeal.length; i++) {
            mealBox = `
            <div class="col-md-4 ">
            <img src="${arrMeal[i].strMealThumb}" class="w-100  rounded-3 pb-2" alt="">
            <h2>
            ${arrMeal[i].strMeal}
            </h2>
          </div>
          <div class="col-md-8">
            <h2>Instructions</h2>
            <p class=" p-color">${arrMeal[i].strInstructions}</p>
            <h3>
              <span>Area :</span>
              ${arrMeal[i].strArea}
            </h3>
            <h3>
              <span>Category :</span>
              ${arrMeal[i].strCategory}
            </h3>
            <h3> Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
           ${ingredients}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
             ${tagsHtml}
            </ul>
            <a target="_blank" href="${arrMeal[i].strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${arrMeal[i].strYoutube}" class="btn btn-danger">Youtub</a>
          </div>
            
            `
        }
        containerData.innerHTML = mealBox;
    }
    //===================>getCategroies <=====================//
    async function getCategroies() {
        $(".inner-loading").fadeIn(500);

        const catRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/categories.php`
        );
        const catData = await catRsepon.json();
        return catData;
    }
    console.log(getCategroies());

    async function displaAllCategroies(arrCategories) {
        let catData = ``
        for (let i = 0; i < arrCategories.length; i++) {
            catData += `
        <div class="col-md-3 ">
            <div class="inner position-relative overflow-hidden categoyMealsData  pointer" data-category-name="${arrCategories[i].strCategory}">
              <img class="img-fluid rounded-2" src="${arrCategories[i].strCategoryThumb}" alt="">
              <div class="inner-layar border-2 rounded-2  position-absolute w-100 h-100  d-flex flex-column justify-content-center align-items-center px-2 ">
                <h3>${arrCategories[i].strCategory}</h3>
                <p>${arrCategories[i].strCategoryDescription.split(" ").splice(0, 20).join(" ")}</p>
              </div>
            </div>
          </div>
        `
        }
        containerData.innerHTML = catData;

        $(".categoyMealsData").click(async (e) => {
            getCategryMeals(e.currentTarget.dataset.categoryName)
            console.log((e.currentTarget.dataset.categoryName)

            );
        })
    }

    $(".categoryData").click(async () => {
        toggleSideBar();
        searchSection.innerHTML = "";
        containerData.innerHTML = "";
        const allCategory = await getCategroies();
        $(".inner-loading").fadeOut(500);
        displaAllCategroies(allCategory.categories)

    });
    //===================>getCategryMeals <=====================//

    async function getCategryMeals(category) {
        containerData.innerHTML = "";
        $(".inner-loading").fadeIn(500);
        const catMealRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );
        const catMealData = await catMealRsepon.json();
        $(".inner-loading").fadeOut(500);
        displatDataMeals(catMealData.meals.slice(0, 20));
        return catMealData;
    }

    //===================>getAreas <=====================//
    async function getAreas() {
        const areaRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
        );
        const areaData = await areaRsepon.json();
        return areaData;
    }

    function displayArea(arrArea) {
        let arrBox = ``
        for (let i = 0; i < arrArea.length; i++) {
            arrBox += `
            <div class="col-md-3">
            <div id="areaMeal" class="area rounded-2 text-center pointer areaMeals " data-area-name="${arrArea[i].strArea}">
              <i class="fa-solid fa-house-laptop fa-5x"></i>
              <h3 class="pt-3">${arrArea[i].strArea}</h3>
            </div>
          </div>
            `
        }
        containerData.innerHTML = arrBox;

        $(".areaMeals").click((e) => {
            getAreaMeals(e.currentTarget.dataset.areaName);
            // console.log(e.currentTarget.dataset.areaName);
        })

    }
    $(".areaData").click(async () => {
        toggleSideBar();
        searchSection.innerHTML = "";
        containerData.innerHTML = "";
        $(".inner-loading").fadeIn(500);
        const allAreas = await getAreas();
        $(".inner-loading").fadeOut(500);
        displayArea(allAreas.meals)
    })

    async function getAreaMeals(area) {
        containerData.innerHTML = "";
        const areaMealRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
        );
        const areaMealData = await areaMealRsepon.json();
        displatDataMeals(areaMealData.meals.slice(0, 20));
        return areaMealData;
    }

    //===================>getingredients <=====================//
    async function getingredients() {
        const ingredientRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
        );
        const ingredientData = await ingredientRsepon.json();
        return ingredientData;
    }

    async function displayIngredient(arrIngredient) {
        let ingredientBox = ``
        for (let i = 0; i < arrIngredient.length; i++) {
            ingredientBox += `
            <div class="col-md-3">
            <div class="rounded-2 text-center pointer ingredMeal " data-ingred-name="${arrIngredient[i].strIngredient}">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3>${arrIngredient[i].strIngredient}</h3>
              <p class="p-color">${arrIngredient[i].strDescription?.split(" ").splice(0, 12).join(" ")}</p>
            </div>
          </div>
            `
        }
        containerData.innerHTML = ingredientBox;

        $(".ingredMeal").click((e) => {
            getIngredintMeals(e.currentTarget.dataset.ingredName)
            console.log(e.currentTarget.dataset.ingredName);
        })

    }
    $(".IngredientData").click(async () => {
        toggleSideBar();
        searchSection.innerHTML = "";
        containerData.innerHTML = "";
        $(".inner-loading").fadeIn(500);
        const allIngredient = await getingredients();
        $(".inner-loading").fadeOut(500);
        displayIngredient(allIngredient.meals)
    })
    async function getIngredintMeals(ingred) {
        containerData.innerHTML = "";
        const ingredMealRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingred}`
        );
        const ingredMealData = await ingredMealRsepon.json();
        displatDataMeals(ingredMealData.meals.slice(0, 20));
        return ingredMealData;
    }
    //=============>showSearchInput<===========//
    function showInputs() {
        let inputBox = `
        <div class="col-md-6">
          <input type="text" class="form-control bg-transparent text-white serch searchByName" placeholder="Search By Name... ">
        </div>
        <div class="col-md-6">
          <input type="text" class="form-control bg-transparent text-white serch searchByFletter"
            placeholder="Search By First Letter... ">
        </div>
    `
        searchSection.innerHTML = inputBox;

        $(".searchByFletter").keyup((e) => {
            searchByName(e.target.value)
            console.log(e.target.value);

        });
        $(".searchByName").keyup((e) => {
            searchByleter(e.target.value)
            console.log(e.target.value);
        })

    }
    $('.searchData').click(() => {
        containerData.innerHTML = " ";
        toggleSideBar();
        showInputs()
    })
    async function searchByName(searchValue) {
        $(".inner-loading").fadeIn(500);
        const byNameRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
        );
        const byNameData = await byNameRsepon.json();
        $(".inner-loading").fadeOut(500);
        byNameData.meals ? displatDataMeals(byNameData.meals) : displatDataMeals([]);
        return byNameData;

    }
    async function searchByleter(searchValue) {
        $(".inner-loading").fadeIn(500);
        const byLetterRsepon = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchValue}`
        );
        const byLetterData = await byLetterRsepon.json();
        $(".inner-loading").fadeOut(500);
        byLetterData.meals ? displatDataMeals(byLetterData.meals) : displatDataMeals([]);
        return byLetterData;

    }

    //=============>howRegesterInput<===========//
    function showRegesterInput() {
        let regesterBox = `
        <div class=" mt-5 w-100 text-center ">
              <div class="row g-4 inputRegester">
                  <div class="col-md-6">
                      <input id="name"  type="text" class="form-control" placeholder="EX:mostafa" fdprocessedid="1pv6uv">
                  </div>
                  <div class="col-md-6">
                      <input id="email" type="email" class="form-control " placeholder="EX:mostafa.a@gmail.com" fdprocessedid="4q0w2">
                  </div>
                  <div class="col-md-6">
                      <input id="phone"type="text" class="form-control " placeholder="EX:01xxxxxxxxx" fdprocessedid="66i9of">
                  </div>
                  <div class="col-md-6">
                      <input id="age"  type="number" class="form-control " placeholder="EX:25" fdprocessedid="y59pxe">
                  </div>
                  <div class="col-md-6">
                      <input id="password" type="password" class="form-control " placeholder="Enter Your Password" fdprocessedid="iavo5l">
                      
                  </div>
                  <div class="col-md-6">
                      <input id="repasswordInput"  type="password" class="form-control " placeholder="Repassword" fdprocessedid="xgy4nf">
                  </div>
              </div>
              <button id="submitBtn" disabled="" class="btn btn-outline-danger px-2 mt-3">Submit</button>
          </div>

        `
        containerData.innerHTML = regesterBox;
        let passwordInput = document.getElementById("password");
        let rePasswordInput = document.getElementById("repasswordInput");
        let inputs = document.querySelectorAll(".inputRegester input");
        let submitBtn = document.getElementById('submitBtn');
        for (const input of inputs) {
            console.log(input.id);
            input.addEventListener("keyup", function () {
                if (input.id !== "repasswordInput") {
                    validationInputs(this, formRegex[`${this.id}`])
                } else {
                    confirmPass(passwordInput, rePasswordInput)
                }
                const validInputs = document.querySelectorAll(".is-valid");
                if (validInputs.length == 5) {
                    submitBtn.removeAttribute("disabled");
                } else {
                    submitBtn.setAttribute("disabled", "true");
                }
            });
        }


    }
    $('.contactData').click(() => {
        containerData.innerHTML = " ";
        searchSection.innerHTML = " ";
        $(".inner-loading").fadeIn(500);
        toggleSideBar();
        $(".inner-loading").fadeOut(500);
        showRegesterInput();
    });

    //=============>validationInputs<===========//
    function validationInputs(input, regex) {
        let value = input.value;
        if (regex.test(value)) {
            input.classList.add("is-valid");
            input.classList.remove("is-invalid");
        } else {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
        }
    }

    function confirmPass(passInput, rePassInput) {
        if (passInput.value == rePassInput.value) {
            passInput.classList.add("is-valid");
            passInput.classList.remove("is-invalid");
        } else {
            passInput.classList.add("is-invalid");
            passInput.classList.remove("is-valid");
        }
    }


})




