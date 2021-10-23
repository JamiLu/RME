import { Component, useValue, bindGetters, CSS } from '../../src/index';

CSS(`
div .clicker-number {
    padding: 10px;
}
`);

const [getValue, setValue] = useValue(0);

const ClickAndShowExample = () => ({
    fragment: {
        h2: 'Click and Show Example',
        'div.w3-bar': {
            Clicker: {},
            ShowValue: {}
        }
    }
});

const Clicker = () => ({
    'div.w3-bar-item': {
        button: {
            text: 'Add one',
            onClick: () => setValue(val => val+1)
        }
    }
});

const ShowValue = (props) => ({
    'div.clicker-number': props.value
});

Component(ClickAndShowExample, Clicker);
Component(bindGetters(ShowValue, {
    value: getValue
}));