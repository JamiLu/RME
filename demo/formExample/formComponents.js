import { Component, bindState, useState } from '../../src/index';

const FormExample = props => ({
    fragment: {
        h2: 'Form Example',
        TitleHeader: props,
        Form: {
            input: event => {
                useState(props.stateRef, state => ({
                    ...state,
                    [event.target.name]: event.target.value
                }));
            }
        }
    }
});

const TitleHeader = props => ({h5: `Welcome ${props.fname || ''} ${props.lname || ''}`});

const Form = props => ({
    div: {
        'label[for=fname]': 'First name',
        'input#fname[type=text][name=fname][placeholder=First name]': {
            onInput: props.input
        },
        br: {},
        'label[for=lname]': 'Last name',
        'input#lname[type=text][name=lname][placeholder=Last name]': {
            onInput: props.input
        },
    }
});

Component(bindState(FormExample), TitleHeader, Form);