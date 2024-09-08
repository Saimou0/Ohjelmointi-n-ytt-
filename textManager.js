export class textManager {
    constructor() {
        this.text1 = "Yksi senttimetriä leveä ja korkea neliö muodostaa yhden neliösenttimetrin (1cm * 1cm) neliön.";
        
        this.text2 = "Kymmenen neliösenttimetriä vierekkäin ja päällekkäin, muodostavat sadan neliösenttimetrin (10cm * 10cm) neliön.";
        
        // this.text3 = "Kuusi, kymmenen neliösenttimetrin neliötä muodostavat yhden, kymmenen kuutiosenttimetrin (10cm * 10cm * 10cm) kuution.";
        this.text3 = "Kymmenen neliösenttimetrin neliöitä tarvitaan kuusi, jotta voidaan muodostaa kuusi sivuinen kymmenen kuutiosenttimetrin (10cm * 10cm * 10cm) kuutio.";
        
        // this.text4 = "Kymmenen, kymmenen kuutiosenttimetrin kuutiota vierekkäin, päällekkäin ja peräkkäin muodostavat tuhannen kuutiosenttimetrin (100cm * 100cm * 100cm) kuution, toisin sanoen yhden kuutiometrin (1m * 1m * 1m) kuution.";
        this.text4 = "Kymmenen kuutiosenttimetrin kuutioita tarvitaan kymmenen vierekkäin, päällekkäin ja peräkkäin muodostaen tuhannen kuutiosenttimetrin (100cm * 100cm * 100cm) kuution, toisin sanoen yhden kuutiometrin (1m * 1m * 1m) kuution.";
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
}