import RME, { App, Component, bindState } from '../../src/index';

RME.storage('countryList', [
    {country: 'Finland', capital: 'Helsinki'}, {country: 'Sweden', capital: 'Stockholm'}, {country: 'Norway', capital: 'Oslo'},
    {country: 'Iceland', capital: 'Reykjavik'}, {country: 'England', capital: 'London'}, {country: 'America', capital: 'Washington'}, 
    {country: 'Mexico', capital: 'Mexico City'}, {country: 'Peru', capital: 'Lima'}, {country: 'Egypt', capital: 'Kairo'}, {country: 'China', capital: 'Beijing'},
    {country: 'Japan', capital: 'Tokyo'}, {country: 'South Korea', capital: 'Seoul'}, {country: 'Malaysia', capital: 'Kuala Lumpur'}, {country: 'Namibia', capital: 'Windhoek'}, {country: 'South Africa', capital: 'Cape Town'}]);

const FilterExample = props => ({
    fragment: {
        h2: 'Filter Example',
        'input[type=text][placeholder=Type to Filter Country]': {
            onInput: event => 
                App.setState(props.stateRef, {
                    rows: RME.storage('countryList')
                        .filter(row => row.country.toLowerCase().search(event.target.value) > -1)
                })
        },
        MyTable: {rows: props.rows}
    }
});

const MyTable = props => ({
    table: props.rows.map(row => ({
        tr: [
            {td: row.country},
            {td: row.capital}
        ],
    }))
});

Component(bindState(FilterExample, { rows: RME.storage('countryList') }), MyTable);