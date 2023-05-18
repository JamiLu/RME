import { Component } from '../../src';

import './keypad';
import './screen';

export const Calculator = () => ({
    div: [
        {ResultScreen: {}},
        {KeyPad: {
            rows: [
                {
                    col1: {OperationButton: {text: '/'}},
                    col2: {OperationButton: {text: '*'}},
                    col3: {OperationButton: {text: '-'}},
                    col4: {OperationButton: {text: '+'}}
                },
                {
                    col1: {NumberButton: {text: '7'}},
                    col2: {NumberButton: {text: '8'}},
                    col3: {NumberButton: {text: '9'}},
                    col4: {rowspan: 3, OperationButton: {text: 'C', class: 'w3-pale-red', styles: {height: '458px'}}}
                },
                {
                    col1: {NumberButton: {text: '4'}},
                    col2: {NumberButton: {text: '5'}},
                    col3: {NumberButton: {text: '6'}},
                    col4: {}
                },
                {
                    col1: {NumberButton: {text: '1'}},
                    col2: {NumberButton: {text: '2'}},
                    col3: {NumberButton: {text: '3'}},
                    col4: {}
                },
                {
                    col1: {NumberButton: {text: '0'}},
                    col2: {colspan: 3, OperationButton: {text: '=', class: 'w3-pale-green'}},
                    col3: {},
                    col4: {}
                }
            ]
        }}
    ]
});

Component(Calculator);