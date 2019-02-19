RME.component({ resultScreen: (props) => ({
    'div.result-screen.w3-jumbo': [
        {div: {
            text: props.statement
        }},
        {div: {
            text: props.result,
        }}
    ]
})});