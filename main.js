
const button = document.getElementById("idButton")
const input = document.getElementById("idInput")
button.addEventListener(("click"), () => {
    let playerURL = `https://api.opendota.com/api/players/${input.value}`
    console.log(input.value)
    let tableHtml = document.getElementById("table")
    tableHtml.innerHTML = ''

    displayInfo(playerURL)
})

const HEROES = './heroes.json'


const player = {

    getId(id){
        this.id = id
    },
    getAvatar(avatar){
        this.avatar = avatar
    },
    getName(nickname){
        this.name = nickname
    },
    getSteamURL(steamUrl){
        this.steamUrl = steamUrl
    }

}

function displayInfo(playerId) {
    let RECENT_MATCHES = playerId +'/recentMatches' 

    async function getPlayerInfo (url) {
        const response = await fetch (url);
        const jsonPlayerPromise = await response.json();
        // console.log(jsonPlayerPromise)
        return jsonPlayerPromise;
    };

    async function fillPlayerCredentians (){
        const jsonDataPlayer = await getPlayerInfo(playerId);
        player.getName(jsonDataPlayer.profile.personaname)
        player.getAvatar(jsonDataPlayer.profile.avatarfull)
        player.getId(jsonDataPlayer.profile.account_id)
        player.getSteamURL(jsonDataPlayer.profile.profileurl)
    }

    function changeCredentialsOnPage(){
        document.getElementById("avatar").src = player.avatar;
        document.getElementById("nickname").innerText = player.name;
        document.getElementById("id").innerText = player.id;
        document.getElementById("steam").href = player.steamUrl;
    }

    fillPlayerCredentians().then(() => changeCredentialsOnPage())


    // starting with the table...
    async function getRecentMatches(recentMatchesUrl){
        const response = await fetch (recentMatchesUrl)
        const jsonRecentsPromise = await response.json()
        // console.log(jsonRecentsPromise)
        return jsonRecentsPromise;
    }
    async function getHeroesList(heroesJSON){
        const response = await fetch (heroesJSON)
        const jsonHeroes = await response.json()
        return jsonHeroes;
    }

    async function createTableContent (match, index) {

        let newTrElement = document.createElement("tr")
        newTrElement.id = `tr${index+1}`
        table.appendChild(newTrElement)
        newTrElement = document.getElementById(`tr${index+1}`)

        function createNewThElement(innerText){
            let newThElement = document.createElement("th")
            newThElement.innerText = innerText
            newTrElement.appendChild(newThElement)

        }

        //heroes
        let heroesArray = await getHeroesList(HEROES);
        let matchHeroID = match.hero_id
        heroesArray.forEach((hero) => {
            if (hero.id === matchHeroID) createNewThElement (hero['localized_name'])
        })
        
        //kda
        const {kills, deaths, assists} = match;
        let kda = `${kills}/${deaths}/${assists}`
        createNewThElement(kda)

        // win/lose
        function fillGameResult(match) {
            
            function createNewThElementForResult(innerText){
                let newThElement = document.createElement("th")
                newThElement.innerText = innerText
                if (innerText === 'win') {
                    newThElement.classList.add('green')
                } else if (innerText ==='lose'){
                    newThElement.classList.add('red')
                }else {}
                newTrElement.appendChild(newThElement)
            }

            let playerSlot= (match["player_slot"].toString())
            let playerIsRadiant = (playerSlot.length > 2) ? false : true;
            let isRadiantWon = match['radiant_win'];

            if (playerIsRadiant){
                isRadiantWon? createNewThElementForResult('win') : createNewThElementForResult('lose')
            } else if (!playerIsRadiant){
                isRadiantWon? createNewThElementForResult('lose') : createNewThElementForResult ('win')
            } else {
                createNewThElementForResult('notScored')
            }
        }
        fillGameResult(match)

        //duration
        createNewThElement (`${Math.trunc(match.duration / 60)}:${(match.duration % 60).toString().padStart(2, "0")}`)

        //date
        let dateEpoch = new Date (match.start_time * 1000);
        let dateHuman = `${dateEpoch.toUTCString()} `;
        // ${dateEpoch.toLocaleString()}
        createNewThElement (dateHuman)
    }

    async function fillTheTable(){
        let table = document.getElementById("table")
        let recentMatches = await getRecentMatches(RECENT_MATCHES);

        Array.from(recentMatches).forEach((match, index) => {
            createTableContent(match, index)
        })


    }
    fillTheTable()
}
