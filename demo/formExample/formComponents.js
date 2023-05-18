import { Component } from '../../src/index';

export const FormExample = (props, ops) => ({
    _: {
        h2: 'Form Example',
        TitleHeader: props,
        Form: {
            input: event => {
                console.log('ie', event);
                ops.updateState({ [event.target.name]: event.target.value });
            }
        }
    }
});

const TitleHeader = ({ fname, lname }) => ({h5: `Welcome ${fname || ''} ${lname || ''}`});

const Form = ({ input }) => ({
    div: {
        'label[for=fname]': 'First name',
        'input#fname[type=text][name=fname][placeholder=First name]': {
            onInput: input
        },
        br: {},
        'label[for=lname]': 'Last name',
        'input#lname[type=text][name=lname][placeholder=Last name]': {
            onInput: input
        },
    }
});

Component(FormExample, TitleHeader, Form);
