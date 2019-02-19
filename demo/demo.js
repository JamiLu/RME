import '../demo/todoExample/todoComponents';
import '../demo/formExample/formComponents';
import '../demo/filterExample/filterComponents';

App.root('#app').create({
    'div.w3-container': [
        {todoExample: {}},

        {formExample: {}},
        
        {filterExample: {}}
    ]
}).setState({
    lister: {list: [{li: () => 'What groceries should I buy?'}]}
});
