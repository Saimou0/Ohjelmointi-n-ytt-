export class textManager {
    constructor() {
        this.text1 = "Yksi senttimetriä leveä ja korkea neliö muodostaa yhden neliösenttimetrin (1cm * 1cm = 1 cm2) neliön.";
        
        this.text2 = "Kymmenen neliösenttimetriä vierekkäin ja päällekkäin, muodostavat sadan neliösenttimetrin (10cm * 10cm = 100 cm2) neliön.";
        
        this.text3 = "Kymmenen neliösenttimetrin neliöitä tarvitaan kuusi, jotta voidaan muodostaa kuusi sivuinen tuhannen kuutiosenttimetrin (10cm * 10cm * 10cm = 1000 cm3) kuutio.";
        
        this.text4 = "Tuhannen kuutiosenttimetrin kuutioita tarvitaan kymmenen vierekkäin, päällekkäin ja peräkkäin muodostaen miljoonan kuutiosenttimetrin (100cm * 100cm * 100cm = 1 000 000 cm3) kuution.";
        
        this.text5 = "Miljoona kuutiosenttimetriä on tuhat kuutiodesimetriä (10dm * 10dm * 10m = 1000 dm3) tai yksi kuutiometri (1m * 1m * 1m = 1 m3). Kuutiometrin kuutioon menee tuhat litraa nestettä."
    }

    getText(index) {
        switch (index) {
            case 1:
                return this.text1;
            case 2:
                return this.text2;
            case 3:
                return this.text3;
            case 4:
                return this.text4;
            default:
                return "Error: No text found";
        }
    }

    setTextToPage(index) {
        document.getElementById("descriptiveText").innerHTML = this.getText(index);
    }

    setTextToSecondP() {
        document.getElementById("descriptiveText2").style.display = "block";
        document.getElementById("descriptiveText2").innerHTML = this.text5;
    }
}