import './keypad';
import './screen';

App.component({ calculator: (props) => ({
    div: [
        {resultScreen: {
            result: props.result,
            statement: props.statement
        }},
        {keyPad: {
            rows: [
                {
                    col1: {operationButton: {text: '/'}},
                    col2: {operationButton: {text: '*'}},
                    col3: {operationButton: {text: '-'}},
                    col4: {operationButton: {text: '+'}}
                },
                {
                    col1: {numberButton: {text: '7'}},
                    col2: {numberButton: {text: '8'}},
                    col3: {numberButton: {text: '9'}},
                    col4: {rowspan: 3, operationButton: {text: 'C', class: 'w3-pale-red', styles: {height: '458px'}}}
                },
                {
                    col1: {numberButton: {text: '4'}},
                    col2: {numberButton: {text: '5'}},
                    col3: {numberButton: {text: '6'}},
                    col4: {}
                },
                {
                    col1: {numberButton: {text: '1'}},
                    col2: {numberButton: {text: '2'}},
                    col3: {numberButton: {text: '3'}},
                    col4: {}
                },
                {
                    col1: {numberButton: {text: '0'}},
                    col2: {colspan: 3, operationButton: {text: '=', class: 'w3-pale-green'}},
                    col3: {},
                    col4: {}
                }
            ]
        }}
        // {'div.button-row': [
        //     {operationButton: {
        //         text: '/'
        //     }},
        //     {operationButton: {
        //         text: '*'
        //     }},
        //     {operationButton: {
        //         text: '-'
        //     }},
        //     {operationButton: {
        //         text: '+'
        //     }},
        // // ]},
        // // {'div.button-row': [
        //     {numberButton: {
        //         text: 7
        //     }},
        //     {numberButton: {
        //         text: 8
        //     }},
        //     {numberButton: {
        //         text: 9
        //     }},
        //     {operationButton: {
        //         text: 'C',
        //         class: 'w3-pale-red',
        //         // styles: {height: 300+'px'}
        //     }},
        // // ]},
        // // {'div.button-row': [
        //     {numberButton: {
        //         text: 4
        //     }},
        //     {numberButton: {
        //         text: 5
        //     }},
        //     {numberButton: {
        //         text: 6
        //     }},
        // // ]},
        // // {'div.button-row': [
        //     {numberButton: {
        //         text: 1
        //     }},
        //     {numberButton: {
        //         text: 2
        //     }},
        //     {numberButton: {
        //         text: 3
        //     }},
        // // ]},
        // // {'div.button-row': [
        //     {numberButton: {
        //         text: 0
        //     }},
        //     {operationButton: {
        //         text: '=',
        //         // styles: {width: 300+'px'},
        //         class: 'w3-pale-green'
        //     }}
        // ]},
    ]
})})();