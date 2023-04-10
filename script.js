let prices = [];
let basket = [];
let amounts = [];
let like = false;


window.onscroll = function() {
    let shoppingCart = document.getElementById('shoppingCart ');
    console.log('Hallo');
    if (window.scrollY > 0) {
        shoppingCart.style = 'top: 0';
    } else {
        shoppingCart.style = 'top: 100px';
    }
};


function renderBasket() {
    let shoppingCart = document.getElementById('shoppingCart ');
    for (let i = 0; i < basket.length; i++) {
        let item = basket[i];
        let price = prices[i];
        let amount = amounts[i];
        shoppingCart.innerHTML += `
        <div>
            ${amount}x ${item}: ${price}
        </div>`;
    }
}


function addToBasket(food, price) { // food, price wichtig zu wissen was User gedrückt hat
    let index = basket.indexOf(food); //indexOf  gibt standard  -1 wenn Pizza nicht gefunden in basket 
    let orderlist = document.getElementById('orderlist ');
    if (index == -1) { // = Pizza noch nicht in der Liste!!!!!!!
        basket.push(food);
        prices.push(price);
        amounts.push(1);
        orderlist.innerHTML += template(food, price);
    } else {
        amounts[index]++;
        document.getElementById(food + ' ').innerHTML = amounts[index];
    }
    updateDisplays();
    

    if (document.getElementById('dialog-shoppingCart').innerHTML != ''){
        shoppingCart();
    }
}


function modify(food, operation) {
    let index = basket.indexOf(food);
    if (operation == 'add') {
        amounts[index]++
    } else if (operation == 'sub') {
        amounts[index]--
            if (amounts[index] < 1) {
                document.getElementById("food" + food + " ").remove(); // löscht auch die food div mit, weil food food div die parent div ist
                basket.splice(index, 1);
                amounts.splice(index, 1);
                prices.splice(index, 1);
            }
    }

    let f = document.getElementById(food + ' '); // food div
    if (f != null) { // check ob f existiert , d.h. nicht null, weil evtl. oben gelöscht 
        f.innerHTML = amounts[index];
    }
    updateDisplays();

    

    if (document.getElementById('dialog-shoppingCart').innerHTML != ''){
        shoppingCart();
    }

    
}


function pay_summary() {
    let sum = 0;

    for (let i = 0; i < prices.length; i++) {
        sum += prices[i] * amounts[i];

    }
    let finalSum = sum + 1.95;
    return [sum.toFixed(2), finalSum.toFixed(2), (15 - finalSum).toFixed(2)]
}


function updateDisplays() {
    let min_info_div = document.getElementById('remove ');
    let pay_div = document.getElementById("paybutton ");
    let sum_div = document.getElementById('Sum ');
    let prep_div = document.getElementById('order ');

    if (pay_summary()[1] >= 15) {
        pay_div.disabled = false;
        pay_div.style.backgroundColor = "blue";
        pay_div.style.cursor = "";
        pay_div.style.color = "white";
        min_info_div.style.display = "none";
    } else if (pay_summary()[1] < 15) {
        pay_div.disabled = true;
        pay_div.style.color = "";
        pay_div.style.cursor = "not-allowed";
        pay_div.style.backgroundColor = "";
        min_info_div.style.display = "";

    }

    document.getElementById('Zwischensumme').innerHTML = pay_summary()[0] + "€";
    document.getElementById('Gesamt').innerHTML = pay_summary()[1] + "€";
    document.getElementById('minprice').innerHTML = pay_summary()[2] + "€";
    pay_div.innerHTML = "Bezahlen (" + pay_summary()[1] + "€)";


    if (basket.length >= 1) {
        sum_div.style.display = "";
        prep_div.style.display = "none";
    } else if (basket.length < 1) {
        sum_div.style.display = "none";
        prep_div.style.display = "";
    }

    responsiveButton();
}


function kontaktInfo() {
    let infoContainer = document.getElementById('infoContainer');
    infoContainer.innerHTML = templateInfo();
    document.body.style = 'overflow: hidden;';
}


function closeInfo() {
    document.getElementById('infoContainer').innerHTML = '';
    document.getElementById('dialog-shoppingCart').innerHTML = '';
    document.body.style = 'overflow: auto;';
}


function Like() {
    like = !like;

    if (like) {
        document.getElementById('like').src = 'img/favorite-5-32.png';

    } else {
        document.getElementById('like').src = 'img/herz.png';
    }
}


function responsiveButton() {
    
    let responsiveBasket = document.getElementById('responsiveButton');
    /*
    while (responsiveBasket.firstChild) { // damit nicht unendlich viele neue Kopien existieren 
        responsiveBasket.removeChild(responsiveBasket.firstChild);
    }

    
        let pay_div = document.getElementById("paybutton ");
        let pay_copy = pay_div.cloneNode(true); // kopieren von paybutton und seinen eigenschaften
        pay_copy.innerHTML = "Warenkorb (" + pay_summary()[1] + "€)";
        responsiveBasket.appendChild(pay_copy); // hänge an res.Bask. die kopie hinten dran
    }
    */

    if (basket.length > 0) {
        responsiveBasket.innerHTML = `<button id="paybutton2" class="pay-button" >Warenkorb (${pay_summary()[1]} €)</button>`;
        document.getElementById('paybutton2').style.backgroundColor = "blue";
    }

    
}


function shoppingCart() {
    let Dialog = document.getElementById('dialog-shoppingCart');
    let nextProduct = document.getElementById('newProduct');
    if (pay_summary()[1] >= 15) {
        Dialog.innerHTML = templateResponsiv2();
    }
    else {
        Dialog.innerHTML = templateResponsiv();
        nextProduct.style.backgroundColor = "white";
    }
    
    document.body.style = 'overflow: hidden;';    
}


function templateResponsiv() {
    return `
    <div class="dialog-shoppingCart" id="dialog-shoppingCart">
    <div>
        <div class="infoText">
            <h3>Warenkorb</h3>
            <button class="close-btn" onclick="closeInfo()">
              <img class="imgX" src="img/x.png">
            </button>
        </div>

    

    ${document.getElementById('orderlist ').innerHTML}
    

    <div class="sum">
        <div class="r-text">
            <div class="remove" id="remove ">
                <div class="miniText">
                    <div>
                        <span class="mini">Benötigter Betrag, um den Mindestbestellwert zu erreichen</span>
                    </div>
                    <div>
                        <span id="minprice" class="mini-price">${pay_summary()[2]} €</span>
                    </div>
                </div>
                <div>
                    <p class="minSave">Leider kannst du noch nicht bestellen. Pizza Saar liefert erst ab einem Mindestbestellwert von 15,00€(exkl. Lieferkosten). </p>
                </div>
            </div>
          
        </div>

    </div>

    <div class="divergence">
    <div>
     <div class="tableSum">
        <div class="tableCart">
            <span>Zwischensumme</span>
            <span id="Zwischensumme"></span>
            <span>${pay_summary()[0]} €</span>
        </div>
        <div class="tableCart">
            <span>Lieferkosten</span>
            <span>1.95€</span>
        </div>
        <div class="tableCart">
            <span class="td-pizza">Gesamt</span>
            <span class="td-pizza" id="Gesamt"></span>
            <span>${pay_summary()[1]} €</span>
        </div>

     </div>   
     <div id="newProduct" class="newProdukt" >
        <span class="newInfo" onclick="closeInfo()">Weitere Produkte hinzufügen</span>
     </div>
    </div>
    </div>

</div>
    `;
}


function templateResponsiv2() {
    return `
    <div class="dialog-shoppingCart" id="dialog-shoppingCart">
    <div>
        <div class="infoText">
            <h3>Warenkorb</h3>
            <button class="close-btn" onclick="closeInfo()">
              <img class="imgX" src="img/x.png">
            </button>
        </div>

    </div>

    ${document.getElementById('orderlist ').innerHTML}

    <div class="divergence">
    <div>
     <div class="tableSum">
        <div class="tableCart">
            <span>Zwischensumme</span>
            <span id="Zwischensumme"></span>
            <span>${pay_summary()[0]} €</span>
        </div>
        <div class="tableCart">
            <span>Lieferkosten</span>
            <span>1.95€</span>
        </div>
        <div class="tableCart">
            <span class="td-pizza">Gesamt</span>
            <span class="td-pizza" id="Gesamt"></span>
            <span>${pay_summary()[1]} €</span>
        </div>

     </div>   
     <div id="newProduct" class="newProdukt" >       
       <span class="newInfo" onclick="closeInfo()">Bezahlen (${pay_summary()[1]} €) </span>
     </div>
    </div>
    </div>

</div>
    `;
}


function template(food, price) {
    return `
          
     <div class="content-right" id="food${food} "> 
           <div class="sum-border">
             <table class="table-width">
                  <tbody>
                       <tr class="all-pizza">
                           <td id="${food} " class="td-amount">1</td>
                           <td id="td-pizza" class="td-pizza">${food}</td>
                           <td id="td-price" class="td-price">${price } €</td>
                       </tr>
                       <tr>
                           <td></td>
                           <td class="add">Anmerkung hinzüfügen</td>
                           <td class="buttons">
                               <img class="plus" id="test1" src="img/plus-2-32.png" onclick="modify('${food}', 'add')">
                               <img class="plus" id="test2" src="img/minus-2-32.png" onclick="modify('${food}', 'sub')">
                           </td>
                       </tr>
                   </tbody>
               </table>
           </div>
      </div>
  `;
}


function templateInfo() {
    return `
      <div id="infoContainer" class="dialog" onclick="closeInfo()">
            <div class="restaurant-info">

                <div class="infoText">
                    <h4> Über das Restaurant</h2>
                    <button class="close-btn" onclick="closeInfo()">
                        <img class="imgX" src="img/x.png">
                    </button>
                </div>
         
                <div class="report">
                    <span>Bewertungen</span>
                    <span class="reportInfo">Info</span>
                </div>
         
         
                <iframe class="iframe" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.6744697366366!2d7.005009214951765!3d49.2446607813861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795b6bd2a4699fd%3A0x79a5a0baeede3662!2sDaimlerstra%C3%9Fe%2026%2C%2066123%20Saarbr%C3%BCcken!5e0!3m2!1sde!2sde!4v1649262361053!5m2!1sde!2sde"
                width="800" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
         
                <div class="headerInfo">
                    <img class="infoImg" src="img/time-12-32.png">
                    <h4>Lieferzeiten</h3>
                </div>

                <div class="dix">
                    <div class="dix1">
                        <span class="data">Montag</span>
                        <span class="data">Dienstag</span>
                        <span class="data">Mittwoch</span>
                        <span class="data">Donnerstag</span>
                        <span class="data">Freitag</span>
                        <span class="data">Samstag</span>
                        <span class="data">Sonntag</span>
                    </div>
                    <div class="dix1">
                        <span class="data">08.00 - 21.00 Uhr</span>
                        <span class="data">08.00 - 21.00 Uhr</span>
                        <span class="data">08.00 - 21.00 Uhr</span>
                        <span class="data">08.00 - 21.00 Uhr</span>
                        <span class="data">08.00 - 21.00 Uhr</span>
                        <span class="data">08.00 - 22.00 Uhr</span>
                        <span class="data">Momentan keine Lieferung</span>
                    </div>
                </div>

                <div class="headerInfo">
                    <img class="infoImg" src="img/motorcycle-32.png">
                    <h4>Lieferkosten</h3>
                </div>

                <div class="dix">
                    <div class="dix1">
                         <span> Mindestbestellwert</span>
                         <span> Lieferkosten</span>
                    </div>

                    <div class="dix1">
                         <span>15,00 €</span>
                         <span> 1, 95€ </span>
                    </div>
                </div>

                <div class="headerInfo">
                     <img class="infoImg" src="img/credit-card-6-32.png">
                     <h4>Bezahlmethoden</h3>
                </div>

               <div class="infoImages">
                    <img class="payCard" src="img/database-5-32.png">
                    <img class="payCard" src="img/money-2-32.png">
                    <img class="payCard" src="img/cart-68-32.png">
                    <img class="payCard" src="img/paypal-2-32.png">
                    <img class="payCard" src="img/credit-card-6-32 (1).png">
                    <img class="payCard" src="img/procent-badge-32.png">
               </div>

               <div class="headerInfo">
                  <img class="infoImg" src="img/bank-4-32.png">
                  <h4>Impressum</h3>
               </div>
               <div class="impressum">
                <span class="data">Pizza Saar</span>
                <span class="data">Tijana Couturier</span>
                <span class="data">Pizza Saar.GmbH</span>
                <span class="data">Created my fee logo at LogoMark.com</span>
              </div>
               
            </div>
     <div>
     
    `;
}