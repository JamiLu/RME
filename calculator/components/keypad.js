import updateCalculator from '../actions/calculatorAction';

const keyPadButton = props => ({
    'button.w3-button.w3-jumbo.keypad-button': {
        text: props.text,
        styles: props.styles,
        class: props.class ? props.class : '',
        onClick: () => {
            let state = useState('Calculator');
            switch(props.text) {
                case 'C':
                    updateCalculator({result: '', statement: ''});
                break;
                case '=':
                    updateCalculator({result: eval(state.statement), statement: state.statement+' = '});
                break;
                default:
                    updateCalculator({statement: state.statement+props.text});
            }
        }
    }
});

const operationButton = props => ({
    keyPadButton: {
        text: props.text,
        styles: props.styles ? props.styles : undefined,
        class: props.class ? props.class : 'w3-pale-blue'
    }
});

const numberButton = props => ({
    keyPadButton: {
        text: props.text,
        class: 'w3-light-gray'
    }
});

const KeyPad = props => ({
    table: props.rows.map(row => ({
        tr: [
            {td: row.col1},
            {td: row.col2},
            {td: row.col3},
            {td: row.col4}
        ]
    }))
});

Component(keyPadButton, operationButton, numberButton, KeyPad);