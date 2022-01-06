using {mycap.db as myapp} from '../db/schema';

service CatalogService @(path : '/srv') {

    entity BenefitsArea as
        select from myapp.BenefitsArea {*};
    entity CountryGrouping as
        select from myapp.CountryGrouping {*};
};

annotate CatalogService.CountryGrouping with @UI : {
    LineItem : [
        {Value : BENAREA,      Label : 'Benefit Area'},
        {Value : Ctrykey,      Label : 'Country Key'},
        {Value : Ctryvalue,  Label : 'Country Name'}
    ]
};
annotate CatalogService.BenefitsArea with @UI : {
    LineItem : [
        {Value : BENAREA,      Label : 'Benefit Area'},
        {Value : DESCP,  Label : 'Description'},
        {Value : CONGRP, Label : 'Country Grouping'}
    ]
};