//Globala variabler.

var newTiles,//Referensarray till bilderna för 4 nya brickor.
startKnapp,//Variabel som tilldelas spelets startknapp.
nyaKortKnapp,//Variabel som tilldelas knappen som genererar fyra nya kort.
rutor,//Array som tilldelas spelplanens rutor, d.v.s. dit kort skall dras.
dragord,//Variabel för en ruta som dras 'src'.
dragOrdId,//Variabel för en ruta som dras 'id'.
counter,//Räknarvariabel, som håller koll på antal givningar av fyra kort.
array,//Array som tilldelas de nummer som dragits för en spelrunda.
fylldaRutor,//Räknarvariabel som håller koll på antalet fyllda rutor.
totalPoints,//Variabel för område för utskrift av det totala antalet poäng.
cookiePoints,//Det totala antalet poäng för alla spel, som extraheras ur en cookie om en sådan finns.
totalSpel,//Variabel för område för utskrift av det totala antalet spel.
cookieSpel,//Det totala antalet spel, som extraheras ur en cookie om en sådan finns.
totPoints,//Det totala antalet poäng, som ändras under spelets gång. 
totSpel,//Det totala antalet spel, som ändras under spelets gång.
msgElem,//Variabel som tilldelas området för utskrift till användaren.
cookie,//Variabel för hämtning av den cookie som håller koll på en användarens totala antal spel och poäng.
delning,//Variabel som delar innehållet i cookien 'cookie', men ',' som separator.
tecken;//Referens till områden för utskrift av kryss eller bock.

function init() {

    newTiles = document.getElementById("newTiles").getElementsByTagName("img");//Tilldelas bildelementen i 'newTiles'.
    rutor = document.getElementById("board").getElementsByTagName("img");//Tilldelas alla bildelement i 'board'.
    startKnapp = document.getElementById("newGameBtn");//Referens till startknappen.
    startKnapp.onclick = startaSpel;//Funktionen 'startaSpel' anropas vid tryck på 'startKnapp'.
    nyaKortKnapp = document.getElementById("newTilesBtn");//Referens till knapp för att generera nya kort.
    nyaKortKnapp.onclick = nyaKort;//Funktionen 'nyaKort' anropas vid tryck på 'nyKortKnapp'.
    startKnapp.disabled = false;//Startknapp startar som aktiv.
    nyaKortKnapp.disabled = true;//Knappen för nya kort startar som inaktiv.
    totalPoints = document.getElementById("totPoints");//Tilldelas det span-element som innehåller totalt antal poäng.
    totalSpel = document.getElementById("countGames");//Tilldelas det span-element som innehåller totalt antal spel.
    msgElem = document.getElementById("message");//Tilldelas div-området för utskrift till användaren.
    tecken = document.getElementsByClassName("mark");//Tilldelas alla element som innehar klassen 'mark'.

    /*De poäng och antal spel som eventuellt finns lagrade hämtas. 
    Om annat än 0 finns ersätter deras olika värden de nollor som syns för antal poäng och spel i 'index.html'.
    Cookien, som lagras båda antal spel och poäng, delas genom att använda ',' som skiljare.*/
    cookie = getCookie("spelcookie");
     
    if (cookie!= null) {
        delning = cookie.split(",");
        cookiePoints = delning[0];//Antal poäng fås genom att värdet innan ',' sparas i cookien för lagrade poäng.
        cookieSpel = delning[1];//Antal spel fås genom att värdet efter ',' sparas i cookien för lagrade antal spel.
        totalSpel.innerHTML = cookieSpel;//Det totalt antalet spel och poäng skrivs ut på deras avsedda platser.
        totalPoints.innerHTML = cookiePoints;
    }

}//init

window.addEventListener("load",init);//Funktionen 'init' anropas när sidan laddas.

function startaSpel () {
     
    for (let i = 0; i < tecken.length; i++) tecken[i].innerHTML = "";//De bockar eller kryss som finns efter tidigare 
    //omgångar tas bort genom att använda deras gemensamma klassnamn. Den lokala variabeln 'i' används för genomsökning.

    totPoints = parseInt(totalPoints.innerHTML);//Det totala antalet poäng tas ur utskriften av detta på sidan.
    totSpel = parseInt(totalSpel.innerHTML);//Det totala antalet spel tas ur utskriften av detta på sidan.
    fylldaRutor = 0;//En räknare för antal fyllda rutor, som vid antalet 16 (alla fyllda), kommer avsluta spelet.
    startKnapp.disabled = true;//Startknappen inaktiveras.
    nyaKortKnapp.disabled = false;//Nyakortknappen aktiveras.
    for (let i = 0; i < rutor.length; i++) {
        /*Alla rutor fylls med den angivna tomma bilden. Från eventuella tidigare omgångar tas klassen 'filled' bort
        och ersätts av 'empty'. Färg ändras dock manuellt till den som tillhör klassen "empty" då den tillfälligt gröna 
        färgen som visas när en bricka liggeröver en ruta överrumplar klassernas färger av kaskadprioriterinssjäl, 
        och att jag därmed gjorde en enkel lösning att ändra den manuellt till färgen som tillhör "filled" när ett 
        nummer placerats i en ruta. Den lokala variabeln 'i' används för genomsökning.*/
        rutor[i].src = "img/empty.png";
        rutor[i].classList.add("empty");
        rutor[i].classList.remove("filled");
        rutor[i].style.backgroundColor = "transparent";
    }
    msgElem.innerHTML = "";//Tidigare utskrift av antalet poäng för en spelrunda tas bort.
    array = [];//Array för de nummer som dragits för en aktuell runda.
}

function nyaKort () {
/*4 nya kort har givits, knappen för att få nya kort inaktiveras då tills räknaren 'counter', med startvärde 0,
 når 4. Ett nummer mellan 1 och 40 slumpas fram. Om detta ej finns i 'array' läggs det till. 'array' innehåller alla
 siffror som givits i spelrundan, medan 'array2' endast innehåller de 4 siffror som dragits vid den 
 senaste knapptryckningen. På detta sätt kan sedan rätt index tilldelas en bild. Skulle enbart 'array' användas
 skulle enbart de 4 första siffrorna ges varje gång eftersom det motsvarar längden på de 4 nya korten.
 Den lokala variabeln 'i' används för genomsökning.*/
    nyaKortKnapp.disabled = true;
    let array2 = [];
    counter = 0;
    for (let i = 0; i < 4; i++) {
        let nummer = Math.floor(Math.random() * 40) + 1;
        if (!array.includes(nummer)) {
            array.push(nummer);
            array2.push(nummer);
        }

        else i--;//Om det slumpmässigt valda talet redan finns i 'array' minskas värdet på 'i' med 1 och ett
        //nytt nummer slumpas fram, så att antalet nya kort blir rätt.

    } 

    for (let i = 0; i < newTiles.length; i++) {
        /*Platserna för nya kort fylls med en bild, som hittas tack vare att bildens namn motsvarar ett nummer i 'array2'.
        Korterns platser tilldelas klassen 'filled' och sätts till 'draggable'. För senare identifikation tilldelas
        ett id till varje kort som motsvarar dess nummer. Detta används senare för att få ut ett nummervärde ur bilderna.
        2 olika funktioner anropas också när ett kort börjar respektive slutar dras. 
        Den lokala variabeln 'i' används för genomsökning.*/
        newTiles[i].src = "img/" + array2[i] + ".png";
        newTiles[i].setAttribute("class", "filled");
        newTiles[i].draggable = true;
        newTiles[i].id = array2[i];
        newTiles[i].addEventListener("dragstart",draOrd);
        newTiles[i].addEventListener("dragend",slutaDraOrd);
    }
}

function draOrd () {
    /*När ett ord börjar dras genomsöks alla rutor. Om de ej innehåller klassen 'filled', vilket i detta fall
    innebär att de är tomma, så ges de tomma rutorna olika eventlisteners för 'dragover', 'dragleave' och 'drop'.
    Den lokala variabeln 'i' används för genomsökning.*/
    for (let i = 0; i < rutor.length; i++) {
       if (!rutor[i].classList.contains("filled")) {
            rutor[i].addEventListener("dragover",overRuta);
            rutor[i].addEventListener("dragleave",lamnaRuta);
            rutor[i].addEventListener("drop",overRuta);
       }  
    }
    dragord = this.src;//Det ord som dras id och src sparas i variabler för senare användning.
    dragOrdId = this.id;

}

function slutaDraOrd () {
    for (let i = 0; i < rutor.length; i++) {//Eventlisterners för lagda kort tas bort så att de ej längre kan flyttas.
        rutor[i].removeEventListener("dragover",overRuta);
        rutor[i].removeEventListener("dragleave",lamnaRuta);
        rutor[i].removeEventListener("drop",overRuta);
    }
}

function overRuta (e) {//Skickar med eventobjektet som ett ingående argument för att använda 'e.type == "drop"'.
    e.preventDefault();//Förhindrar förinställt beteende för webbläsaren vid 'drag and drop'.
    
    this.style.backgroundColor = "green";//När ett kort hålls över en ruta byts bakgrundsfärgen för rutan till grön.

    /*När eventobjektet släpps används de variabler för src och id som sparades för objektet, och
    spelrutan får då samma värden.
    Klassen 'filled'* läggs till och 'empty' tas bort. Färgen som sattes till grön ovan ändras då till samma färg
    som klassen 'filled har', då den annars kvarstod som grön trots klassändringarna. Att klassen ändras
    ses genom att ramen ändras automatiskt.
    Räknaren som går upp till 4 och antalet fyllda rutor adderas med 1 till sitt tidigare värde.*/
    if (e.type == "drop") {
        this.src = dragord;
        this.id = dragOrdId;
        this.style.backgroundColor = "#FFF";
        this.classList.add("filled");
        this.classList.remove("empty");
        counter ++;
        fylldaRutor++;

        for (let i = 0; i < newTiles.length; i++) {
            /*De 4 korten genomsöks, om det släppta ordet finns bland dem sätts det till 'draggable = false',
            bilden fylls med en tom bild och klassen sätts till 'empty'.*/
            if (this.src == newTiles[i].src) {
                newTiles[i].draggable = false;
                newTiles[i].src = "img/empty.png";
                newTiles[i].setAttribute("class", "empty");
            }
        }

        for (let i = 0; i < rutor.length; i++) {
            /*Spelplanens rutor genomsöks, om det finns rutor som är tomma och räknaren når 4 aktiveras knappen
            för nya kort. Den lokala variabeln 'i' används för genomsökning.*/
            if (rutor[i].classList.contains("empty") && counter == 4) {
                nyaKortKnapp.disabled = false;
            }
        }

        if (fylldaRutor == 16) {//Om inga tomma rutor finns kvar inaktiveras knappen för nya kort, och startknappen 
            //aktiveras. Funktionen 'räknaPoäng anropas också.'
            nyaKortKnapp.disabled = true;
            startKnapp.disabled = false;
            raknaPoang();
        }
    }
}

function lamnaRuta (e) {//När event-objektet lämnar en ruta ändras färgen tillbaks till transparent.
    e.preventDefault();//Förhindrar förinställt beteende för webbläsaren vid 'drag and drop'.
    this.style.backgroundColor = "transparent";
}

function raknaPoang () {
    //Antal spel och poäng för aktuell runda sätts till 0, deras värden adderas senare till de totala antalen 
    //och sparas i olika cookies.
    let antalSpel = 0;//Variabel för aktuellt spel.
    let points = 0;//Variabel för aktuellt spels poäng.

    /*För alla 8 olika rader, som har varsitt klassnamn, hämtas varje korts id via en variabel med alla
    element av klassen (s1, s2 osv.) och läggs i 2 likadana arrayer. Detta via en loop där varje klass
    gås igenom med hjälp av variabeln 'number', som håller genomsöker 's1', 's2' osv.
    En av de identiska arrayerna kommer sorteras i nummerordning och jämföras med originalet för att se om den aktuella raden
    lades i nummerordning eller ej. De Lokala variablerna 'i' och 'j' (för den nästlade for-satsen) används för genomsökning.
   Arrayerna jämförs genom att arraykopian sorteras i nummerordning och båda arrayer omvandlas till strängar.
    Om de matchar ökas antalet poäng med 1 och det motsvarande fältet för kryss eller bock fylls med bock. 
    Matchar de ej skrivs istället ett kryss in.*/

    for (let i = 0; i < 8; i++) {
        let number = i+1;//Variabel som ger olika klassnamn för genomsökningen, när 'i' är noll genomsöks t.ex. 's1.'
        let s = document.getElementsByClassName("s" + number);//Variabel för de olika s-klasserna, där 'i = 0' motsvarar klassen 's1'.
        let a = [], ab = [];//Två till en början identiska arrayer, som senare jämförs när en av dem sorterats i nummerordning.
        for (let j = 0; j < s.length; j++) {
            a.push(s[j].id);//Id för den aktuella brickan, som motsvarar brickans nummer, läggs in i 'a'.
        }
    
        ab = a.slice();//'a' kopieras till 'ab'.
    
        if (a.toString() === ab.sort(function(a, b){return a-b;}).toString()) {
            points++;
            tecken[i].innerHTML = "&#9989";
        } else tecken[i].innerHTML = "&#10060;";
    }

    antalSpel++; //Antal spel ökas med 1.
    let cookieArray = [];//Array för poäng och antal spel, som ska skickas i en cookie.
    totSpel += antalSpel; //Det aktuella spelets poäng och antal spel adderas till totalsummorna för dessa.
    totPoints += points;
    cookieArray.push(totPoints);//Värdena läggs i arrayen.
    cookieArray.push(totSpel);

    msgElem.innerHTML = "Du fick " + points + " poäng av 8 möjliga.";//Antalet poäng skrivs ut.

    totalSpel.innerHTML = totSpel;//Det totalt antalet spel och poäng skrivs ut på deras avsedda platser.
    totalPoints.innerHTML = totPoints;
   
    /*Det totalt antalet poäng och spel läggs i en cookie, som med hjälp av 'cookies.js' enkelt tilldelas
    siffran 30 för 30 dagars utgångstid.*/
    setCookie("spelcookie", cookieArray, 30);

}
