import { App, Key, Component, bindState, useState } from '../../src/index';

const TodoExample = props => ({
    fragment: {
        h2: 'Todo Example',
        'input[type=text][placeholder=Type & Press Enter to Add]': {
            onKeyDown: event => {
                if(event.key === Key.ENTER) {
                    useState(props.stateRef, state => ({
                        list: state.list.concat({li: event.target.value})
                    }));
                    event.target.value = '';
                }
            }
        },
        button: {
            text: 'Clear list',
            onClick: () => App.clearState(props.stateRef)
        },
        Lister: {
            list: props.list
        }
    }
});

const Lister = props => ({ul: props.list});

Component(bindState(TodoExample, {list: [{li: 'What groceries should I buy?'}] }), Lister);