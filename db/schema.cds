namespace mycap.db;



entity BenefitsArea {
    key BENAREA : String(10); // Benefit Area code
    DESCP:  String(50); //Benefit Area Description
    CONGRP:   String(10); //country grouping
};

entity CountryGrouping {
    key Ctrykey :  String(10); //Country Key
    BENAREA :  String(50); // Benefit Area code
    Ctryvalue:  String(10); // Country Name
};
