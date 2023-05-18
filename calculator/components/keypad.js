
export const actions = useValue({result: '', statement: ''});

const [getOperation, setOperation] = actions;

const KeyPadButton = props => ({
    'button.w3-button.w3-jumbo.keypad-button': {
        text: props.text,
        styles: props.styles,
        class: props.class ? props.class : '',
        onClick: () => {
            let savedStatement = getOperation().statement;
            switch(props.text) {
                case 'C':
                    setOperation({result: '', statement: ''});
                break;
                case '=':
                    setOperation({result: eval(savedStatement), statement: savedStatement+' = '});
                break;
                default:
                    setOperation({statement: savedStatement+props.text});
            }
        }
    }
});

const OperationButton = props => ({
    KeyPadButton: {
        text: props.text,
        styles: props.styles ? props.styles : undefined,
        class: props.class ? props.class : 'w3-pale-blue'
    }
});

const NumberButton = props => ({
    KeyPadButton: {
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

Component(KeyPadButton, OperationButton, NumberButton, KeyPad);
