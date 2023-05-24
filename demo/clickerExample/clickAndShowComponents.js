import { Component, useValue, CSS } from '../../src/index';

CSS(`
div .clicker-number {
    padding: 10px;
}
`);

const [getValue, setValue] = useValue(0);

export const ClickAndShowExample = () => ({
    _: {
        h2: 'Click and Show Example',
        'div.w3-bar': {
            Clicker,
            ShowValue
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

const ShowValue = () => ({
    'div.clicker-number': `${getValue()}`
});

Component(ClickAndShowExample, Clicker, ShowValue);
