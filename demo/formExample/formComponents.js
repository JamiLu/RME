import RME, { App } from '../../src/index';

RME.component({ formExample: () => 
    ({div: {
        h2: () => 'Form Example',
        statefulHeader: {fname: '', lname: ''},
        'component:form': {
            input: (event) => {
                let state = App.getState('statefulHeader');
                state[event.target.name] = event.target.value
                App.mergeState('statefulHeader', state);
            }
        }
    }})
});

App.component({ statefulHeader: props => 
    ({h5: {text: `Welcome ${props.fname} ${props.lname}`}})
})();

RME.component({form: props => ({
    div: {
        'label[for=fname]': () => 'First name',
        input: {
            id: 'fname',
            name: "fname",
            type: "text",
            placeholder: "First name",
            onInput: props.input
        },
        br: {},
        'label[for=lname]': {
            text: 'Last name'
        },
        'input#lname[type=text][name=lname][placeholder=Last name]': {
            onInput: props.input
        },
    }})
});