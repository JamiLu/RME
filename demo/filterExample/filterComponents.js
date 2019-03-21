import RME, { App, Template } from '../../src/index';

RME.storage('countryList', [
    {country: 'Finland', capital: 'Helsinki'}, {country: 'Sweden', capital: 'Stockholm'}, {country: 'Norway', capital: 'Oslo'},
    {country: 'Iceland', capital: 'Reykjavik'}, {country: 'England', capital: 'London'}, {country: 'America', capital: 'Washington'}, 
    {country: 'Mexico', capital: 'Mexico City'}, {country: 'Peru', capital: 'Lima'}, {country: 'Egypt', capital: 'Kairo'}, {country: 'China', capital: 'Beijing'},
    {country: 'Japan', capital: 'Tokyo'}, {country: 'South Korea', capital: 'Seoul'}, {country: 'Malaysia', capital: 'Kuala Lumpur'}, {country: 'Namibia', capital: 'Windhoek'}, {country: 'South Africa', capital: 'Cape Town'}]);

RME.component({ filterExample: () => 
    ({div: {
        h2: () => 'Filter Example',
        'input[type=text][placeholder=Type to Filter Country]': {
            onInput: (event) => App.setState({borderTable: {rows: RME.storage('countryList').filter(row => row.country.toLowerCase().search(event.target.value) > -1)}})
        },
        borderTable: {rows: RME.storage('countryList')}
    }})
});

//Table without style settings.
App.component({ myTable: props => 
    ({table: props.rows.map((row) => ({
        tr: [
            {td: () => row.country},
            {td: () => row.capital}
        ],
    }))})
})();

App.component({ borderTable: props => {
    let bor = {border: '1px #000000 solid', borderCollapse: 'collapse'}
    return Template.resolve({
        table: props.rows.map(row => ({
            tr: [
                {td: {text: row.country, styles: bor}},
                {td: {text: row.capital, styles: bor}}
            ]
        }))
    }).setStyles(bor);
}})();