import { Key, Component } from '../../src/index';

export const TodoExample = ({ list = [] }, ops) => {

    if (list.length === 0) {
        ops.asyncTask(() => ops.setState({list: [{li: 'What groceries should I buy?'}] }));
    }

    return {
        _: {
            h2: 'Todo Example',
            'input[type=text][placeholder=Type & Press Enter to Add]': {
                onKeyDown: event => {
                    if(event.key === Key.ENTER) {
                        ops.updateState(state => ({
                            list: state.list.concat({li: event.target.value})
                        }));
                        event.target.value = '';
                    }
                }
            },
            button: {
                text: 'Clear list',
                onClick: () => ops.setState({list: [{li: 'What groceries should I buy?'}]})
            },
            Lister: { list }
        }
    }
};

const Lister = ({ list }) => ({ ul: list });

Component(TodoExample, Lister);
