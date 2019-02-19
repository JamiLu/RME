RME.component({ todoExample: () => 
    ({div: {
        h2: () => 'Todo Example',
        'input[type=text][placeholder=Type & Press Enter to Add': {
            onKeyDown: (event) => {
                if(event.key === Key.ENTER) {
                    App.mergeState({lister: {list: {li: {text: event.target.value}}}});
                    event.target.value = "";
                }
            }
        },
        button: {
            text: 'Clear list',
            onClick: () => App.clearState('lister', true)
        },
        lister: {}
    }})
});

App.component({ lister: props => ({ul: props.list}) })();