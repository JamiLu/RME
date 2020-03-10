import './keypad';
import './screen';

const Calculator = props => ({
    div: [
        {ResultScreen: {
            statement: props.statement,
            result: props.result
        }},
        {KeyPad: {
            calculatorRef: props.stateRef,
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
    ]
});

Component(bindState(Calculator, {statement: '', result: ''}));