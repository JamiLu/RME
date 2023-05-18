import { Component, CSS, useValue } from '../../src/index';

CSS(`
table td {
    padding: 5px;
    border: 1px solid #000000;
}
`);

const [getCountryList] = useValue([
    {country: 'Finland', capital: 'Helsinki'}, {country: 'Sweden', capital: 'Stockholm'}, {country: 'Norway', capital: 'Oslo'},
    {country: 'Iceland', capital: 'Reykjavik'}, {country: 'England', capital: 'London'}, {country: 'America', capital: 'Washington'}, 
    {country: 'Mexico', capital: 'Mexico City'}, {country: 'Peru', capital: 'Lima'}, {country: 'Egypt', capital: 'Kairo'}, 
    {country: 'China', capital: 'Beijing'}, {country: 'Japan', capital: 'Tokyo'}, {country: 'South Korea', capital: 'Seoul'}, 
    {country: 'Malaysia', capital: 'Kuala Lumpur'}, {country: 'Namibia', capital: 'Windhoek'}, {country: 'South Africa', capital: 'Cape Town'}]);

export const FilterExample = ({ rows }, ops) => {
    if (!rows) {
        ops.asyncTask(() => ops.setState({rows: getCountryList()}));
    }

    return {
        _: {
            h2: 'Filter Example',
            'input[type=text][placeholder=Type to Filter Country]': {
                onInput: event => 
                    ops.setState({
                        rows: getCountryList()
                            .filter(row => `${row.country}${row.capital}`.toLowerCase().search(event.target.value) > -1)
                    })
            },
            MyTable: { rows }
        }
    }
};

const MyTable = ({ rows = [] }) => ({
    table: rows.map(row => ({
        tr: [
            { td: row.country },
            { td: row.capital }
        ],
    }))
});

Component(FilterExample, MyTable);
