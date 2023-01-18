if (document.readyState !== 'loading') {
    documentReady();
} else {
    document.addEventListener('DOMContentLoaded', documentReady);
}

function documentReady() {

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    const notification_game_id = params.game_id;
    //console.log(`game: ${notification_game_id}`);

    onStart();
    /*
    ready();
    fetchLinks();
    gameReady();
    todoReady();
    noteReady();
    getMostVisitedSites();
    fetchExtraData();*/

    const gameCategorySlideLeft = document.getElementById('game-category-slide-left');
    const gameCategorySlideRight = document.getElementById('game-category-slide-right');
    const gameCategoryList = document.getElementById('game-category-list');
    const gameCategoryContainer = document.getElementById('game-category-container');
    const centerContainer = document.getElementById('center-container');
    const mainContainer = document.getElementById('main-container');
    const templateGameCategory = document.getElementById('template-game-category').firstElementChild;
    const container = document.querySelector('#container');
    const gameContainer = document.querySelector('#game-container');
    const gamePages = document.querySelector('#game-pages');
    const gameFrame = document.querySelector('#game-frame');
    const gamePoster = document.querySelector('#game-poster');
    //const gamePosterPlay = document.querySelector('#game-poster-play');
    const gameLoading = document.querySelector('#game-frame #game-loading');
    const gameIcon = document.querySelector('#game-frame #game-icon');
    const gameName = document.querySelector('#game-frame #game-name');
    const gameFullscreen = document.querySelector('#game-frame #game-fullscreen');
    const gameFrameClose = gameFrame.querySelector('#game-frame-close');
    const gameIFrame = gameFrame.querySelector('iframe');
    const templateGamePage = document.querySelector('#template-game-page').firstElementChild;
    const templateGame = document.querySelector('#template-game').firstElementChild;
    const extraGamesRight = document.querySelector("#right-side-panel").querySelectorAll('.right-side-container-item');
    const extraGamesLeft = document.querySelector("#left-side-panel").querySelectorAll('.left-side-container-item');
    const rightPanelTitle1 = document.querySelector('#right-side-container-1-label');
    const rightPanelTitle2 = document.querySelector('#right-side-container-2-label');

    const resize = () => {
        let availableHeight = container.clientHeight - 40;
        let leftItemSize = availableHeight / 8.5;
        let rightItemSize = (availableHeight - 160) / 4;
        mainContainer.style.setProperty("grid-template-columns", `${leftItemSize}px 1fr ${rightItemSize * 2}px`);

        let height = gameFrame.clientWidth * (9 / 16);
        if (height > availableHeight * .8) {
            height = availableHeight * .8;
            let width = height * (16 / 9);
            let free = container.clientWidth - width;
            //mainContainer.style.setProperty("grid-template-columns", `${free*.2}px 1fr ${free*.8}px`);
        }
        gamePoster.style.height = height + 'px';
        gameIFrame.style.height = height + 'px';
        gameFrame.style.height = height + 'px';
        centerContainer.style.height = height + 'px';
        //gameCategoryContainer.style.width = centerContainer.clientWidth + 'px';
    }


    setTimeout(resize, 3000);
    window.onresize = resize;

    gameCategoryContainer.addEventListener('mouseover', (event) => {
        gameCategorySlideRight.hidden = false;
        gameCategorySlideLeft.hidden = false;
    })

    gameCategoryContainer.addEventListener('mouseout', (event) => {
        gameCategorySlideRight.hidden = true;
        gameCategorySlideLeft.hidden = true;
    })

    gameCategoryList.addEventListener('wheel', function (event) {
        gameCategoryList.scrollBy({top: 0, left: event.deltaY * 4, behavior: "smooth"});
    }, {passive: true});

    gameCategorySlideLeft.onclick = () => {
        gameCategoryList.scrollBy({top: 0, left: -240, behavior: "smooth"});
    }

    gameCategorySlideRight.onclick = () => {
        gameCategoryList.scrollBy({top: 0, left: 240, behavior: "smooth"});
    }


    gameFullscreen.onclick = () => {
        gameIFrame.requestFullscreen();
        logAccess();
    }

    gameFrameClose.onclick = () => {
        gameFrame.style.setProperty('display', 'none');
        gameContainer.style.setProperty('display', 'block');
        gameIFrame.src = '';
        logAccess();
    }

    gameIFrame.onload = () => {
        gameLoading.style.setProperty('display', 'none');
        gamePoster.style.display = 'none';
    }

    chrome.runtime.sendMessage({"action": "fetch_data"}, (response) => {
        container.style.display = "block";
        if (response == null) {
            //console.log('link reponse null'); 
            return;
        }

        const data = response;

        const extensionMode = data.extension.mode;
        const gamePosterMode = data.extension.game_poster_mode;

        //console.log('extension_mode:' + extensionMode);

        if (data.extra_games) {


            const extra_games = JSON.parse(data.extra_games);
            // console.log(`extra-games-count: ${extra_games.games_left.length}`)

            if (extra_games.title1.length > 0) {
                rightPanelTitle1.innerText = extra_games.title1;
            }

            if (extra_games.title2.length > 0) {
                rightPanelTitle2.innerText = extra_games.title2;
            }

            const setExtraGameItem = (elItem, gameData, ismaingame = false) => {

                //console.log(`extra-game: ${JSON.stringify(gameData)}`)

                const elGameName = elItem.querySelector("div span")
                const elGameIcon = elItem.querySelector("img")

                if (gameData.click_mode > 0) {
                    elGameName.innerText = gameData.name
                    elGameIcon.src = gameData.icon_url

                    elItem.onclick = () => {
                        //console.log(`game:${JSON.stringify(gameData)}`)
                        if (gameData.click_mode == 2) {
                            gameLoading.style.setProperty('display', 'block');
                            gameFrame.style.setProperty('display', 'grid');
                            gameContainer.style.setProperty('display', 'none');
                            gameIFrame.src = gameData.iframe_url;
                            gameName.innerHTML = gameData.name;
                            gameIcon.src = gameData.icon_url;
                        } else {
                            chrome.tabs.create({url: gameData.redirect_url});
                        }
                        logAccess();
                        gameFullscreen.style.display = "inline";
                    }
                } else {
                    elItem.style.display = 'none';
                }

                if (ismaingame) {
                    console.log('main-game')
                    elItem.classList.remove('left-side-container-item')
                    elItem.classList.add('side-main-game-item')
                    elGameName.classList.add('side-main-game-name');
                    const elGameNameDiv = elItem.querySelector("div")
                    elGameNameDiv.classList.add('side-main-game-name-div');
                    elGameIcon.classList.add('side-main-game-icon');
                }
            }

            for (let i = 0; i < 4; i++) {
                setExtraGameItem(extraGamesRight[i], extra_games.games_right_1[i])
            }
            for (let i = 0; i < 4; i++) {
                setExtraGameItem(extraGamesRight[i + 4], extra_games.games_right_2[i])
            }

            let is = 0;
            //console.log(`gamePosterMode: ${gamePosterMode} ${gamePosterMode != 3} && data.game: ${data.game} && ${data.game != -1}`)
            if (gamePosterMode != 3 && data.game && data.game != -1) {
                //console.log(`twin-duck-1`)
                is = 1;
                setExtraGameItem(extraGamesLeft[0],
                    {
                        name: data.game.name,
                        click_mode: gamePosterMode,
                        icon_url: data.game.icon_url,
                        iframe_url: data.game.iframe_url,
                        redirect_url: data.game.redirect_url
                    }, true
                );
            }

            for (let i = is; i < 8; i++) {
                setExtraGameItem(extraGamesLeft[i], extra_games.games_left[i])
            }


        }


        /*if (data.wallpaper_url) {
            container.style.setProperty('background-image', `url("${data.wallpaper_url}")`);
        }*/


        //console.log(`gamePosterMode:${gamePosterMode}`);
        //console.log(JSON.stringify(data.game));
        if (gamePosterMode != 3 && data.game && data.game != -1) {
            //console.log(`twin-duck-2`)
            gameContainer.style.display = 'none';
            gameFrame.style.display = 'grid';
            gamePoster.style.setProperty('background-image', `url("${data.game.poster_url}")`);
            gameName.innerHTML = data.game.name;
            gameIcon.src = data.game.icon_url;
            //localStorage.setItem('poster-shown', true);
            gamePoster.onclick = () => {
                if (gamePosterMode == 2) {
                    gameLoading.style.setProperty('display', 'block');
                    gameFrame.style.setProperty('display', 'grid');
                    gameContainer.style.setProperty('display', 'none');
                    gameFullscreen.style.display = "inline";
                    gameIFrame.src = data.game.iframe_url;
                } else {
                    chrome.tabs.create({url: data.game.redirect_url});
                }
                logAccess(data.game.id);
            }
        }

        if (gamePosterMode == 3) {
            gameFullscreen.style.display = "inline";
        }

        let count = 0;
        let prevPageNumber = 0;

        if (data.game_categories) {

            if (gamePosterMode == 3) {
                let index = -1;
                for (let i = 0; i < data.game_categories.length; i++) {
                    if (data.game_categories[i].id == data.game_category.id) {
                        index = i;
                        //console.log("index:" + index);
                        break;
                    }
                }
                if (index != -1) {
                    let temp = data.game_categories[index];
                    data.game_categories[index] = data.game_categories[0];
                    data.game_categories[0] = temp;
                }
            }


            data.game_categories.forEach(gameCategory => {
                try {
                    const elGamePage = templateGamePage.cloneNode(true);
                    elGamePage.setAttribute('page-number', count);

                    const elGamePageTiles = elGamePage.querySelector('.game-page-tiles');

                    elGamePage.querySelector('.game-page-title span').innerHTML = gameCategory.name;


                    const elGameCategory = templateGameCategory.cloneNode(true);
                    elGameCategory.setAttribute('page-number', count);

                    if (count == 0) {
                        elGameCategory.classList.add('selected');
                        prevPageNumber = count;
                    }

                    const elGameCategoryTitle = elGameCategory.querySelector('.game-category-title');
                    elGameCategoryTitle.innerHTML = gameCategory.name;

                    const elGameCategoryIcon = elGameCategory.querySelector('.game-category-icon');
                    elGameCategoryIcon.src = gameCategory.icon_url;

                    gameCategory.games.forEach((game) => {
                        try {
                            const elGame = templateGame.cloneNode(true);
                            const elGameTitle = elGame.querySelector('.game-title');
                            elGameTitle.innerHTML = game.name;
                            elGameTitle.setAttribute('title', game.name);

                            elGame.querySelector('.game-img').src = game.icon_url;

                            elGame.onclick = () => {
                                if (extensionMode == 2) {
                                    gameLoading.style.setProperty('display', 'block');
                                    gameFrame.style.setProperty('display', 'grid');
                                    gameContainer.style.setProperty('display', 'none');
                                    gameIFrame.src = game.iframe_url;
                                    gameName.innerHTML = game.name;
                                    gameIcon.src = game.icon_url;
                                } else {
                                    chrome.tabs.create({url: game.redirect_url});
                                }
                                gameFullscreen.style.display = "inline";
                                logAccess(game.id);
                            }

                            elGamePageTiles.appendChild(elGame);

                            if (notification_game_id != null) {
                                if (notification_game_id == game.id) {
                                    gameLoading.style.setProperty('display', 'block');
                                    gameFrame.style.setProperty('display', 'grid');
                                    gameContainer.style.setProperty('display', 'none');
                                    gameIFrame.src = game.iframe_url;
                                    gameName.innerHTML = game.name;
                                    gameIcon.src = game.icon_url;
                                }
                            }
                        } catch (e) {
                        }
                    })

                    elGameCategory.onclick = () => {
                        gameFrame.style.setProperty('display', 'none');
                        gameContainer.style.setProperty('display', 'block');
                        gameIFrame.src = '';

                        const selectedPageNumber = elGameCategory.getAttribute('page-number');
                        const pageOffset = selectedPageNumber - prevPageNumber;
                        prevPageNumber = selectedPageNumber;
                        //gamePages.scrollBy({ top: 0, left: gameContainer.clientWidth * pageOffset, behavior: "smooth" });

                        gamePages.querySelectorAll('.game-page').forEach((elGamePage) => {
                            if (elGamePage.getAttribute('page-number') == selectedPageNumber) {
                                elGamePage.style.setProperty('display', 'block');
                            } else {
                                elGamePage.style.setProperty('display', 'none');
                            }
                        });

                        let selected = gameCategoryList.querySelector('.game-category-item.selected');
                        if (selected && selected.classList.contains('selected')) {
                            selected.classList.remove('selected');
                        }
                        elGameCategory.classList.add('selected');
                        logAccess();
                    }

                    elGamePageTiles.addEventListener('wheel', function (event) {
                        elGamePageTiles.scrollBy({top: event.deltaY * 3, left: 0, behavior: "smooth"});
                    }, {passive: true});

                    gameCategoryList.append(elGameCategory);
                    gamePages.append(elGamePage);
                    count++;
                } catch (e) {
                }
            })
        }

    });

    const elShowPrivacyPolicy = document.querySelector('#li-a-privacy-policy');
    if (Show_Privacy_Policy) {
        elShowPrivacyPolicy.querySelector('a').setAttribute('href', Privacy_Policy_URL);
    } else {
        elShowPrivacyPolicy.style.setProperty('display', 'none');
    }


    const elShowEula = document.querySelector('#li-a-eula');
    if (Show_EULA) {
        elShowEula.querySelector('a').setAttribute('href', EULA_URL);
    } else {
        elShowEula.style.setProperty('display', 'none');
    }


    const elShowContactUs = document.querySelector('#li-a-contact-us');
    if (Show_Contact_Us) {
        elShowContactUs.querySelector('a').setAttribute('href', Contact_Us_URL);
    } else {
        elShowContactUs.style.setProperty('display', 'none');
    }

    const elShowDonate = document.querySelector('#li-a-donate');
    if (Show_Donate) {
        elShowDonate.querySelector('a').setAttribute('href', Donate_URL);
    } else {
        elShowDonate.style.setProperty('display', 'none');
    }

    const elShowUninstallGuide = document.querySelector('#li-a-uninstall-guide');
    if (Show_Uninstall_Guide) {
        elShowUninstallGuide.querySelector('a').setAttribute('href', Uninstall_Guide_URL);
    } else {
        elShowUninstallGuide.style.setProperty('display', 'none');
    }

    //const moreThemes = document.querySelector('#more-themes');
    const moreThemes2 = document.querySelector('#more-themes-2');
    if (Show_More_Themes) {
        //moreThemes.setAttribute('href', More_Themes_URL);
        moreThemes2.setAttribute('href', More_Themes_URL);
    } else {
        //moreThemes.setProperty('display', 'none');
        moreThemes2.style.setProperty('display', 'none');
    }


    const settingsContainer = document.getElementById('settings-container');
    settingsContainer.onclick = function (event) {
        //event.preventDefault();
        event.stopPropagation();
    }


    const extUrl = "https://chrome.google.com/webstore/detail/" + chrome.runtime.id;

    $('#facebook-share-button').on("click", function () {
        chrome.tabs.create({
            url: "https://www.facebook.com/sharer/sharer.php?u=" + extUrl
        });
    });

    $("#twitter-share-button").on("click", function () {
        chrome.tabs.create({
            url: "https://www.twitter.com/share?url=" + extUrl
        });
    });

    $("#pinterest-share-button").on("click", function () {
        chrome.tabs.create({
            url: "https://pinterest.com/pin/create/button/?media=&description=&url=" + extUrl
        });
    });

    $("#whatsapp-share-button").on("click", function () {
        chrome.tabs.create({
            url: "https://api.whatsapp.com/send?text=" + extUrl
        });
    });

    $("#email-share-button").on("click", function () {
        chrome.tabs.create({url: "mailto:?subject=" + Email_Share_Subject + "&body=" + extUrl});
    });

    $("#settings-button").on("click", function (e) {
        e.stopPropagation();
        e.preventDefault();

        if ($("#settings-container").css('display') == 'none') {
            $("#settings-container").show();
        } else {
            $("#settings-container").hide();
        }
    });


    $(document).on("click", function () {
        if ($("#settings-container").css('display') != 'none') {
            $("#settings-container").hide();
        }
    });
}

const logAccess = (game = undefined) => {
    if (game == undefined) {
        chrome.runtime.sendMessage({"action": "log"});
    } else {
        chrome.runtime.sendMessage({"action": "log", "game": game});
    }
}

function onStart() {
    /*if (!localStorage.getItem("first-time")) {
        var instructions = document.createElement("div");
        instructions.className = "assist-instructions";
        instructions.innerHTML = 'Click "<b>Keep it</b>" to keep this Wallpaper Extension.';

        var installed = document.createElement("div");
        installed.className = "assist-extension-installed";
        installed.innerText = "Extension Successfully Installed!";

        var checkbox = document.createElement("img");
        checkbox.className = "assist-checkbox";
        checkbox.src = "images/checkbox.png";

        var background = document.createElement("div");
        background.className = "assist-background-area";
        background.appendChild(checkbox);
        background.appendChild(installed);
        background.appendChild(instructions);

        var arrow = document.createElement("img");
        arrow.className = "assist-green-arrow";
        arrow.src = "images/blue-arrow.gif";

        var overlay = document.createElement("div");
        overlay.className = "assist-overlay";
        if (navigator.userAgent.match(/Mac/i))
            overlay.style = "right: 50%;top: 140px;margin-right:-100px;";
        else
            overlay.style = "right: 50%; top: 140px; margin-right:-240px;";
        overlay.appendChild(arrow);
        overlay.appendChild(background);

        var backdrop = document.createElement("div");
        backdrop.className = "assist-backdrop";

        var keepsettingsassist = document.createElement("div");
        keepsettingsassist.className = "keep-settings-assist";
        keepsettingsassist.appendChild(backdrop);
        keepsettingsassist.appendChild(overlay);
        keepsettingsassist.onclick = removeOverlay;
        document.body.appendChild(keepsettingsassist);
        localStorage.setItem("first-time", true);

        setTimeout(removeAssist, 30000);
        setTimeout(removeOverlay, 31000);
    }*/
}

function removeOverlay() {
    if (document.getElementsByClassName("keep-settings-assist") != null && document.getElementsByClassName("keep-settings-assist").length > 0) {
        document.getElementsByClassName("keep-settings-assist")[0].remove();
    }
    removeAssist();
}

function removeAssist() {
    if (document.getElementsByClassName("assist-overlay") != null && document.getElementsByClassName("assist-overlay").length > 0) {
        document.getElementsByClassName("assist-overlay")[0].remove();
    }
}