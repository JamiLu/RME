import updateCalculator from '../actions/calculatorAction';

RME.component({ keyPadButton: (props) => ({
        // class: props.class ? props.class : '',
    'button.w3-button.w3-jumbo.keypad-button': {
        text: props.text,
        styles: props.styles,
        class: props.class ? props.class : '',
        onClick: (event) => {
            let elem = Elem.wrap(event.target);
            // Util.setTimeout(() => {
            //     elem.addClasses('animated jello');
            //     elem.onAnimationEnd((event) => {
            //         console.log('anim ended');
            //         elem.removeClasses('animated jello');
            //     });
            // });

            let state = App.getState('calculator');
            switch(props.text) {
                case 'C':
                    updateCalculator({result: '', statement: ''});
                break;
                case '=':
                    updateCalculator({result: eval(state.statement), statement: state.statement+'='});
                break;
                default:
                    updateCalculator({statement: state.statement+props.text})
            }
        }
    }
})});

RME.component({ operationButton: (props) => ({
    keyPadButton: {
        text: props.text,
        styles: props.styles ? props.styles : undefined,
        class: props.class ? props.class : 'w3-pale-blue'
    }
})});

RME.component({ numberButton: (props) => ({
    keyPadButton: {
        text: props.text,
        class: 'w3-light-gray'
    }
})});

RME.component({ keyPad: (props) => ({
    table: props.rows.map(row => ({
        tr: [
            {td: row.col1},
            {td: row.col2},
            {td: row.col3},
            {td: row.col4}
        ]
    }))
})});