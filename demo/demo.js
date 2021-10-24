import { App } from '../src/index';
import '../demo/clickerExample/clickAndShowComponents'
import '../demo/todoExample/todoComponents';
import '../demo/formExample/formComponents';
import '../demo/filterExample/filterComponents';

App.root('#app').create({
    'div.w3-container': [
        {ClickAndShowExample: {}},

        {TodoExample: {}},

        {FormExample: {}},
        
        {FilterExample: {}}
    ]
});